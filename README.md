# Chigma — Offline Local Wireframing & Visual Design Tool

**Chigma** is a desktop-first, browser-only visual design and wireframing tool inspired by Figma. It is designed to be lightweight, lightning-fast, and completely independent of any server, cloud service, API, authentication, or internet connection.

Everything in Chigma runs 100% locally in the browser using React, TypeScript, SVG, Zustand, and Dexie (IndexedDB).

---

## 🌟 Features

### 1. Vector Drawing & Shapes
- **Primitives**: Rectangle, Ellipse, Line, Arrow, Polygon (custom side count), and freehand Pencil tool.
- **Styling**: Solid, dashed, and dotted strokes with custom stroke widths; solid and transparent fills with a preset color palette; adjustable corner radius, opacity, and rotation.
- **Direct Text Tool**: Multi-line SVG text engine with Inter typography, line heights, letter spacing, font weights (400, 500, 600, 700), and italic support. Double-click to edit inline.

### 2. 20+ Vector Wireframe UI Components
- **Inputs & Controls**: Buttons (primary, secondary, outline, ghost, danger), Text Inputs, Textareas, Checkboxes, Radio Buttons, Toggle Switches, Dropdowns, Sliders, and Progress Bars.
- **Layout & Structure**: Navbars, Sidebars, Content Cards (with optional header images and footer links), Avatars, Badges, Data Tables, and Tab bars.
- **Overlays & Feedback**: Modal Dialogs, Toast Notifications, Breadcrumbs, and Pagination bars.

### 3. Interactive Data Charts
- **Bar Charts**, **Line Trend Charts**, **Pie Charts**, and **Donut Charts**.
- Configurable titles, grid lines, axes, data items, and live color themes.

### 4. Interactive Canvas & Geometry Engine
- **8-Point Transform Overlay**: Resize handles with Shift (aspect-ratio lock) and Alt/Option (center resize) modifiers, plus a 360° rotation handle with 45° angle snapping.
- **Smart Alignment & Snapping**: Object edge/center alignment snapping with live magenta alignment guides, plus configurable 8px grid snapping.
- **Multi-Selection & Marquee**: Drag-to-select marquee box, Shift+Click multi-selection, alignment (left, center, right, top, middle, bottom), and distribution (horizontal, vertical).
- **Grouping & Hierarchy**: Group multiple objects (Ctrl+G) and ungroup (Ctrl+Shift+G) with bounding box encapsulation and coordinate mapping.
- **Layer Management**: Multi-page support, layer tree with drag reordering, z-index controls (Bring to Front, Send to Back, Move Forward/Backward), lock/unlock, visibility toggle, and inline layer renaming.

### 5. Transactional Undo/Redo & Local Persistence
- **Command History**: Transactional command pattern with debounced drag batching, 50-step history stack, and descriptive action labels.
- **Offline Persistence**: Fast, resilient client-side storage using Dexie IndexedDB (`ChigmaDB`), with 600ms debounced autosave.
- **Export & Import**:
  - Export document to `.chigma.json` and import projects from JSON files.
  - Export clean vector `.svg` with embedded typography.
  - Export high-resolution `.png` at 1x, 2x, or 3x retina scale using offscreen HTML5 canvas rendering.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone or navigate to the repository
