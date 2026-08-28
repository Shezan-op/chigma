/**
 * Tests stdio JSON-RPC communication with scripts/chigma-mcp-bridge.cjs
 */

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

async function testStdioMcp() {
  console.log('Testing MCP Bridge stdio JSON-RPC protocol...');

  const bridgePath = path.join(__dirname, 'chigma-mcp-bridge.cjs');
  const child = spawn('node', [bridgePath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const rl = readline.createInterface({
    input: child.stdout,
    terminal: false
  });

  const responses = [];

  rl.on('line', (line) => {
    try {
      const msg = JSON.parse(line);
      responses.push(msg);
    } catch (e) {}
  });

  // 1. Send initialize
  child.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { clientInfo: { name: 'antigravity-agent', version: '1.0.0' } }
  }) + '\n');

  // 2. Send tools/list
  child.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n');

  await new Promise((r) => setTimeout(r, 1200));

  child.kill();

  console.log(`Received ${responses.length} JSON-RPC responses from MCP bridge.`);
  const initRes = responses.find((r) => r.id === 1);
  const toolsRes = responses.find((r) => r.id === 2);

  if (initRes && initRes.result?.serverInfo?.name === 'chigma-mcp-bridge') {
    console.log('✓ MCP Server Initialized:', initRes.result.serverInfo);
  } else {
    console.error('✗ Initialize failed:', initRes);
  }

  if (toolsRes && Array.isArray(toolsRes.result?.tools)) {
    console.log(`✓ Tools registered (${toolsRes.result.tools.length} tools):`);
    toolsRes.result.tools.forEach((t) => console.log(`   - ${t.name}: ${t.description.slice(0, 60)}...`));
  } else {
    console.error('✗ Tools list failed:', toolsRes);
  }
}

testStdioMcp().catch(console.error);
