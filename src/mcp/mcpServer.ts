import { MCP_TOOL_DEFINITIONS, executeMcpTool } from './mcpTools';
import { MCP_RESOURCES, readMcpResource } from './mcpResources';
import { MCP_PROMPTS } from './mcpPrompts';
import type { ChigmaDocument } from '../models/document';

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id?: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export class ChigmaMcpServer {
  private document: ChigmaDocument;
  private activePageId?: string;

  constructor(document: ChigmaDocument, activePageId?: string) {
    this.document = document;
    this.activePageId = activePageId;
  }

  setDocument(doc: ChigmaDocument, activePageId?: string) {
    this.document = doc;
    this.activePageId = activePageId;
  }

  handleRequest(req: JsonRpcRequest): JsonRpcResponse {
    const id = req.id;

    switch (req.method) {
      // 1. Initialize
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2026-07-28',
            capabilities: {
              tools: {},
              resources: {},
              prompts: {}
            },
            serverInfo: {
              name: 'chigma-mcp-server',
              version: '2.0.0'
            }
          }
        };

      // 2. Tools
      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOL_DEFINITIONS
          }
        };

      case 'tools/call': {
        const { name, arguments: args } = req.params || {};
        const outcome = executeMcpTool(name, args || {}, this.document, this.activePageId);
        if (!outcome.success) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: outcome.error || 'Tool execution failed'
            }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(outcome.data, null, 2)
              }
            ]
          }
        };
      }

      // 3. Resources
      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            resources: MCP_RESOURCES
          }
        };

      case 'resources/read': {
        const { uri } = req.params || {};
        const data = readMcpResource(uri, this.document);
        if (!data) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: `Resource not found: ${uri}`
            }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: data.mimeType,
                text: data.contents
              }
            ]
          }
        };
      }

      // 4. Prompts
      case 'prompts/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            prompts: MCP_PROMPTS
          }
        };

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${req.method}`
          }
        };
    }
  }
}
