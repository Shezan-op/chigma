# Chigma — System Architecture & Engineering Design

This document details the engineering architecture, data structures, rendering pipelines, state flow, AI systems, MCP protocol, and local storage design for **Chigma**.

---

## 1. Architectural Principles

1. **100% Offline-First**: Zero reliance on external servers, APIs, databases, authentication, or CDNs. Everything executes locally in the browser runtime.
2. **Deterministic Vector Canvas**: All graphical elements (shapes, typography, wireframes, charts, containers, vector icons) are represented as clean SVG vector primitives in a virtual 2D coordinate space.
3. **Master Component & Instance Hierarchy**: Master components (`❖`) act as single sources of truth. Instances (`◇`) inherit geometry, fills, typography, and effects while maintaining non-destructive overrides.
4. **Design Tokens & Variable Resolver**: Multi-mode token collections (Light/Dark mode) driving dynamic color palettes, typography scales, and spacing units with 1-click CSS Custom Property export (`:root { --token: ... }`).
5. **AI Co-Designer & Transactional Rollback**: Embedded deterministic rule-based generator creating dashboards, landing pages, and spacing alignments with before/after diffs and 1-click rollback.
6. **Model Context Protocol (MCP) Standard**: Standard 2026-07-28 JSON-RPC server exposing tools, resources, and prompts directly to external AI assistants (Claude Code, Cursor, Codex).
7. **Multi-Framework Code Handoff & Dev Mode**: Seamless export of nodes and auto-layout frames into React + Tailwind CSS, Next.js App Router, and CSS stylesheets.
8. **Responsive Constraints & Resizing Math**: Container frames calculate child bounding boxes, gaps, and responsive anchor deltas (`left`, `center`, `right`, `left_right`, `scale`, `top`, `bottom`, `top_bottom`) deterministically across device breakpoints.
9. **Built-in Quality Inspection**: WCAG 2.1 AA/AAA compliance audit engine computing touch target sizes and color contrast ratios directly in memory.
10. **Transactional State & Command Pattern**: State mutations are encapsulated in reversible commands for lossless Undo/Redo (`Ctrl+Z`, `Ctrl+Y`).

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CHIGMA EDITOR SHELL                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            TOP TOOLBAR                                │  │
│  │  [Title] [Mode: Design/Dev/Proto] [AI Co-Designer] [/ Quick Insert]   │  │
│  │  [Health Inspector] [Decision Log] [Snapshots] [MCP Server] [Present]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┬──────────────────────────────────────────┬─────────────┐  │
│  │ LEFT SIDEBAR │              SVG 2D CANVAS               │ RIGHT PANEL │  │
│  │              │                                          │             │  │
│  │ • Toolstrip  │  • Infinite Viewport (Pan / Zoom)        │ [Design]    │  │
│  │ • Layer Tree │  • Dynamic SvgDefs (Gradients & Filters) │ • Properties│  │
│  │ • Master     │  • 8-Point Transform Overlay             │ • AutoLayout│  │
│  │   Components │  • Smart Snapping & Alt Distance Guides  │ • Radii     │  │
│  │ • Icon Picker│  • Marquee Drag-to-Select Overlay        │ • Fills     │  │
│  │ • Section    │  • Interactive Double-Click Text Overlay │ • Effects   │  │
│  │   Library    │  • Pixel Coordinate Rulers               │             │  │
│  │ • Pages Bar  │  • Drag & Drop Asset Importer            │ [Dev Mode]  │  │
│  │              │                                          │ • Box Model │  │
│  │              │                                          │ • CSS Vars  │  │
│  │              │                                          │ • React/Tail│  │
│  └──────────────┴──────────────────────────────────────────┴─────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                             STATUS BAR                                │  │
│  │  [Selection: (X, Y, W, H)] [Zoom: 100%] [Grid: 8px] [Autosaved]       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE & STATE LAYER                          │
│                                                                             │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐  │
│  │   useDocumentStore    │ │    useEditorStore    │ │usePrototypeStore │  │
│  │  • Document Tree (v2) │ │   • Mode & Modals    │ │ • Session Vars   │  │
│  │  • Master Components  │ │   • Viewport Pan/Zoom│ │ • Overlays       │  │
│  │  • VariableCollection │ │   • Tool State       │ │ • Event History  │  │
│  │  • Decision Log       │ │   • AI Panel State   │ │ • Debugger HUD   │  │
│  │  • Snapshots History  │ │   • Alt Distance     │ │                  │  │
│  └───────────┬───────────┘ └──────────────────────┘ └────────────────────┘  │
│              │                                                              │
│              ▼                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    IndexedDB via Dexie (ChigmaDB)                     │  │
│  │        • projects (Documents v2, Pages, Nodes, Components)            │  │
│  │        • preferences (Grid, Rulers, Snap, Theme, Last Opened)         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Models (`src/models/`)

