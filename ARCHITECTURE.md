# Chigma — System Architecture & Engineering Design

This document details the engineering architecture, data structures, rendering pipelines, state flow, and local storage design for **Chigma**.

---

## 1. Architectural Principles

1. **100% Offline-First**: Zero reliance on external servers, APIs, databases, authentication, or CDNs. Everything executes locally in the browser runtime.
2. **Deterministic Vector Canvas**: All graphical elements (shapes, typography, wireframes, charts, containers, vector icons) are represented as clean SVG vector primitives in a virtual 2D coordinate space.
3. **Master Component & Instance Hierarchy**: Master components (`❖`) act as single sources of truth. Instances (`◇`) inherit geometry, fills, typography, and effects while maintaining non-destructive overrides.
4. **Design Tokens & Variable Resolver**: Multi-mode token collections (Light/Dark mode) driving dynamic color palettes, typography scales, and spacing units with 1-click CSS Custom Property export (`:root { --token: ... }`).
5. **Responsive Constraints & Resizing Math**: Container frames calculate child bounding boxes, gaps, and responsive anchor deltas (`left`, `center`, `right`, `left_right`, `scale`, `top`, `bottom`, `top_bottom`) deterministically across device breakpoints.
6. **Built-in Quality Inspection**: WCAG 2.1 AA/AAA compliance audit engine computing touch target sizes and color contrast ratios directly in memory.
7. **Transactional State & Command Pattern**: State mutations are encapsulated in reversible commands for lossless Undo/Redo (`Ctrl+Z`, `Ctrl+Y`).
8. **Frictionless 60fps Interaction**: Pointer event tracking is decoupled from heavy React reconciliations via `requestAnimationFrame` batching during drag, resize, rotate, and marquee operations.

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CHIGMA EDITOR SHELL                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            TOP TOOLBAR                                │  │
│  │  [Project Title] [Quick Tools] [Undo/Redo] [Icons] [Tokens] [Audit]   │  │
│  │  [Responsive Preview] [Present] [Export Code]                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┬──────────────────────────────────────────┬─────────────┐  │
│  │ LEFT SIDEBAR │              SVG 2D CANVAS               │ PROPERTIES  │  │
│  │              │                                          │             │  │
│  │ • Toolstrip  │  • Infinite Viewport (Pan / Zoom)        │ • Geometry  │  │
│  │ • Layer Tree │  • Dynamic SvgDefs (Gradients & Filters) │ • AutoLayout│  │
│  │ • Master     │  • 8-Point Transform Overlay             │ • Radii     │  │
│  │   Components │  • Smart Snapping & Alt Distance Guides  │ • Fills     │  │
│  │ • Icon Picker│  • Marquee Drag-to-Select Overlay        │ • Strokes   │  │
│  │ • Section    │  • Interactive Double-Click Text Overlay │ • Effects   │  │
│  │   Library    │  • Pixel Coordinate Rulers               │ • Component │  │
│  │ • Pages Bar  │  • Drag & Drop Asset Importer            │ • Constraint│  │
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
│  │  • Document Tree (v2) │ │   • Viewport Pan/Zoom│ │  • Project CRUD    │  │
│  │  • Master Components  │ │   • Tool State       │ │  • Dexie DB Bridge │  │
│  │  • VariableCollection │ │   • Alt Distance     │ │  • Starter         │  │
│  │  • Reusable Styles    │ │   • Modal Triggers   │ │    Templates       │  │
│  │  • Command History    │ │   • Prototype Player │ │  • Confirm Modals  │  │
│  └───────────┬───────────┘ └──────────────────────┘ └──────────┬─────────┘  │
│              │                                                 │            │
│              ▼                                                 ▼            │
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
}

export interface ComponentMaster {
  id: string;
  name: string;
  mainNodeId: string;
  description?: string;
  variants?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export interface DesignVariable {
  id: string;
  name: string;
  type: 'color' | 'number' | 'string' | 'boolean';
  value: string | number;
  valuesByMode?: Record<string, string | number>;
}
```

---

## 4. Master Component & Instance Engine (`src/engine/components/`)

- **Creation**: `createComponentMaster(node)` wraps a target node, generates a unique component master record, and stamps the node with `isComponent: true`.
- **Instantiation**: `createInstanceFromMaster(master, masterNode, x, y)` clones geometry and styling while maintaining the link via `instanceOf: master.id`.
- **Overrides**: Node updates on an instance store diffs in `node.overrides`. When the master updates, `syncInstanceWithMaster(instance, masterNode)` reapplies master updates while strictly preserving instance overrides.
- **Detaching**: `detachInstance(instance)` unlinks the instance, converting it to an independent native node.

---

## 5. Responsive Constraints & Resizing Engine (`src/engine/layout/responsiveEngine.ts`)

- **Constraint Anchor Deltas**: When a parent frame resizes from $(W_0, H_0)$ to $(W_1, H_1)$ with $\Delta W = W_1 - W_0$ and $\Delta H = H_1 - H_0$:
  - `left`: $X_1 = X_0$, $W_1 = W_0$
  - `right`: $X_1 = X_0 + \Delta W$, $W_1 = W_0$
  - `center`: $X_1 = X_0 + \frac{\Delta W}{2}$, $W_1 = W_0$
  - `left_right` (Fill): $X_1 = X_0$, $W_1 = W_0 + \Delta W$
  - `scale`: $X_1 = \frac{X_0}{W_0} \cdot W_1$, $W_1 = \frac{W_0}{W_0} \cdot W_1$
- **Min/Max Sizing**: Enforces `minWidth`, `maxWidth`, `minHeight`, `maxHeight` boundaries during resizing.

---

## 6. Accessibility & Contrast Inspector (`src/engine/quality/accessibilityChecker.ts`)

- **Luminance & Contrast**: Implements the WCAG 2.1 relative luminance formula:
  $$L = 0.2126 R + 0.7152 G + 0.0722 B$$
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
- **Touch Target Validation**: Scans interactive nodes (`button`, `input`, `dropdown`, `toggle`) for physical dimensions below $44 \times 44\text{px}$.

---

## 7. Vector Icon Library & Custom Asset Importer

- **Built-in Registry (`src/engine/icons/iconRegistry.ts`)**: 50+ optimized SVG icons categorized into Navigation, Actions, Communication, Media, Commerce, Files, Users, Settings, Status, Arrows, Editor, and Social.
- **Drag & Drop Importer (`src/engine/assets/assetImporter.ts`)**: Ingests external `.svg` files (sanitizing and extracting `viewBox`/paths) and bitmap images (`.png`, `.jpg`, `.webp`) as base64 data URLs.
