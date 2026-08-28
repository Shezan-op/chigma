# Chigma MCP Architecture & External Agent Bridge

## Overview

The Model Context Protocol (MCP) in Chigma exposes the design engine directly to external AI coding agents (Claude Code, Cursor, Codex, Windsurf) over stdio and local WebSockets.

```text
┌─────────────────────────────────────────────────────────────┐
│          External AI Agent (Claude Code / Cursor)           │
└──────────────────────────────┬──────────────────────────────┘
                               │  stdio (JSON-RPC 2.0)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Chigma Local MCP Bridge Daemon                     │
│          (scripts/chigma-mcp-bridge.cjs)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │  WebSocket (ws://127.0.0.1:4040)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Active Chigma Browser Instance                     │
│          (src/mcp/mcpBridgeClient.ts)                       │
├─────────────────────────────────────────────────────────────┤
│  - executeMcpTool()                                         │
│  - useDocumentStore (Dexie IndexedDB + React State)         │
│  - SVG Vector Canvas Engine                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Core MCP Tools

| Tool Name | Description |
| :--- | :--- |
| `chigma_get_project` | Retrieves project metadata, page list, variable collections, and components |
| `chigma_get_page` | Retrieves vector elements and hierarchy for a specified page ID |
| `chigma_get_selection` | Retrieves currently selected nodes on the canvas |
| `chigma_get_design_snapshot` | Returns structured semantic layout and token data |
| `chigma_create_node` | Adds a button, card, navbar, table, chart, or vector shape |
| `chigma_create_screen` | Generates a full Desktop, Mobile, or Tablet artboard |
| `chigma_create_section` | Inserts prebuilt wireframe sections (hero, pricing, features, auth) |
| `chigma_modify_node` | Modifies properties (geometry, styling, fills, constraints, text) |
| `chigma_apply_auto_layout` | Configures auto-layout flexbox container rules |
| `chigma_apply_design_system` | Applies primary palette, corner radii, and background styles |
| `chigma_inspect_design` | Runs design linter returning health score and warnings |
| `chigma_export_code` | Generates production React + Tailwind, Next.js, or CSS code |

---

## 2. Setting Up External Agents

### Configuring Claude Code / MCP Clients
Add the following to your MCP client configuration (e.g. `claude_desktop_config.json` or MCP settings):

```json
{
  "mcpServers": {
    "chigma": {
      "command": "node",
      "args": ["scripts/chigma-mcp-bridge.cjs"]
    }
  }
}
```

1. Start Chigma in your browser: `npm run dev` and open `http://localhost:5173`.
2. Start the MCP bridge: `node scripts/chigma-mcp-bridge.cjs`.
3. In Claude Code / Cursor, prompt: *"Create a modern SaaS dashboard in Chigma with revenue charts and KPI cards."*
4. Watch the design generate live inside your browser canvas!
