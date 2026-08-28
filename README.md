# Chigma — Offline Local-First AI-Native Visual Design & Prototyping Platform

**Chigma** is an offline-first, local-first visual design, wireframing, design system, and interactive prototyping engine inspired by Figma. Built with a confident monochrome editorial frame and playful pastel accents, it delivers a high-performance vector canvas, an embedded offline-first AI Co-Designer, Model Context Protocol (MCP) server support, Dev Mode with multi-framework code handoff (React, Next.js, Tailwind), automated design linting, master components, and clickable prototyping state machines.

Everything runs **100% locally** in the browser with **zero cloud dependencies, zero authentication, zero tracking, and zero external server requirements**.

---

## 🌟 Master Capabilities & Features

### 1. 🤖 AI Co-Designer & Agentic Workflows
- **Offline Rule-Based Synthesizer**: Deterministic AI engine capable of generating complete SaaS analytics dashboards, marketing hero landing pages, navigation bars, and data tables without internet access.
- **Provider Abstraction**: Swappable provider interface supporting local Ollama (`http://localhost:11434`), OpenAI, and Anthropic endpoints.
- **Context Builder**: Converts canvas document hierarchies into token-efficient semantic trees.
- **Transactional Planner & Rollback**: Real-time multi-step task execution plan with 1-click **Rollback / Undo**.

### 2. 🌐 Model Context Protocol (MCP) Server (2026-07-28 Spec)
- **JSON-RPC 2.0 Engine**: Built against the standard MCP protocol, exposing design tools directly to AI coding tools like Claude Code, Cursor, and Codex.
- **8+ Core Design Tools**: `get_project`, `get_page`, `get_node`, `create_node`, `modify_node`, `apply_auto_layout`, `inspect_design`, `export_code`.
- **MCP Resources & Prompts**: `chigma://project/current`, `chigma://design-system`, `chigma://components`.
- **In-Browser MCP Tester (`McpModal.tsx`)**: Test MCP tool calls live against the canvas and copy ready-to-use client JSON configuration.

### 3. ⚡ Dev Mode & Multi-Framework Code Export
- **3-Segmented Mode Switcher**: Seamlessly toggle between **Design Mode**, **Dev Mode / Handoff**, and **Prototype Mode**.
- **Dev Mode Inspector (`DevModePanel.tsx`)**:
  - Live Box-model geometry (width, height, coordinates X/Y, 4-corner radii).
  - CSS Custom Properties and Variable token inspection (`var(--color-primary)`).
  - Multi-Framework Code Generation:
    - **React + TypeScript (Tailwind CSS)**
    - **Next.js App Router Client Component (`'use client'`)**
    - **Semantic HTML5 & Modern CSS Stylesheet**
  - 1-Click "Copy Code" button.

### 4. 🛡️ Design Health Linter & Quality Engine
- **Automated Health Score (0-100%)**: Comprehensive audit with category breakdowns for Spacing, Design Tokens, Accessibility (WCAG 2.1), and Consistency.
- **Issue Detection**: Catches off-grid coordinates (non-8px multiples), unlinked magic colors vs variable tokens, and undersized mobile touch targets (<44×44px).
- **1-Click Auto-Fix**: Automatically align all elements to the 8px design grid.

### 5. 🕹️ Interactive Prototyping 2.0 & Session Runtime
- **Isolated Prototyping State Machine**: Reactive session store evaluating variables (`cartCount`, active tabs, flags) and conditional branch logic (`==`, `!=`, `>`, `<`).
- **Overlay Stacks**: Modals, Drawers, Dropdowns, and Bottom Sheets with customizable backdrops.
- **Prototype Debugger HUD**: Real-time event log and live variable inspection sidebar.
- **Device Frame Switcher**: Desktop (MacBook Pro), Tablet (iPad Air), Mobile (iPhone 15 Pro), and Fullscreen Canvas.

