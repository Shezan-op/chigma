# Chigma MCP Server Setup Guide

## Overview
Chigma exposes a standard **Model Context Protocol (MCP)** server over JSON-RPC 2.0 (specification 2026-07-28). This allows external AI assistants—such as Claude Code, Cursor, Codex, and VS Code—to inspect, query, refactor, and manipulate Chigma visual design files in real time.

## 1. Connecting with Claude Code / Claude Desktop
Add Chigma to your Claude configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "chigma": {
      "command": "node",
      "args": ["path/to/chigma/dist/mcp-server.js"],
      "env": {}
    }
  }
}
```

## 2. Connecting with Cursor IDE
In Cursor **Settings > Features > MCP**:
1. Click **+ Add New MCP Server**.
2. **Name**: `Chigma Design Engine`
3. **Type**: `command`
4. **Command**: `node path/to/chigma/dist/mcp-server.js`

## 3. In-Browser MCP Debugger
Inside Chigma, open **MCP Protocol Server** from the top toolbar or press `Ctrl+K > MCP Server` to:
- Test tool executions live against your canvas.
- View supported protocol version (`2026-07-28`).
- Copy client connection JSON snippet.
