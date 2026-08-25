# Chigma — System Architecture & Engineering Design

This document details the engineering architecture, data structures, rendering pipelines, state flow, and local storage design for **Chigma**.

---

## 1. Architectural Principles

1. **100% Offline-First**: Zero reliance on external servers, APIs, databases, authentication, or CDNs. Everything executes locally in the browser runtime.
2. **Deterministic Vector Canvas**: All graphical elements (shapes, typography, wireframes, charts, containers) are represented as clean SVG vector primitives in a virtual 2D coordinate space.
3. **Figma-Style Auto-Layout & Spacing Math**: Container frames calculate child bounding boxes, gaps, and cross-axis alignment deterministically.
4. **Interactive Prototyping State Graph**: Interactive nodes link to target pages and render within responsive device frames with click hotspots.
5. **Progressive Web App (PWA) Offline Engine**: Service Worker caching and standalone manifest for desktop and mobile installations.
6. **Transactional State & Command Pattern**: State mutations are encapsulated in reversible commands for lossless Undo/Redo.
7. **Frictionless 60fps Interaction**: Pointer event tracking is decoupled from heavy React reconciliations via `requestAnimationFrame` batching during drag, resize, rotate, and marquee operations.

---

## 2. System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CHIGMA EDITOR SHELL                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            TOP TOOLBAR                                │  │
│  │  [Project Title] [Quick Actions] [Undo/Redo] [Present] [Export Code]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┬──────────────────────────────────────────┬─────────────┐  │
│  │ LEFT SIDEBAR │              SVG 2D CANVAS               │ PROPERTIES  │  │
│  │              │                                          │             │  │
│  │ • Toolstrip  │  • Infinite Viewport (Pan / Zoom)        │ • Geometry  │  │
│  │ • Layer Tree │  • 8-Point Transform Overlay             │ • AutoLayout│  │
│  │ • Component  │  • Smart Snapping & Alt Distance Guides  │ • Spacing   │  │
│  │   & Section  │  • Marquee Drag-to-Select Overlay        │ • Prototyping│
│  │   Library    │  • Interactive Double-Click Text Overlay │ • Fill/     │  │
│  │ • Pages Bar  │  • Pixel Coordinate Rulers               │   Stroke    │  │
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
│  │   AutoLayout, Stacks, │ │    Alt Distance,     │ │   Modal Dialogs,   │  │
│  │   Interaction Links)  │ │    Prototype Player) │ │   Templates)       │  │
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

### Auto-Layout & Prototyping Types
```typescript
export interface AutoLayoutConfig {
  enabled: boolean;
  direction: 'horizontal' | 'vertical';
  gap: number;
  paddingX: number;
  paddingY: number;
  alignItems: 'start' | 'center' | 'end' | 'stretch';
  justifyContent: 'start' | 'center' | 'end' | 'space-between';
}

export interface InteractionLink {
  trigger: 'click' | 'hover';
  action: 'navigate' | 'openModal' | 'back' | 'url';
  targetPageId?: string;
  targetUrl?: string;
}
```

---

## 4. Auto-Layout & Spacing Math (`src/engine/layout/autoLayout.ts`)

- **Flow Calculation**: When a Frame has `autoLayout.enabled = true`, children are ordered along the main axis with defined `gap` and `padding`:
  $$\text{child}_i.\text{offset} = \text{padding} + \sum_{k=0}^{i-1} (\text{child}_k.\text{size} + \text{gap})$$
- **Cross-Axis Alignment**: Adjusts child positioning perpendicular to flow (`start`, `center`, `end`).
- **Stack Packing**: Calculates delta offsets for arbitrary multi-selections, instantly aligning elements into clean rows or columns.

---

## 5. Smart Distance Measurement Engine (`src/components/editor/DistanceMeasurementOverlay.tsx`)

When the user holds **`Alt`** / **`Option`**, the vector distance calculation computes:
- $\text{gap}_x = \text{target.left} - \text{selected.right}$ (when selected is left of target)
- $\text{gap}_y = \text{target.top} - \text{selected.bottom}$ (when selected is above target)
- Renders non-scaling SVG lines and high-contrast measurement pill badges directly on the canvas.

---

## 6. Prototyping Player (`src/components/prototype/PrototypePlayerModal.tsx`)

- Provides fullscreen simulation of wireframe flows.
- Traverses `node.interaction.targetPageId` on click to trigger animated transitions.
- Supports 4 device preview frames: **Desktop (1280x800)**, **iPad Air (820x1180)**, **iPhone 15 Pro (393x852)**, and **Fullscreen (100%)**.

---

## 7. Progressive Web App (PWA) Offline Architecture

- `public/manifest.webmanifest`: Configures standalone app launching on mobile (iOS/Android) and desktop (Chrome/Edge/Safari).
- `public/sw.js`: Service worker implementing cache-first fetching with offline fallback.
