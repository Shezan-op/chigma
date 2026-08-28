#!/usr/bin/env node
/**
 * Chigma Local MCP Bridge Daemon
 * 
 * Implements JSON-RPC 2.0 Model Context Protocol (MCP) over stdio.
 * Connects external AI coding agents (Claude Code, Cursor, Codex, Windsurf)
 * to live in-browser Chigma document instances via local WebSocket on 127.0.0.1:4040.
 */

const http = require('http');
const readline = require('readline');
const crypto = require('crypto');

const PORT = 4040;
const HOST = '127.0.0.1';

// Connected browser client sockets
let activeBrowserSocket = null;
let pendingRequests = new Map();

// Tool Definitions for MCP
const TOOLS = [
  {
    name: 'chigma_get_project',
    description: 'Retrieves current Chigma project metadata, page list, variable collections, and components.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'chigma_get_page',
    description: 'Retrieves all vector elements and layout hierarchy for the active or specified page ID.',
    inputSchema: {
      type: 'object',
      properties: { pageId: { type: 'string', description: 'Page ID' } }
    }
  },
  {
    name: 'chigma_get_selection',
    description: 'Retrieves currently selected nodes in the active Chigma canvas.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'chigma_get_design_snapshot',
    description: 'Generates a semantic structured summary of the design layout, tokens, and components.',
    inputSchema: {
      type: 'object',
      properties: { target: { type: 'string', enum: ['selection', 'page', 'project'] } }
    }
  },
  {
    name: 'chigma_create_node',
    description: 'Creates a new vector shape, text, button, card, navbar, or chart on the active canvas page.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Node type e.g. button, card, frame, text, rectangle, ellipse' },
        x: { type: 'number', description: 'X position' },
        y: { type: 'number', description: 'Y position' },
        customProps: { type: 'object', description: 'Custom properties like width, height, fill, label' }
      },
      required: ['type']
    }
  },
  {
    name: 'chigma_create_screen',
    description: 'Creates a full artboard frame (Desktop 1440x1024, Mobile 375x812, Tablet 768x1024).',
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: ['desktop', 'mobile', 'tablet'] },
        name: { type: 'string', description: 'Screen name' },
        x: { type: 'number' },
        y: { type: 'number' }
      }
    }
  },
  {
    name: 'chigma_create_section',
    description: 'Generates and inserts a prebuilt wireframe section (hero, pricing, features, auth, profile).',
    inputSchema: {
      type: 'object',
      properties: {
        sectionType: { type: 'string', enum: ['hero', 'pricing', 'features', 'auth', 'profile', 'newsletter'] },
        x: { type: 'number' },
        y: { type: 'number' }
      },
      required: ['sectionType']
    }
  },
  {
    name: 'chigma_modify_node',
    description: 'Modifies properties (geometry, styling, text, fills, cornerRadius) of an existing node.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Node ID to update' },
        updates: { type: 'object', description: 'Properties to modify' }
      },
      required: ['nodeId', 'updates']
    }
  },
  {
    name: 'chigma_apply_auto_layout',
    description: 'Configures auto-layout flexbox container rules on a frame.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Frame node ID' },
        direction: { type: 'string', enum: ['horizontal', 'vertical'] },
        gap: { type: 'number', description: 'Gap in px' }
      },
      required: ['nodeId', 'direction', 'gap']
    }
  },
  {
    name: 'chigma_inspect_design',
    description: 'Runs design linter on the active design, calculating health score and listing spacing/token issues.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'chigma_export_code',
    description: 'Exports a selected component or screen to React + Tailwind, Next.js, or CSS.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Node ID to export' },
        format: { type: 'string', enum: ['react_tailwind', 'nextjs', 'css'] }
      },
      required: ['nodeId']
    }
  }
];

// Initialize Local HTTP & WebSocket Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      bridge: 'chigma-mcp-bridge',
      connectedBrowser: Boolean(activeBrowserSocket)
    }));
    return;
  }

  res.writeHead(404);
  res.end('Chigma MCP Bridge');
});

