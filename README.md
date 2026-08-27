# Chigma — Offline Local Wireframing & Visual Design Tool

**Chigma** is a desktop & mobile progressive web application (PWA) for visual design, wireframing, design systems, and interactive prototyping inspired by Figma. Built with a confident monochrome editorial frame and playful pastel accents, it delivers a smooth, responsive, professional editor for drawing wireframes, UI components, diagrams, layouts, dashboards, and clickable interactive prototypes.

Everything runs **100% locally** in the browser with **zero cloud dependencies, zero authentication, zero tracking, and zero external APIs**.

---

## 🌟 Highlights & Features

### 1. Master Components & Reusable Instances (❖ / ◇)
- **Master Component Engine (`Ctrl+Alt+K`)**: Create single-source-of-truth master components (`❖`) that automatically propagate visual and geometric updates across all pages.
- **Linked Instances**: Create instances (`◇`) with fine-grained local overrides (text copy, fills, dimensions) that persist through master updates.
- **Component Swapping & Detaching**: Swap component instances via dropdown or detach to independent native elements with 1 click.

### 2. Design Tokens & Multi-Mode Variables
- **Design Tokens & Variable Resolver**: Built-in collections for Colors, Figma Pastel blocks, and Spacing scales.
- **Multi-Mode Support**: Switch effortlessly between **Light Mode** and **Dark Mode**.
- **1-Click CSS Export**: Generates clean `:root { --color-primary: ... }` custom properties for modern frontend stylesheets.

### 3. Advanced Styling, Independent Radii & Effects
- **Independent 4-Corner Radii**: Configure distinct `topLeft`, `topRight`, `bottomRight`, and `bottomLeft` values with linked/unlinked toggle.
- **Stackable Fills & Gradients**: Solid colors, Linear Gradients, and Radial Gradients with customizable angles, stops, and 12 blend modes.
- **Multi-Effect Shadows & Blurs**: Drop Shadows, Inner Shadows, Layer Blurs, and Background Blurs rendered via dynamic SVG `<filter>` definitions.

### 4. Responsive Constraints & Device Breakpoint Preview
- **Constraint Anchors**: Horizontal (`left`, `center`, `right`, `left_right` / Fill, `scale`) and Vertical (`top`, `center`, `bottom`, `top_bottom` / Fill, `scale`).
- **Responsive Preview Modal**: Test designs across **Mobile (iPhone 15)**, **Tablet (iPad Air)**, **Laptop (MacBook)**, and **Desktop (1440p)** with an interactive draggable width slider.

### 5. Vector Icon Library & Custom Asset Importer
- **50+ Built-In Vector Icons**: Standardized on a 24×24px grid across 12 categories with a visual search picker (`I` / `Shift+I`).
- **Drag & Drop Importer**: Ingest external `.svg` files (sanitized to native vectors) and local images (`.png`, `.jpg`, `.webp`) directly onto the canvas.

### 6. WCAG 2.1 Accessibility & Quality Inspector
- **Automated Page Audit**: Computes accessibility score (0-100%) against WCAG 2.1 AA/AAA guidelines.
- **Checks**: Touch target minimum sizes (<44×44px warning), color contrast ratios (<4.5:1 text warnings), and missing input labels.

### 7. Figma Auto-Layout & Precision Spacing Stacks
- **Auto-Layout Containers**: Define horizontal (row) or vertical (column) flow with exact gaps and padding (X/Y).
- **1-Click Multi-Selection Stacks**: Instantly arrange any selected elements into clean rows or columns with spacing presets (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Smart Distance Guides (Hold `Alt` / `Option`)**: Live pixel distance badges showing exact gaps to nearby elements and frames.
- **Smart Duplicate with Offset Memory (`Ctrl+D`)**: Clones elements and remembers displacement distance for rapid grid/list building.

### 8. Interactive Prototyping Mode & Device Frames
- **"Present" Fullscreen Player (`Ctrl+Alt+Enter` / `F5`)**: Test wireframe user journeys interactively.
- **Clickable Hotspots**: Link buttons, cards, and text to target screens/pages.
- **Device Frame Switcher**: Switch between **MacBook Desktop**, **iPhone 15 Pro**, **iPad Air**, and **Fullscreen Canvas**.

### 9. Wireframe-to-Code Generator (HTML + CSS + JS)
- 1-Click conversion of canvas elements into clean, semantic **HTML5**, responsive **CSS** (with design tokens, gradients, and shadows), and interactive **JavaScript**.
- Live syntax-highlighted code preview with 1-click Copy and `.html` file download (`Ctrl+Shift+C`).

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Shezan-op/chigma.git
cd chigma

# Install dependencies
npm install

# Run automated test suite
npm test

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
| **Ctrl + Alt + K** | Convert Selection to Master Component |
| **Shift + D** | Open Design System & Variables Modal |
| **Shift + I** / **I** | Open Vector Icon Library |
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

- [ARCHITECTURE.md](file:///c:/Users/techt/chigma/ARCHITECTURE.md): Deep-dive into data models, rendering engine, master components, design tokens, responsive math, prototyping state machine, and offline Dexie IndexedDB storage.
- [DESIGN_SYSTEM.md](file:///c:/Users/techt/chigma/DESIGN_SYSTEM.md): Visual design specifications, color tokens, typography scales, and component anatomy.
- [CHANGELOG.md](file:///c:/Users/techt/chigma/CHANGELOG.md): Complete release and feature history.

---

## 📄 License
MIT License. Built for local-first design and wireframing.
