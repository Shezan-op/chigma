# Chigma — Offline Local Wireframing & Visual Design Tool

**Chigma** is a desktop-first, browser-only visual design and wireframing platform inspired by Figma. Built with a confident monochrome editorial frame and playful pastel accents, it delivers a smooth, responsive, professional editor for drawing wireframes, diagrams, layouts, and dashboards.

Everything runs **100% locally** in the browser with **zero cloud dependencies, zero authentication, and zero external APIs**.

---

## 🌟 Highlights & Features

### 1. Vector Drawing & Typography
- **Shapes & Primitives**: Rectangle, Ellipse, Line, Arrow, Polygon (custom side count), and freehand Pencil tool.
- **Styling**: Solid, dashed, dotted strokes; corner radius; opacity; and rotation.
- **Figma Pastel Color Swatches**: Direct access to signature pastel blocks (`block-lime`, `block-lilac`, `block-cream`, `block-pink`, `block-mint`, `block-coral`, `block-navy`, `accent-magenta`).
- **Direct Multi-line Typography**: Inter typography with font weights (400-700), line heights, letter spacing, alignments, and inline double-click editing.

### 2. 20+ Vector Wireframe UI Components
- **Inputs & Controls**: Buttons (primary, secondary, outline, ghost, danger), Text Inputs, Textareas, Checkboxes, Radio Buttons, Toggle Switches, Dropdowns, Sliders, and Progress Bars.
- **Structure & Containers**: Navbars, Sidebars, Content Cards, Avatars, Badges, Data Tables, and Tab bars.
- **Overlays & Feedback**: Modal Dialogs, Toast Notifications, Breadcrumbs, and Pagination bars.
- **Containers**: Frame nodes with clip-path support and multi-node Groups with coordinate normalization.

### 3. Interactive Data Charts
- **Bar Charts**, **Line Trend Charts**, **Pie Charts**, and **Donut Charts** with live data editing in the properties panel.

### 4. 60fps Infinite Canvas & Geometry Engine
- **Frictionless 60fps Performance**: Pointer event processing optimized with `requestAnimationFrame` for lag-free dragging, resizing, and rotating.
- **Hand Tool & Spacebar Pan (`H` / Spacebar)**: Smooth infinite pan navigation across the canvas.
- **Pixel Coordinate Rulers**: Scalable horizontal and vertical coordinate rulers (`Shift+R`).
- **8-Point Transform Overlay**: Resize handles with Shift (aspect-ratio lock) and Alt (center scale), plus a 360° rotation handle with 45° angle snapping.
- **Smart Alignment & Dot Grid**: Dynamic edge/center alignment snapping with live magenta guide overlays, plus 8px dot grid snapping.

### 5. Wireframe-to-Code Generator (HTML + CSS + JS)
- 1-Click conversion of your visual wireframe into clean, semantic **HTML5**, responsive **CSS** (using design tokens), and interactive **JavaScript**.
- Live code preview modal with copy-to-clipboard and `.html` bundle download.

### 6. Figma Quick Actions / Command Palette (`Ctrl+K`)
- Instant keyboard-driven command palette to search and execute actions, insert components, switch tools, toggle rulers, and export code.

### 7. Instant Starter Templates
- **SaaS Landing Page** (Hero section, pill badges, CTA buttons, metrics bar chart, and feature cards).
- **Mobile App Wireframe** (Phone frame, user avatar feed, and bottom tab navigation).
- **Analytics Dashboard** (Sidebar, KPI summary cards, line trend chart, donut chart, and data table).

### 8. Transactional History & Local Persistence
- **Command Pattern**: Reversible undo/redo stack (`Ctrl+Z`, `Ctrl+Y`) with debounced drag batching.
- **Offline IndexedDB**: Fast client-side persistence via Dexie (`ChigmaDB`) with 600ms debounced autosave.
- **Export Formats**: `.chigma.json` project export/import, standalone vector `.svg`, high-resolution `.png`, and full `.html` code bundles.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Shezan-op/chigma.git
cd chigma

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| **Ctrl + K** / **Cmd + K** | Open Command Palette / Quick Actions |
| **Ctrl + Shift + C** | Export Wireframe to Code (HTML/CSS) |
| **V** | Select Tool |
| **H** / **Space + Drag** | Hand Tool (Pan Canvas) |
| **F** | Frame Tool |
| **R** | Rectangle Tool |
| **E** | Ellipse Tool |
| **L** | Line Tool |
| **A** | Arrow Tool |
| **T** | Text Tool |
| **P** | Pencil Tool |
| **Ctrl + Z** | Undo |
| **Ctrl + Y** / **Ctrl + Shift + Z** | Redo |
| **Ctrl + C** / **Ctrl + X** / **Ctrl + V** | Copy / Cut / Paste |
| **Ctrl + D** | Duplicate Selection |
| **Ctrl + G** / **Ctrl + Shift + G** | Group / Ungroup |
| **Ctrl + A** | Select All Elements |
| **Delete** / **Backspace** | Delete Selected Elements |
| **Ctrl + +** / **Ctrl + -** | Zoom In / Zoom Out |
| **Ctrl + 0** | Reset Zoom (100%) |
| **Ctrl + '** | Toggle Dot Grid |
| **Shift + R** | Toggle Pixel Coordinate Rulers |

---

## 📚 Architectural & Engineering Documentation

- [ARCHITECTURE.md](file:///c:/Users/techt/chigma/ARCHITECTURE.md): Deep-dive into data models, rendering engine, coordinate geometry, and transactional state design.
- [DESIGN_SYSTEM.md](file:///c:/Users/techt/chigma/DESIGN_SYSTEM.md): Visual design specifications, color tokens, typography scales, and UI component anatomy.
- [CHANGELOG.md](file:///c:/Users/techt/chigma/CHANGELOG.md): Complete release and feature history.

---

## 📄 License
MIT License. Built for local-first design and wireframing.