### 6. ❖ Master Components & Reusable Instances
- **Master Component Engine (`Ctrl+Alt+K`)**: Single-source-of-truth master components (`❖`) propagating changes across pages.
- **Linked Instances (`◇`)**: Local overrides (copy, styling, sizing) with automatic override preservation.
- **Component Swapping & Detaching**: Swap component instances via dropdown or detach to independent native elements.

### 7. 🎨 Design Tokens, Multi-Mode Variables & Independent Radii
- **Design Tokens & Variable Collections**: Collections for Colors, Figma Pastel blocks, and Spacing scales.
- **Multi-Mode Support**: Switch effortlessly between **Light Mode** and **Dark Mode**.
- **Independent 4-Corner Radii**: Configure distinct `topLeft`, `topRight`, `bottomRight`, and `bottomLeft` values.
- **Multiple Stackable Fills & Gradients**: Solid colors, Linear Gradients, and Radial Gradients with 12 blend modes.
- **Multi-Effect Shadows & Blurs**: Drop Shadows, Inner Shadows, Layer Blurs, and Background Blurs.

### 8. 🗂️ Version History, Decision Log & Workspace Backups
- **Project Snapshots**: Save named checkpoints and safely restore prior states.
- **Design Decision Log**: Document architectural rationales and design intent directly in the project file.
- **Workspace Backup / Restore**: Export all projects and preferences into a single `.chigma-workspace.json` file.
- **Quick Insert Component Palette (`/`)**: Instant fuzzy search insert menu for wireframe components.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Shezan-op/chigma.git
cd chigma

# Install dependencies
npm install

# Run automated test suite (Vitest)
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
| **/** | Quick Insert Component Palette |
| **Shift + A** | Toggle AI Co-Designer Sidebar |
| **Shift + L** | Open Design Health & Quality Inspector |
| **Ctrl + K** / **Cmd + K** | Open Command Palette / Quick Actions |
| **Ctrl + Alt + K** | Convert Selection to Master Component |
| **Shift + D** | Open Design System & Variables Modal |
| **Shift + I** / **I** | Open Vector Icon Library |
| **Ctrl + Alt + Enter** / **F5** | Play Interactive Prototype (Presentation Mode) |
| **Ctrl + Shift + C** | Export Wireframe to Code (HTML/CSS/React) |
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

- [chigma-course.md](file:///c:/Users/techt/chigma/docs/chigma-course.md): Complete beginner-to-advanced master course on using Chigma like a pro.
- [DEVELOPER_HANDBOOK.md](file:///c:/Users/techt/chigma/docs/DEVELOPER_HANDBOOK.md): Complete guide to Chigma engine architecture, vector renderers, auto-layout, tokens, and storage.
- [AI_ARCHITECTURE.md](file:///c:/Users/techt/chigma/docs/AI_ARCHITECTURE.md): Multi-provider AI engine (offline heuristic, local Ollama, OpenAI) and direct vision screenshot loop.
- [MCP_ARCHITECTURE.md](file:///c:/Users/techt/chigma/docs/MCP_ARCHITECTURE.md): External MCP bridge daemon (`scripts/chigma-mcp-bridge.cjs`) for Claude Code, Cursor, and Codex.
- [RELEASE_CHECKLIST.md](file:///c:/Users/techt/chigma/docs/RELEASE_CHECKLIST.md): Production readiness verification matrix.
- [FINAL_WORK_DONE.md](file:///c:/Users/techt/chigma/docs/audits/FINAL_WORK_DONE.md): Comprehensive gap-closure, audit and subsystem verification report.
- [ARCHITECTURE.md](file:///c:/Users/techt/chigma/ARCHITECTURE.md): Deep-dive into data models, rendering engine, master components, and IndexedDB persistence.
- [CHANGELOG.md](file:///c:/Users/techt/chigma/CHANGELOG.md): Complete release and feature history.
- [CONTRIBUTING.md](file:///c:/Users/techt/chigma/CONTRIBUTING.md): Guidelines for open-source contributors.

---

## 📄 License
MIT License. See [LICENSE](file:///c:/Users/techt/chigma/LICENSE) for details. Built for local-first visual design, wireframing, and interactive prototyping.
