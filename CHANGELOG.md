# Changelog

All notable changes to the **Chigma** local-first wireframing, prototyping, and visual design platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-08-26

### 🚀 Added
- **Figma Auto-Layout & Spacing Stacks (`autoLayout.ts`)**:
  - Horizontal & Vertical auto-layout for frame containers with configurable gap, padding (X/Y), and alignment.
  - Multi-selection 1-click **Row Stack** & **Column Stack** with preset spacing tokens (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Interactive Prototyping Mode & Player (`PrototypePlayerModal.tsx`)**:
  - Fullscreen interactive presentation view (`Present` button or `Ctrl+Alt+Enter` / `F5`).
  - Device frame preview modes: **Desktop (MacBook)**, **Tablet (iPad Air)**, **Mobile (iPhone 15 Pro)**, and **Fullscreen Canvas**.
  - Interactive hotspot link triggers to navigate between screens on click with visual pulse feedback.
- **Smart Distance Measurement Guides (Hold `Alt` / `Option`)**:
  - Displays real-time pixel distance badges (e.g. `16px`, `24px`, `32px`, `8px`) and guideline arrows between the selected element and any hovered element/frame boundary.
- **Smart Duplicate with Offset Memory (`Ctrl+D`)**:
  - Clones elements and automatically memorizes displacement vectors to repeat the exact spacing offset on consecutive duplicates.
- **Arrow Key Nudging**:
  - Precision 1px nudge with Arrow keys (`↑`, `↓`, `←`, `→`), and 8px (grid unit) nudge with `Shift + Arrow keys`.
- **Pre-Built Wireframe Section Blocks Library**:
  - 1-Click insertion of pre-composed wireframe modules:
    - *Hero Header Section*
    - *Pricing 3-Tier Comparison Grid*
    - *Feature 3-Card Grid*
    - *Sign In / Auth Form Card*
    - *User Profile Header with Stats*
    - *Newsletter Subscribe Banner*
- **Progressive Web App (PWA) & Mobile Support**:
  - Offline Service Worker (`sw.js`) and `manifest.webmanifest`.
  - Responsive collapsible sidebars and touch-friendly targets for mobile phones and tablets.

---

## [1.1.0] - 2026-08-26

### 🎨 Added
- **Figma Design System Integration (`DESIGN.md`)**:
  - Implemented crisp monochrome editorial theme frame (`#000000` ink, `#FFFFFF` canvas, `#E6E6E6` hairline borders).
  - Integrated signature Figma pastel block palette: `block-lime` (`#DCEEB1`), `block-lilac` (`#C5B0F4`), `block-cream` (`#F4ECD6`), `block-pink` (`#EFD4D4`), `block-mint` (`#C8E6CD`), `block-coral` (`#F3C9B6`), `block-navy` (`#1F1D3D`), and `accent-magenta` (`#FF3D8B`).
  - Added pill-shaped CTAs (`rounded-pill: 50px`) and refined micro-interactions.
- **Wireframe-to-Code Generator (`exportCode.ts` & `CodeExportModal.tsx`)**:
  - Exports canvas elements to semantic HTML5, modern CSS stylesheets, and vanilla JS.
  - Multi-tab code preview (Full HTML Bundle, HTML Snippet, CSS Stylesheet, JavaScript).
  - 1-click Copy Code to clipboard and 1-click download of `.html` bundle.
- **Figma Quick Actions / Command Palette (`Ctrl+K` / `Cmd+K`)**:
  - Instant searchable command modal to insert 20+ wireframe components, switch tools, change zoom levels, export code, or toggle canvas options.
- **Quick Wireframe Starter Templates**:
  - *SaaS Landing Page*, *Mobile App Wireframe*, *Analytics Dashboard*.
- **Pixel Coordinate Rulers (`RulersOverlay.tsx`)**:
  - Horizontal and vertical rulers with adaptive world coordinate tick marks scaling with zoom (`Shift+R`).
- **Hand Tool & Spacebar Pan (`H` / Spacebar)**:
  - Frictionless panning across infinite canvas coordinates.
- **Direct Project Deletion & Project Manager Enhancements**:
  - Quick-delete button on project cards with confirmation modal, project duplication, and search filter.

---

## [1.0.0] - 2026-08-25

### 🚀 Initial Release
- **Core Vector Canvas**: SVG-based rendering system with 5% to 3200% zoom.
- **Primitives**: Rectangle, Ellipse, Line, Arrow, Polygon, Pencil path, and direct SVG text.
- **20+ Wireframe Components**: Button, Input, Textarea, Checkbox, Radio, Toggle, Dropdown, Navbar, Sidebar, Card, Avatar, Badge, Table, Tabs, Breadcrumb, Progress bar, Slider, Pagination, Modal, Toast.
- **Data Charts**: Bar Chart, Line Chart, Pie Chart, Donut Chart with editable data tables.
- **Transform & Snapping Engine**: 8-point resize handles (Shift for aspect-ratio, Alt for center scale), 360° rotation handle with 45° snapping, and smart alignment guides.
- **Transactional History**: Command pattern undo/redo stack (`Ctrl+Z`, `Ctrl+Y`).
- **IndexedDB Persistence**: Offline database via Dexie (`ChigmaDB`) with 600ms debounced autosave.
- **Export Formats**: `.chigma.json` project export/import, standalone vector `.svg`, and retina-scaled `.png`.
