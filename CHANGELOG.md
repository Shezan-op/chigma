# Changelog

All notable changes to the **Chigma** local-first wireframing, prototyping, and visual design platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-08-27 (Phase 2 Master Architecture)

### 🤖 AI Co-Designer & Agentic Workflows
- **Model Provider Abstraction (`src/engine/ai/aiProvider.ts`)**:
  - Deterministic `RuleBasedOfflineAiProvider` generating full SaaS analytics dashboards, high-converting marketing landing pages, and smart spacing alignments without internet access.
  - Pluggable provider interface ready for local Ollama (`http://localhost:11434`), OpenAI, and Anthropic endpoints.
- **AI Context Builder & Orchestrator (`src/engine/ai/aiContextBuilder.ts`, `aiOrchestrator.ts`)**:
  - Converts canvas document graphs into token-efficient semantic trees.
  - Step-by-step execution planner with progress animations, before/after diff summary, and 1-click **Rollback / Undo**.
- **Chigma AI Assistant Sidebar (`AiAgentPanel.tsx` / `Shift+A`)**:
  - Embedded AI assistant with quick prompts, live execution stream, and direct canvas insertion.

### 🌐 Model Context Protocol (MCP) Server
- **Standard 2026-07-28 JSON-RPC Engine (`src/mcp/mcpServer.ts`, `mcpTools.ts`, `mcpResources.ts`, `mcpPrompts.ts`)**:
  - Exposes 8+ core design tools: `get_project`, `get_page`, `get_node`, `create_node`, `modify_node`, `apply_auto_layout`, `inspect_design`, `export_code`.
  - Exposes design resources (`chigma://project/current`, `chigma://design-system`, `chigma://components`) and prompts (`design-review`, `create-saas-dashboard`, `make-responsive`).
  - Interactive **MCP Status & Debugger Modal (`McpModal.tsx`)** to test JSON-RPC calls live in the browser and copy configuration for Claude Code, Cursor, and Codex.

### ⚡ Dev Mode & Multi-Framework Code Handoff
- **Dev Mode / Handoff Inspector (`DevModePanel.tsx`)**:
  - 3-segmented mode switch in TopToolbar: **Design** | **Dev Mode** | **Prototype**.
  - Live Box-model metrics (width, height, coordinates, radii) and CSS custom property view.
  - Multi-framework code generators in `exportMultiFramework.ts`:
    - **React + TypeScript (Tailwind CSS)**
    - **Next.js App Router Client Component (`'use client'`)**
    - **CSS Stylesheet with Variables**
  - 1-click "Copy Code" button.

### 🛡️ Design Health Linter & Quality Inspector
- **Design Quality & Linter Engine (`designLinter.ts`, `DesignLinterModal.tsx` / `Shift+L`)**:
  - Computes composite **Design Health Score (0-100%)** with category breakdown (Spacing, Tokens, Accessibility, Consistency).
  - Detects off-grid coordinates, unlinked magic colors vs design tokens, and undersized touch targets (<44×44px).
  - 1-click **Auto-Align Spacing (8px)** and per-issue auto-fix actions.

### 🕹️ Advanced Prototyping 2.0 & Runtime State Machine
- **Interactive Prototyping State Machine (`usePrototypeSessionStore.ts`)**:
  - Isolated runtime managing session variables (`cartCount`, active tabs, flags), conditional branching (`==`, `!=`, `>`, `<`), and overlay stacks (`modal`, `drawer`, `dropdown`, `bottomSheet`).
  - Interactive **Prototype Debugger HUD** showing live variable inspection and real-time interaction event stream in `PrototypePlayerModal.tsx`.

### 🗂️ Version History, Decision Log & Workspace Backups
- **Project Snapshots & Version History (`SnapshotsModal.tsx`)**: Named checkpoints with 1-click restore.
- **Design Decision Log (`DecisionLogModal.tsx`)**: Track architectural rationales and design intent.
- **Workspace Backup & Storage Monitor (`workspaceBackup.ts`)**: Export/import all workspace projects in one `.chigma-workspace.json` file.
- **Quick Insert Component Palette (`QuickInsertModal.tsx` / `/`)**: Fast keyboard-accessible component palette.