### Document Schema (Version 2)
```typescript
export interface ChigmaDocument {
  id: string;
  name: string;
  schemaVersion: number; // v2
  version: number;
  createdAt: number;
  updatedAt: number;
  pages: Page[];
  components?: ComponentMaster[];
  styles?: ReusableStyle[];
  variableCollections?: VariableCollection[];
  activeModeId?: string; // 'light' | 'dark'
  decisionLog?: DecisionLogEntry[];
  snapshots?: ProjectSnapshot[];
}

export interface DecisionLogEntry {
  id: string;
  date: number;
  decision: string;
  reason: string;
  affectedAreas?: string[];
  author?: string;
}

export interface ProjectSnapshot {
  id: string;
  name: string;
  timestamp: number;
  description?: string;
  documentState: any;
}
```

---

## 4. AI Co-Designer Architecture (`src/engine/ai/`)

- **Provider Abstraction (`aiProvider.ts`)**: Supports offline rule-based generation alongside optional local Ollama (`http://localhost:11434`), OpenAI, and Anthropic APIs.
- **Semantic Context Extractor (`aiContextBuilder.ts`)**: Summarizes pages, active selections, token collections, and component signatures into token-efficient JSON.
- **Transactional Orchestrator (`aiOrchestrator.ts`)**: Plans task execution, logs decision notes, and creates checkpoints prior to applying mutations for 1-click rollback.

---

## 5. Model Context Protocol (MCP) Server (`src/mcp/`)

- Conforms to **JSON-RPC 2.0 (2026-07-28 specification)**.
- Implements 8+ tools: `get_project`, `get_page`, `get_node`, `create_node`, `modify_node`, `apply_auto_layout`, `inspect_design`, `export_code`.
- Implements resources (`chigma://project/current`, `chigma://design-system`, `chigma://components`) and prompts (`design-review`, `create-saas-dashboard`, `make-responsive`).

---

## 6. Prototyping Session State Machine (`src/store/usePrototypeSessionStore.ts`)

- **State Isolation**: Interactive sessions operate on an ephemeral store holding `variables`, `historyStack`, `activeOverlays`, and `interactionLogs`.
- **Condition Engine**: Evaluates logical operators (`==`, `!=`, `>`, `<`, `>=`, `<=`) before executing navigation or overlay triggers.
- **Overlay Stacks**: Mounts modal, drawer, dropdown, and bottom-sheet layers with backdrop dismiss rules.

---

## 7. Multi-Framework Code Generator (`src/engine/export/exportMultiFramework.ts`)

- **React + Tailwind CSS**: Idiomatic functional components with typed props interfaces and clean utility classes.
- **Next.js App Router**: Client-component compatible (`'use client'`) exports.
- **CSS Stylesheets**: Standalone classes with CSS custom properties.

---

## 8. Quality & Design Health Linter (`src/engine/quality/designLinter.ts`)

- Real-time audit producing a 0-100% **Design Health Score**.
- Audits grid adherence (4px/8px alignment), design token binding (detecting unlinked hex values), touch target sizes ($\ge 44\times 44\text{px}$), and text contrast ($\ge 4.5:1$ WCAG AA).
