# Chigma — System Architecture & Engineering Design

This document details the engineering architecture, data structures, rendering pipelines, state flow, and local storage design for **Chigma**.

---

## 1. Architectural Principles

1. **100% Offline-First**: Zero reliance on external servers, APIs, databases, authentication, or CDNs. Everything executes locally in the browser runtime.
2. **Deterministic Vector Canvas**: All graphical elements (shapes, typography, wireframes, charts, containers) are represented as clean SVG vector primitives in a virtual 2D coordinate space.
3. **Transactional State & Command Pattern**: State mutations (adding, deleting, updating, grouping, reordering) are encapsulated in reversible commands for lossless Undo/Redo.
4. **Frictionless 60fps Interaction**: Pointer event tracking is decoupled from heavy React reconciliations via `requestAnimationFrame` batching during drag, resize, rotate, and marquee operations.

---

## 2. System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CHIGMA EDITOR SHELL                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            TOP TOOLBAR                                │  │
│  │  [Project Title] [Ctrl+K Actions] [Undo/Redo] [Align] [Export Code]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┬──────────────────────────────────────────┬─────────────┐  │
│  │ LEFT SIDEBAR │              SVG 2D CANVAS               │ PROPERTIES  │  │
│  │              │                                          │             │  │
│  │ • Toolstrip  │  • Infinite Viewport (Pan / Zoom)        │ • Geometry  │  │
│  │ • Layer Tree │  • 8-Point Transform Overlay             │ • Fill/     │  │
│  │ • Component  │  • Smart Snapping Guides Overlay         │   Stroke    │  │
│  │   Library    │  • Marquee Drag-to-Select Overlay        │ • Typography│  │
│  │ • Pages Bar  │  • Interactive Double-Click Text Overlay │ • Charts/   │  │
│  │              │  • Pixel Coordinate Rulers               │   Wireframe │  │
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
│  │   useDocumentStore    │ │    useEditorStore    │ │   useProjectStore  │  │
│  │  (Document Tree,      │ │   (Viewport, Tools,  │ │  (Project CRUD,    │  │
│  │   History, Clipboard) │ │    Selection, Overlays)│  Modal Dialogs)    │  │
│  └───────────┬───────────┘ └──────────────────────┘ └──────────┬─────────┘  │
│              │                                                 │            │
│              ▼                                                 ▼            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    IndexedDB via Dexie (ChigmaDB)                     │  │
│  │        • projects (Documents, Pages, Nodes, Timestamps)               │  │
│  │        • preferences (Grid, Rulers, Snap, Last Opened)                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Models (`src/models/`)

### Document Schema
```typescript
interface ChigmaDocument {
  id: string;
  name: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  pages: Page[];
}

interface Page {
  id: string;
  name: string;
  children: ChigmaNode[];
  background?: string;
}
```

### Discriminated Union `ChigmaNode`
All visual entities derive from `BaseNode`:
```typescript
interface BaseNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // 0 - 360 degrees
  opacity: number;  // 0 - 1
  visible: boolean;
  locked: boolean;
  parentId?: string;
}
```

Node types categorized by taxonomy:
- **Primitives**: `RectangleNode`, `EllipseNode`, `LineNode`, `ArrowNode`, `PolygonNode`, `PencilNode`.
- **Typography**: `TextNode` (multi-line, font weight, line height, letter spacing).
- **Containers**: `FrameNode` (with `clipContent` mask), `GroupNode` (composite bounding box).
- **Charts**: `BarChartNode`, `LineChartNode`, `PieChartNode`, `DonutChartNode`.
- **Wireframes (20 components)**: `ButtonNode`, `InputNode`, `TextareaNode`, `CheckboxNode`, `RadioNode`, `ToggleNode`, `DropdownNode`, `NavbarNode`, `SidebarNode`, `CardNode`, `AvatarNode`, `BadgeNode`, `TableNode`, `TabsNode`, `BreadcrumbNode`, `ProgressNode`, `SliderNode`, `PaginationNode`, `ModalNode`, `ToastNode`.

---

## 4. Geometry & Coordinate Transformation Engine (`src/engine/geometry/`)

1. **Screen-to-World & World-to-Screen (`matrix.ts`)**:
   $$\text{worldX} = \frac{\text{screenX} - \text{panX}}{\text{zoom}}$$
   $$\text{worldY} = \frac{\text{screenY} - \text{panY}}{\text{zoom}}$$
2. **Cursor-Centered Zooming**:
   Calculates zoom factors around the exact pointer coordinate to ensure zooming feels natural on trackpads and mouse wheels.
3. **8-Point Resize Engine (`resize.ts`)**:
   Rotates the delta vector by $-\theta$ relative to the bounding box center, scales width/height with aspect-ratio constraints (`Shift`) or center expansion (`Alt`), and recalculates world position.
4. **Smart Alignment Snapping (`snapping.ts`)**:
   Compares dragging element candidate bounding box (left, center, right, top, middle, bottom) against all other active nodes on the page within a 6px threshold. Returns snap offsets and generates magenta guide lines.

---

## 5. Command Pattern & Transactional History (`src/engine/commands/`)

To prevent memory bloat and history pollution:
- **Drag Batching**: While the pointer is actively moving (`onPointerMove`), nodes are updated directly without writing to the command stack.
- **Commit on Release**: On `onPointerUp`, the initial snapshot from `interaction.initialNodes` and the final state are diffed and committed as a single `UpdateNodesPropsCommand`.
- Supported commands:
  - `AddNodesCommand`
  - `DeleteNodesCommand`
  - `UpdateNodesPropsCommand`
  - `GroupNodesCommand`
  - `UngroupNodesCommand`
  - `ReorderNodesCommand`

---

## 6. Code Generation Engine (`src/engine/export/exportCode.ts`)

The wireframe-to-code compiler traverses the vector hierarchy and generates:
1. **Semantic HTML5**: Native elements (`<nav>`, `<aside>`, `<button>`, `<input>`, `<table>`, `<div class="card">`) with positioning styles.
2. **Design System CSS**: Uses Figma `DESIGN.md` CSS variables (`--block-lime`, `--block-lilac`, `--radius-pill`, typography).
3. **Vanilla JS**: Micro-interactions for interactive feedback.
4. **Standalone Bundle**: Downloadable `.html` file that runs in any browser without build tools.

---

## 7. Performance Optimizations

1. **`requestAnimationFrame` Throttling**: Pointer movement coordinates are stored in a mutable ref and processed on the next animation frame, preventing UI lag during multi-node manipulation.
2. **React Memoization**: All SVG element renderers (`ShapeRenderers`, `ChartRenderers`, `WireframeRenderers`, `NodeRenderer`) are wrapped with `React.memo` to eliminate redundant re-renders of untouched nodes.
3. **SVG Hardware Acceleration**: Layer transforms use `translate(x, y) rotate(deg)` allowing browser GPU engines to accelerate canvas updates.