cd chigma

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Production Build
```bash
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🏗️ Architecture & Codebase Structure

```
chigma/
├── public/
│   └── favicon.svg               # Vector SVG application favicon
├── src/
│   ├── app/                      # High-level application views
│   │   ├── Editor.tsx            # Main editor shell & panel layout
│   │   └── ProjectManager.tsx    # Offline project dashboard & template cards
│   ├── components/               # UI components
│   │   ├── dialogs/              # Modals (Export, Import, Shortcuts, Confirm)
│   │   ├── editor/               # Canvas, Transform handles, Overlays, Marquee
│   │   ├── layers/               # Layer tree, Page tabs, Z-index controls
│   │   ├── panels/               # Component library drawer, Status bar
│   │   ├── properties/           # Dynamic Inspector (Geometry, Stroke/Fill, Charts, Wireframes)
│   │   └── toolbar/              # Toolstrip (V, R, E, T, etc.) and Top action bar
│   ├── engine/                   # Core math, rendering, and command engines
│   │   ├── commands/             # Undo/Redo Command pattern implementation
│   │   ├── export/               # JSON, SVG, and PNG rasterizers
│   │   ├── geometry/             # Bounds, Matrix, Point rotation, Resize, Snapping
│   │   ├── renderer/             # React SVG renderers (Shapes, Text, Charts, Wireframes)
│   │   └── shortcuts/            # Global keyboard shortcuts listener
│   ├── models/                   # TypeScript interfaces & discriminated unions
│   │   ├── charts.ts             # Chart data types
│   │   ├── document.ts           # ChigmaDocument, Page, default node factory
│   │   ├── node.ts               # Discriminated union of all 20+ ChigmaNode types
│   │   ├── styles.ts             # Fill, stroke, and typography specifications
│   │   └── wireframes.ts         # Wireframe property schemas
│   ├── persistence/              # Local storage adapters
│   │   ├── autosave.ts           # Debounced autosave hook
│   │   ├── db.ts                 # Dexie IndexedDB database schema
│   │   ├── preferencesStorage.ts # LocalStorage for grid & sidebar preferences
│   │   └── projectStorage.ts     # Project CRUD operations
│   ├── store/                    # Zustand reactive state stores
│   │   ├── useDocumentStore.ts   # Active document tree, page management, undo/redo
│   │   ├── useEditorStore.ts     # Viewport, selection, active tool, snapping guides
│   │   └── useProjectStore.ts    # Projects metadata & active project loader
│   ├── styles/                   # Modern Figma-inspired CSS design system
│   └── utils/                    # Color, ID generation, math, and file utilities
├── package.json
└── tsconfig.json
```

---

## 🔄 Undo / Redo Mechanics

Chigma uses an explicit **Command Pattern** (`src/engine/commands/`):
- Every state-modifying action (adding elements, deleting, reordering, updating properties, grouping, ungrouping) is encapsulated in an instance of the `Command` interface with `execute()` and `undo()` methods.
- **Drag Batching**: Continuous interactions (dragging, resizing, rotating, freehand drawing) update transient node geometry in memory without polluting the history stack; upon pointer release (`onPointerUp`), a single aggregated `UpdateNodesPropsCommand` is committed to `CommandHistory`.
- The undo stack (`Ctrl+Z`) and redo stack (`Ctrl+Shift+Z` / `Ctrl+Y`) maintain up to 50 transactional actions.

---

## 💾 Local Persistence Architecture

1. **IndexedDB via Dexie (`ChigmaDB`)**:
   - `projects`: Stores complete document JSON trees with pages, nodes, metadata, and timestamps.
   - `preferences`: Stores user preferences (grid size, snap toggles, last active tab).
2. **Debounced Autosave (`src/persistence/autosave.ts`)**:
   - Watches `documentState.isDirty` and triggers a background write to IndexedDB after 600ms of idle time.
3. **100% Offline**:
   - Zero telemetry, zero network requests, zero server dependencies.

---

## 🛠️ Adding a New Node Type (Developer Guide)

To add a new shape, chart, or wireframe component to Chigma:

1. **Define the Node Interface (`src/models/node.ts`)**:
   ```ts
   export interface MyCustomNode extends BaseNode {
     type: 'my-custom';
     customProp: string;
     fill?: string;
   }
   ```
   Add `MyCustomNode` to the master `ChigmaNode` union.

2. **Add Factory Defaults (`src/models/document.ts`)**:
   In `createDefaultNode(type, x, y, customProps)`:
   ```ts
   case 'my-custom':
     return {
       ...base,
       type: 'my-custom',
       name: 'Custom Component',
       width: 140,
       height: 60,
       customProp: 'Example',
       ...customProps
     };
   ```

3. **Create the SVG Renderer (`src/engine/renderer/`)**:
   Create `MyCustomRenderer.tsx`:
   ```tsx
   export const MyCustomRenderer: React.FC<{ node: MyCustomNode }> = ({ node }) => (
     <g>
       <rect width={node.width} height={node.height} rx={6} fill={node.fill || '#3B82F6'} />
       <text x={node.width / 2} y={node.height / 2 + 4} fill="#FFF" textAnchor="middle">
         {node.customProp}
       </text>
     </g>
   );
   ```
   Hook it into `src/engine/renderer/NodeRenderer.tsx`.

4. **Add Property Controls (`src/components/properties/`)**:
   Add an editor section in `WireframeSection.tsx` or create a new inspector section.

5. **Register in Component Library (`src/components/panels/ComponentLibraryPanel.tsx`)**:
   Add the item metadata and icon so users can insert it with 1 click.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| **V** | Select Tool |
| **F** | Frame Tool |
| **R** | Rectangle Tool |
| **E** | Ellipse Tool |
| **L** | Line Tool |
| **A** | Arrow Tool |
| **T** | Text Tool |
| **P** | Pencil Tool |
| **Ctrl + Z** | Undo |
| **Ctrl + Shift + Z** / **Ctrl + Y** | Redo |
| **Ctrl + C** | Copy Selection |
| **Ctrl + X** | Cut Selection |
| **Ctrl + V** | Paste Selection |
| **Ctrl + D** | Duplicate Selection |
| **Ctrl + G** | Group Selected Nodes |
| **Ctrl + Shift + G** | Ungroup Selected Group |
| **Ctrl + A** | Select All Nodes |
| **Delete** / **Backspace** | Delete Selected Nodes |
| **Ctrl + +** / **Ctrl + -** | Zoom In / Zoom Out |
| **Ctrl + 0** | Reset Zoom (100%) |
| **Alt + Drag** | Pan Viewport / Scale from Center |
| **Shift + Drag** | Constrain Aspect Ratio / Snap Rotation to 45° |

---

## 📄 License
MIT License. Built for offline productivity.
