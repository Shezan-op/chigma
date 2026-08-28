# Chigma Developer Handbook

## Welcome to Chigma

**Chigma** is an offline-first, local-first visual design, wireframing, and prototyping environment built with React 19, TypeScript, and modern web standards.

---

## 1. Architectural Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       Chigma Application                    │
├──────────────────────────────┬──────────────────────────────┤
│  UI Shell & Navigation       │  Scalable SVG Canvas Engine  │
│  - Top Toolbar (38px)        │  - Vector Node Rendering     │
│  - Left Toolstrip (44px)     │  - Rulers & Snap Guides      │
│  - Drawer (Layers/Library)   │  - Distance Measurement      │
│  - Right Inspector (Design)  │  - Transform & Bounding Box  │
│  - Dev Mode (Code Handoff)   │  - Floating Canvas Actions   │
├──────────────────────────────┴──────────────────────────────┤
│                     Core Design Engines                     │
│  - Auto-Layout (Flexbox)     - Components & Instances       │
│  - Design Tokens & Aliases   - True 2D Boolean CSG          │
│  - Responsive Preview        - Bézier Pen Node Editor       │
│  - Interactive Prototyping   - Asset Optimization Engine    │
├──────────────────────────────┬──────────────────────────────┤
│    Offline & Persistence     │    AI & MCP Connectivity     │
│  - Dexie IndexedDB Database  │  - Rule-Based Offline AI     │
│  - Autosave Debounce         │  - Local Ollama Provider     │
│  - Document Validator        │  - OpenAI-Compatible API     │
│  - Storage Quota Estimator   │  - Vision Screenshot Context │
│  - Crash Recovery Snapshot   │  - Local Stdio-to-WS Bridge  │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Document Data Model

The central document structure is defined in `src/models/document.ts`:
- **`ChigmaDocument`**: Contains metadata, page array, variable collections, component masters, and snapshots.
- **`ChigmaPage`**: Represents a canvas page containing an array of `ChigmaNode` elements.
- **`ChigmaNode`**: Polymorphic node model supporting frames, rectangles, ellipses, text, buttons, cards, navbars, tables, charts, and SVG vectors.

### Node Types
- `frame`: Container node supporting auto-layout (direction, gap, padding, wrap) and clipping.
- `rectangle`, `ellipse`, `polygon`, `line`, `arrow`: Vector primitives with fills, strokes, corner radii, and drop shadows.
- `text`: Typography node with auto-width/height and font styling.
- `button`, `card`, `navbar`, `sidebar`, `table`: Wireframe components with parametric properties.
- `line-chart`, `bar-chart`, `donut-chart`: Procedural vector charts.
- `instance`: Reusable component instance with overrides linked to a `ComponentMaster`.

---

## 3. Design System & Tokens

Tokens are organized in `variableCollections` and resolved via `src/engine/variables/variableResolver.ts`:
- **Modes**: Supports Light, Dark, High Contrast, Compact, and custom brand themes.
- **Multi-Hop Aliases**: Handles alias chains such as `color.primary -> brand.blue.600` with automatic cycle detection.
- **Token Resolution**: `resolveColor(doc, 'var_primary', modeId)` and `resolveSpacing(doc, 'var_gap')`.

---

## 4. MCP & External Agent Bridge

Chigma features an external Model Context Protocol bridge allowing external LLM agents (Claude Code, Cursor, Codex, Windsurf) to inspect and edit designs:
- Bridge Daemon: `node scripts/chigma-mcp-bridge.cjs`
- Transports: Stdio (external agent) <-> WebSocket `127.0.0.1:4040` (browser editor).
- Semantic tools: `chigma_get_project`, `chigma_create_screen`, `chigma_create_section`, `chigma_modify_node`, `chigma_apply_design_system`, `chigma_export_code`.

---

## 5. Development Workflow

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest unit & E2E tests
npm test

# Build production bundle
npm run build

# Start external MCP bridge daemon
node scripts/chigma-mcp-bridge.cjs
```