// Simple WebSocket upgrade handler without external deps
server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const hash = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${hash}\r\n\r\n`
  );

  activeBrowserSocket = socket;

  socket.on('data', (buffer) => {
    try {
      // Decode WebSocket text frame
      const text = decodeWsFrame(buffer);
      if (!text) return;
      const msg = JSON.parse(text);

      if (msg.type === 'response' && msg.id && pendingRequests.has(msg.id)) {
        const resolve = pendingRequests.get(msg.id);
        pendingRequests.delete(msg.id);
        resolve(msg.result);
      }
    } catch (e) {
      // ignore parse error
    }
  });

  socket.on('close', () => {
    if (activeBrowserSocket === socket) {
      activeBrowserSocket = null;
    }
  });
});

function decodeWsFrame(buffer) {
  if (buffer.length < 2) return null;
  const isMasked = (buffer[1] & 0x80) === 0x80;
  let length = buffer[1] & 0x7f;
  let offset = 2;

  if (length === 126) {
    length = buffer.readUInt16BE(2);
    offset += 2;
  } else if (length === 127) {
    length = Number(buffer.readBigUInt64BE(2));
    offset += 8;
  }

  let mask = null;
  if (isMasked) {
    mask = buffer.subarray(offset, offset + 4);
    offset += 4;
  }

  const payload = buffer.subarray(offset, offset + length);
  if (isMasked && mask) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= mask[i % 4];
    }
  }

  return payload.toString('utf8');
}

function sendWsMessage(socket, data) {
  const jsonStr = JSON.stringify(data);
  const payload = Buffer.from(jsonStr, 'utf8');
  const len = payload.length;

  let header;
  if (len <= 125) {
    header = Buffer.from([0x81, len]);
  } else if (len <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  socket.write(Buffer.concat([header, payload]));
}

server.listen(PORT, HOST, () => {
  // Started listening on 127.0.0.1:4040
});

// Setup Stdio JSON-RPC interface for Claude Code / MCP Clients
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendRpcResponse(id, result, error) {
  const response = { jsonrpc: '2.0', id };
  if (error) response.error = error;
  else response.result = result;
  process.stdout.write(JSON.stringify(response) + '\n');
}

rl.on('line', async (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    sendRpcResponse(null, null, { code: -32700, message: 'Parse error' });
    return;
  }

  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      sendRpcResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: {
          name: 'chigma-mcp-bridge',
          version: '1.0.0'
        }
      });
      break;

    case 'notifications/initialized':
      // Client ack
      break;

    case 'ping':
      sendRpcResponse(id, {});
      break;

    case 'tools/list':
      sendRpcResponse(id, { tools: TOOLS });
      break;

    case 'tools/call': {
      const toolName = params?.name;
      const args = params?.arguments || {};
      const internalTool = toolName?.replace('chigma_', '');

      if (!activeBrowserSocket) {
        sendRpcResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                errorCode: 'SESSION_NOT_FOUND',
                error: 'No active Chigma browser editor connected on ws://127.0.0.1:4040. Open Chigma in your browser to execute live mutations.'
              }, null, 2)
            }
          ]
        });
        return;
      }

      // Forward request to in-browser Chigma instance
      const reqId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const promise = new Promise((resolve) => {
        pendingRequests.set(reqId, resolve);
        setTimeout(() => {
          if (pendingRequests.has(reqId)) {
            pendingRequests.delete(reqId);
            resolve({ success: false, error: 'Request timed out waiting for browser response' });
          }
        }, 15000);
      });

      sendWsMessage(activeBrowserSocket, {
        type: 'tool_call',
        id: reqId,
        tool: internalTool,
        args
      });

      const res = await promise;
      sendRpcResponse(id, {
        content: [
          {
            type: 'text',
            text: typeof res === 'string' ? res : JSON.stringify(res, null, 2)
          }
        ]
      });
      break;
    }

    default:
      sendRpcResponse(id, null, { code: -32601, message: `Method not found: ${method}` });
      break;
  }
});