### ❖ Master Components & Instance Architecture
- **Master Component Engine (`src/engine/components/componentEngine.ts`)**:
  - Convert any element or frame to a Master Component (`❖ Main Component`) with `Ctrl+Alt+K` or Properties Panel.
  - Spawn linked Instances (`◇ Instance`) that inherit geometry, typography, fills, and effects from their master.
  - Fine-grained property overrides (text, color, dimensions) with automatic override preservation during master updates.
  - 1-click Component Swapping and Non-destructive Detaching (`Unlink`).

### 🎨 Design Tokens & Variable Collections
- **Design Tokens & Variable Resolver (`src/engine/variables/variableResolver.ts`)**:
  - Built-in Design Token Collections: Colors (Primary, Surfaces, Accents, Figma Palette) and Spacing scales (`4px`, `8px`, `16px`, `24px`, `32px`).
  - Multi-Mode Token Evaluation (Light Mode and Dark Mode).
  - **Design System Modal (`DesignSystemModal.tsx` / `Shift+D`)**:
    - Live variable editor, token addition, mode switching, and 1-click **Export CSS Variables (`:root { ... }`)** generation.

### 📐 Advanced Styling & Per-Corner Corner Radii
- **Independent 4-Corner Radii (`CornerRadiusControl.tsx` & `svgPathUtils.ts`)**:
  - Configurable `topLeft`, `topRight`, `bottomRight`, and `bottomLeft` values with linked/unlinked mode toggle.
  - SVG Arc path generation (`generateRoundedRectPath`) and CSS `border-radius` synthesis.
- **Multiple Stackable Fills & Gradients (`FillsSection.tsx` & `SvgDefsRenderer.tsx`)**:
  - Solid fills, Linear Gradients, and Radial Gradients with configurable angles and stop offsets/colors.
  - 12 Blend Modes (`multiply`, `screen`, `overlay`, `darken`, `lighten`, etc.).
- **Multiple Effects (`EffectsSection.tsx`)**:
  - Stackable `drop-shadow`, `inner-shadow`, `layer-blur`, and `background-blur` rendering via dynamic SVG `<filter>` definitions.
- **Stroke Alignment (`StrokesSection.tsx`)**:
  - Configurable stroke styles (`solid`, `dashed`, `dotted`) and alignment modes (`inside`, `center`, `outside`).

### 📱 Responsive Constraints & Breakpoint Preview
- **Responsive Constraints Engine (`src/engine/layout/responsiveEngine.ts`)**:
  - Horizontal constraints: `left`, `center`, `right`, `left_right` (Fill), `scale`.
  - Vertical constraints: `top`, `center`, `bottom`, `top_bottom` (Fill), `scale`.
  - Min/Max dimension constraints and Sizing modes (`fixed`, `hug`, `fill`).
- **Responsive Breakpoint Preview Modal (`ResponsivePreviewModal.tsx`)**:
  - Instant live rendering across device viewports: **Mobile (iPhone 15)**, **Tablet (iPad Air)**, **Laptop (MacBook)**, **Desktop (1440p)**.
  - Draggable width slider (`320px` to `1600px`) with real-time responsive constraint recalculation.

### 🔍 Quality & Vector Asset Systems
- **Built-in 50+ Vector Icon Registry (`iconRegistry.ts` & `IconPickerModal.tsx`)**:
  - 50+ SVG icons across 12 categories (`navigation`, `actions`, `communication`, `media`, `commerce`, `files`, `users`, `settings`, `status`, `arrows`, `editor`, `social`).
  - Searchable Icon Picker modal with 1-click canvas insertion (`I` or `Shift+I`).
- **WCAG 2.1 Accessibility & Contrast Inspector (`accessibilityChecker.ts` & `AccessibilityAuditModal.tsx`)**:
  - Real-time page audit computing compliance score (0-100%).
  - Touch target validation (<44×44px mobile warning) and WCAG AA 4.5:1 text contrast calculation.
  - 1-click "Inspect on Canvas" to jump to offending nodes.
- **Asset Importer (`assetImporter.ts`)**:
  - Drag-and-drop file support for external SVGs (parsed to vector nodes) and local images (PNG/JPG/WEBP/GIF).
- **Smart Spacing Normalizer (`smartSpacing.ts`)**:
  - 1-click alignment of irregular gaps to 4px/8px/16px/24px/32px design token increments.
- **Document Migration Engine (Schema v2)**:
  - Backward-compatible document migrator upgrading legacy files seamlessly.

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
