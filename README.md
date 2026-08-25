# Chigma — Offline Local Wireframing & Visual Design Tool

**Chigma** is a desktop & mobile progressive web application (PWA) for visual design, wireframing, and interactive prototyping inspired by Figma. Built with a confident monochrome editorial frame and playful pastel accents, it delivers a smooth, responsive, professional editor for drawing wireframes, diagrams, layouts, dashboards, and clickable interactive prototypes.

Everything runs **100% locally** in the browser with **zero cloud dependencies, zero authentication, and zero external APIs**.

---

## 🌟 Highlights & Features

### 1. Figma Auto-Layout & Precision Spacing Stacks
- **Auto-Layout Containers**: Define horizontal (row) or vertical (column) flow with exact gaps and padding (X/Y).
- **1-Click Multi-Selection Stacks**: Instantly arrange any selected elements into clean rows or columns with spacing presets (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Smart Distance Guides (Hold `Alt` / `Option`)**: Live pixel distance badges showing exact gaps to nearby elements and frames.
- **Smart Duplicate with Offset Memory (`Ctrl+D`)**: Clones elements and remembers displacement distance for rapid grid/list building.
- **Arrow Key Nudging**: `1px` precision nudge, `8px` (grid step) nudge with `Shift + Arrow`.

### 2. Interactive Prototyping Mode & Device Frames
- **"Present" Fullscreen Player (`Ctrl+Alt+Enter` / `F5`)**: Test wireframe user journeys interactively.
- **Clickable Hotspots**: Link buttons, cards, and text to target screens/pages.
- **Device Frame Switcher**: Switch between **MacBook Desktop**, **iPhone 15 Pro**, **iPad Air**, and **Fullscreen Canvas**.

### 3. Pre-Built Wireframe Section Blocks
- **1-Click Insertable Sections**:
  - *Hero Header Section* (Eyebrow, title, subhead, CTA buttons)
  - *Pricing 3-Tier Comparison Grid* (Free, Pro, Enterprise)
  - *Feature 3-Card Grid* (Icon, header, body)
  - *Sign In / Auth Form Card* (Email, password, remember me, submit)
  - *User Profile Header with Stats* (Avatar, bio, badges, follow)
  - *Newsletter Subscribe Banner* (Title, input, subscribe pill)

### 4. 20+ Vector Wireframe UI Components & Charts
- **Components**: Buttons, Inputs, Textareas, Checkboxes, Radios, Toggles, Dropdowns, Navbars, Sidebars, Cards, Avatars, Badges, Tables, Tabs, Breadcrumbs, Progress Bars, Sliders, Pagination, Modals, and Toasts.
- **Data Charts**: Bar Charts, Line Trend Charts, Pie Charts, and Donut Charts with editable datasets.
- **Vector Primitives**: Rectangles, Ellipses, Lines, Arrows, Polygons, and freehand Pencil tool.

### 5. Wireframe-to-Code Generator (HTML + CSS + JS)
- 1-Click conversion of canvas elements into clean, semantic **HTML5**, responsive **CSS** (with design tokens), and interactive **JavaScript**.
- Live syntax-highlighted code preview with 1-click Copy and `.html` file download.

### 6. Progressive Web App (PWA) & Mobile-First Touch
- **Installable PWA**: Installable as a native desktop/mobile app via `manifest.webmanifest` and offline Service Worker (`sw.js`).
- **Touch-Friendly & Responsive**: Responsive collapsible drawers and toolbar adaptations for iPads, tablets, and phones.

### 7. 60fps Infinite Canvas & Geometry Engine
- **Frictionless 60fps Performance**: Optimized pointer loops via `requestAnimationFrame` for lag-free dragging, resizing, and rotating.
- **Hand Tool & Spacebar Pan (`H` / Spacebar)**: Smooth infinite pan navigation across any zoom level (5% to 3200%).
- **Pixel Coordinate Rulers**: Scalable horizontal and vertical coordinate rulers (`Shift+R`).

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
| **Ctrl + Alt + Enter** / **F5** | Play Interactive Prototype (Presentation Mode) |
| **Ctrl + Shift + C** | Export Wireframe to Code (HTML/CSS) |
| **Hold Alt / Option** | Measure Pixel Distance to Hovered Elements |
| **Arrow Keys (↑ ↓ ← →)** | Nudge Selected Elements by 1px |
| **Shift + Arrow Keys** | Nudge Selected Elements by 8px (Grid Step) |
| **Ctrl + D** | Smart Duplicate with Offset Memory |
| **V** | Select Tool |
| **H** / **Space + Drag** | Hand Tool (Pan Canvas) |
| **F** | Frame Tool |
| **R** | Rectangle Tool |
| **E** | Ellipse Tool |
| **L** | Line Tool |
| **A** | Arrow Tool |
| **T** | Text Tool |
| **P** | Pencil Tool |
| **Ctrl + Z** / **Ctrl + Y** | Undo / Redo |
| **Ctrl + G** / **Ctrl + Shift + G** | Group / Ungroup |
| **Ctrl + '** | Toggle Dot Grid |
| **Shift + R** | Toggle Pixel Coordinate Rulers |

---

## 📚 Architectural & Engineering Documentation

- [ARCHITECTURE.md](file:///c:/Users/techt/chigma/ARCHITECTURE.md): Deep-dive into data models, rendering engine, auto-layout math, prototyping state machine, and offline Dexie IndexedDB storage.
- [DESIGN_SYSTEM.md](file:///c:/Users/techt/chigma/DESIGN_SYSTEM.md): Visual design specifications, color tokens, typography scales, and component anatomy.
- [CHANGELOG.md](file:///c:/Users/techt/chigma/CHANGELOG.md): Complete release and feature history.

---

## 📄 License
MIT License. Built for local-first design and wireframing.
