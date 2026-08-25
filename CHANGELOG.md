# Changelog

All notable changes to the **Chigma** local-first wireframing and visual design platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - *SaaS Landing Page*: Hero section, pill badges, CTA buttons, metrics bar chart, and feature cards.
  - *Mobile App Wireframe*: Mobile phone frame container, user avatar feed, and bottom tab navigation.
  - *Analytics Dashboard*: App sidebar, KPI summary cards, line trend chart, donut chart, and data table.
- **Pixel Coordinate Rulers (`RulersOverlay.tsx`)**:
  - Horizontal and vertical rulers with adaptive world coordinate tick marks scaling with zoom. Toggle with `Shift+R`.
- **Hand Tool & Spacebar Pan (`H` / Spacebar)**:
  - Figma-style frictionless panning across infinite canvas coordinates.
- **Direct Project Deletion & Project Manager Enhancements**:
  - Quick-delete button on project cards with confirmation modal.
  - Search filter for offline projects.
  - Project duplication and inline renaming.

### ⚡ Performance & Polish
- **60fps Frictionless Canvas Rendering**:
  - Implemented `requestAnimationFrame` throttled pointer move loop for drag, resize, rotate, and marquee operations, eliminating interaction lag.
  - Sub-pixel SVG rendering optimizations.

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
