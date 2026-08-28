# CHIGMA COMPLETE MASTER COURSE

> **The zero-BS, operator-grade manual to go from complete beginner to master in Chigma.**  
> Read this top to bottom 2 or 3 times. Build along with it. And you will know more than 99% of people about local-first UI design, auto-layout, token systems, prototyping, and AI-assisted workflows.

---

## MODULE 1: THE CORE PHILOSOPHY

Most design tools today are heavy, slow, and keep your data locked on someone else's server.

If you don't have internet, you can't design.  
If you want code, you get messy visual blobs.  
If you want AI, you get fake mockups that aren't real editable vector elements.

Chigma changes that.

Chigma is built on 3 hard rules:

1. **Local-first & Offline-first** — Everything runs right inside your browser. No login screens, no tracking, no cloud lock-in. Your files stay in your local IndexedDB storage.
2. **Real Vector Geometry** — A button is a real frame. A chart is real SVG paths. A boolean shape is actual calculated geometry, not a CSS illusion.
3. **AI & MCP Native** — You can talk to an offline heuristic AI, hook up local Ollama models on your laptop, or connect external coding agents like Claude Code and Cursor over a local stdio MCP bridge.

When you master Chigma, you don't just "draw pictures."  
You build real, responsive, interactive UI systems that export directly to production-ready React and Next.js code.

---

## MODULE 2: THE INTERFACE & YOUR FIRST 5 MINUTES

Open Chigma in your browser (`http://localhost:5173`).

The whole screen is split into 5 core areas. Keep your eyes on them:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOP TOOLBAR (38px): Project Name, Mode Switcher, Zoom, AI, MCP, Export │
├──────────┬───────────────────────────────────────────────┬─────────────┤
│ TOOL     │                                               │ RIGHT       │
│ STRIP    │              INFINITE VECTOR CANVAS           │ INSPECTOR   │
│ (44px)   │                                               │ (280px)     │
│          │  - Pan (Space + Drag or Middle Mouse)         │             │
│ Select   │  - Zoom (Ctrl + Scroll or Pinch)              │ Design /    │
│ Frame    │  - Rulers (Shift + R)                         │ Prototype / │
│ Rect     │  - Pixel Dot Grid (Ctrl + ')                  │ Dev Mode    │
│ Pen      │  - Snapping & Distance Guides (Alt key)       │             │
│ Text     │                                               │             │
├──────────┴───────────────────────────────────────────────┴─────────────┤
│ LEFT DRAWER (240px): Layers Tree, Pages Tab, Component Library Palette │
└────────────────────────────────────────────────────────────────────────┘
```

### The Top 10 Keyboard Shortcuts You Must Memorize

Don't touch the mouse for basic actions. Use these:

- **`V`** — Select tool (click elements, drag bounding boxes).
- **`H` or `Space + Drag`** — Hand tool to glide across the canvas smoothly.
- **`F`** — Frame tool (draw containers and responsive screens).
- **`R`** — Rectangle tool.
- **`E`** — Ellipse / circle tool.
- **`T`** — Text tool.
- **`P`** — Bézier Pen tool.
- **`/`** — Quick Insert palette. Type what you want (button, card, navbar) and hit Enter.
- **`Ctrl + D`** — Smart duplicate. It copies and moves with memory offset.
- **`Hold Alt`** — Measure pixel distance to any element you hover over.
- **`Shift + A`** — Open the AI Co-Designer panel.
- **`Ctrl + Alt + Enter` (or `F5`)** — Play interactive prototype.

---

## MODULE 3: DRAWING PRIMITIVES & STYLING

Every design starts with basic shapes. In Chigma, shapes are clean vector nodes.

### 1. Drawing Basic Shapes
- Hit **`R`**, click and drag on the canvas. You have a rectangle.
- Hold **`Shift`** while dragging to make it a perfect square.
- Hit **`E`** and hold **`Shift`** for a perfect circle.
- Hit **`T`**, click anywhere, and start typing.

### 2. The Right Inspector — Styling Controls
Select any node. Look at the right panel:

- **Position & Size** — `X`, `Y`, `Width`, `Height`, and `Rotation`.
- **4-Corner Radii** — Click the corner radius icon to set independent top-left, top-right, bottom-right, and bottom-left rounding.
- **Fills** — Set solid hex colors, linear gradients, or radial gradients. You can stack multiple fills on a single element and tweak individual opacity and blend modes.
- **Strokes** — Set border width, stroke style (solid, dashed, dotted), color, and per-side borders.
- **Effects** — Add Drop Shadows, Inner Shadows, Layer Blurs, and Background Blurs.

---

## MODULE 4: ADVANCED VECTORS (BOOLEAN CSG & BÉZIER PEN)

This is where beginners get separated from pros.

### 1. True 2D Boolean CSG Operations
When you select 2 or more overlapping vector shapes, the Floating Action Bar displays 3 core Boolean CSG operations:

- **Union (`Combine`)** — Merges both shapes into one continuous vector boundary contour.
- **Subtract (`Scissors`)** — Cuts the top shape out of the bottom shape.
- **Intersect (`Layers`)** — Keeps only the overlapping area between the two shapes.

These operations calculate real mathematical polygon intersections and output clean SVG paths.

### 2. The Bézier Pen Tool (`P`)
Hit **`P`** to activate the pen tool.

- **Click** — Creates sharp corner anchor points (great for geometric polygons and angular badges).
- **Click and Drag** — Creates smooth curve anchor points with tangent handles.
- **Symmetric Nodes** — Opposite handles mirror angle and length automatically.
- **Closing a Path** — Click back on your starting anchor point to seal the vector shape.

---

## MODULE 5: AUTO-LAYOUT & RESPONSIVE CONSTRAINTS

Never position child elements with manual pixel coordinates inside UI cards. Use **Auto-Layout**.

### 1. Turning On Auto-Layout
1. Select any **Frame** (`F`) or Group.
2. In the right Inspector, toggle **Auto Layout**.
3. Choose your direction:
   - **Horizontal (`Row`)** — For navigation bars, button rows, tag lists.
   - **Vertical (`Column`)** — For cards, forms, settings lists, page layouts.

### 2. Gap & Padding
- **Gap** — Space between child elements (e.g. `16px`).
- **Padding X & Y** — Inner spacing between the frame edges and children (e.g. `24px`).

### 3. Sizing Modes
Every child inside an auto-layout container can have:
- **Fixed** — Stays an exact pixel size (e.g. `120px` width).
- **Hug Contents** — Shrinks or grows to fit its inner text/children perfectly.
- **Fill Container** — Stretches automatically to occupy all available space in the parent frame.

### 4. Responsive Constraints
Select an element inside a screen frame. Under **Constraints**, choose how it pins:
- **Left / Right / Center / Left & Right (Stretch)**.
- **Top / Bottom / Center / Top & Bottom (Stretch)**.

Test different device sizes (`375px` mobile, `768px` tablet, `1440px` desktop). Your layout will adapt smoothly.

---

## MODULE 6: MASTER COMPONENTS & LINKED INSTANCES

Don't copy and paste buttons across 20 screens. If you change a color later, you'll have to edit 20 separate buttons manually.

Use the **Component System**.

### 1. Creating a Master Component (`❖`)
1. Design your ideal button or card with auto-layout and text.
2. Select it and press **`Ctrl + Alt + K`** (or click **Create Component** in the toolbar).
3. It becomes a **Master Component** with a purple `❖` diamond icon.

### 2. Spawning Instances (`◇`)
- Drag the component from the **Left Drawer (`Components Tab`)**, or press **`Ctrl + D`** on the master.
- The new copy is a linked **Instance** with a hollow `◇` icon.

### 3. How Overrides Work
- **Global Updates**: Change the fill color or padding on the `❖ Master Component`. Every `◇ Instance` updates instantly across all pages.
- **Local Overrides**: Change the text on one specific instance (e.g. "Submit Form" instead of "Get Started"). Chigma keeps your custom text while syncing all future master styling changes.
- **Detaching**: If you need an instance to become a regular independent frame, click **Detach Instance**.

---

## MODULE 7: DESIGN TOKENS, ALIASES & CUSTOM MODES

Hardcoded hex values like `#4F46E5` scattered everywhere create a maintenance mess. Use **Design Variables**.

### 1. Opening the Variables Manager (`Shift + D`)
Hit **`Shift + D`** to open the Design System & Variables Modal.

Variables are organized into **Collections**:
- **Primitives** — Base values like `blue.600 = #2563EB`, `spacing.8 = 8`.
- **Semantic Tokens** — Intent-based values like `color.primary`, `surface.card`, `space.gap`.

### 2. Multi-Hop Aliases (`A -> B -> C`)
You can link variables to other variables:
- Set `color.primary` = `var_blue_600`.
- If you update `blue.600`, every semantic token and connected component updates automatically.
- Chigma includes built-in cycle detection to prevent recursive infinite loops.

### 3. Custom Variable Modes (Light, Dark & Brand Themes)
Add multiple mode columns to your collection:
- **Light Mode**: `surface.background = #FFFFFF`, `text.primary = #18181B`.
- **Dark Mode**: `surface.background = #18181B`, `text.primary = #FFFFFF`.
- Switch the active mode in the top toolbar to preview your entire design system switch themes instantly.

---

## MODULE 8: INTERACTIVE PROTOTYPING & STATE MACHINES

Static mockups can't tell you how a user flow actually feels. Turn your wireframes into interactive prototypes.

### 1. Creating Interaction Links
1. Switch to **Prototype Mode** in the top mode switcher.
2. Select any button or card. You'll see a circular handle on its edge.
3. Drag the link wire to your destination frame or modal.

### 2. Triggers & Actions
- **Triggers**: `Click`, `Hover`, `Press`, `Double Click`, `After Delay (ms)`.
- **Actions**:
  - `Navigate to Screen` — Changes the active artboard.
  - `Open Overlay` — Opens a Modal, Drawer, Dropdown, or Bottom Sheet with a dim backdrop.
  - `Close Overlay` — Dismisses the current popover.
  - `Set Variable` — Updates state variables (e.g. `cartCount = cartCount + 1` or `isLoggedIn = true`).

### 3. Playing & Debugging
- Press **`Ctrl + Alt + Enter`** to launch Presentation Mode.
- Choose your device frame: MacBook Pro, iPhone 15 Pro, iPad Air, or Fullscreen.
- The **Prototype Debugger HUD** on the right logs every click event, action fired, and variable state update in real-time.

---

## MODULE 9: THE AI CO-DESIGNER

Chigma includes an AI co-designer designed to work alongside you.

### 1. Three Ways to Run AI in Chigma
1. **Rule-Based Offline AI** — 100% deterministic, zero network calls. Instant generation of SaaS dashboards, hero sections, and mobile auth screens.
2. **Local Ollama LLM** — Connects to `http://localhost:11434` (e.g. `llama3.2`, `qwen2.5-coder`). Keeps all data private on your own machine.
3. **OpenAI-Compatible Endpoints** — Works with remote OpenAI / OpenRouter API keys.

### 2. Prompting the AI Effectively
Open the AI panel with **`Shift + A`**.

- **To Create**: `"Create a modern SaaS analytics dashboard with 3 KPI metric cards, revenue line trend chart, and recent activity table."`
- **To Refactor**: `"Make this selection cleaner, snap all coordinates to an 8px grid, and apply primary blue tokens."`
- **To Audit**: `"Critique this design for contrast, spacing inconsistencies, and touch target accessibility."`

### 3. Vision Screenshot Loop
When using vision models, Chigma captures a live PNG screenshot of your canvas artboard and passes it directly to the model, allowing visual critique of density, whitespace, and visual balance.

### 4. 1-Click Rollback
Every AI task creates a clean pre-execution snapshot. If you don't like the generated result, click **Undo AI Changes** to restore your exact previous canvas state.

---

## MODULE 10: THE EXTERNAL MCP AGENT BRIDGE

If you use terminal-based AI coding agents like **Claude Code**, **Cursor**, or **Codex**, you can connect them directly to your live Chigma browser window via the **Model Context Protocol (MCP)**.

### 1. How the Bridge Works
```text
Claude Code / Cursor (Terminal)
       │  (stdio JSON-RPC 2.0)
       ▼
scripts/chigma-mcp-bridge.cjs
       │  (WebSocket ws://127.0.0.1:4040)
       ▼
Live Chigma Editor in Browser (src/mcp/mcpBridgeClient.ts)
```

### 2. Setting Up in Claude Desktop / MCP Clients
Add this to your MCP configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "chigma": {
      "command": "node",
      "args": ["scripts/chigma-mcp-bridge.cjs"]
    }
  }
}
```

### 3. Running the Workflow
1. Start Chigma: `npm run dev` and open `http://localhost:5173`.
2. Start the daemon in a terminal: `node scripts/chigma-mcp-bridge.cjs`.
3. In Claude Code, type:  
   `"Inspect my current Chigma project and create an auth screen with email, password, and social login buttons."`
4. Watch the nodes generate live on your browser canvas.

---

## MODULE 11: DEVELOPER MODE & MULTI-FRAMEWORK EXPORT

When your design is ready, hand it off to development without redrawing it from scratch.

### 1. Developer Mode (`Dev Mode`)
Switch to **Dev Mode** in the top bar:
- Click any element to view its exact CSS box model: coordinates, dimensions, padding, gap, corner radii, and fill tokens.

### 2. Multi-Framework Code Generation
Under the Code Inspector, select your target framework:
- **React + Tailwind CSS** — Modular TSX components with responsive Tailwind classes (`flex flex-col gap-4 p-6 rounded-xl bg-white`).
- **Next.js App Router** — Client components with `'use client'` directives and standard props.
- **HTML5 & Vanilla CSS** — Pure semantic HTML markup and clean CSS stylesheet.

Click **Copy Code** to paste directly into your code editor.

---

## MODULE 12: PERSISTENCE, OFFLINE & DATA RECOVERY

Chigma stores all project documents and variables inside your browser's **IndexedDB** database using Dexie.

- **Debounced Autosave** — Automatically saves your work 600ms after your last action without freezing the UI.
- **Crash Recovery Snapshots** — If your browser crashes or reboots unexpectedly, Chigma detects the unsaved session snapshot and shows a **"Restore Project"** banner in the dashboard.
- **Workspace Backup** — Click **Backup** in the Project Manager to download your entire workspace as a `.json` backup file that you can restore anywhere.

---

## MODULE 13: THE 3-HOUR MASTERY ROADMAP

Follow this 3-hour practice plan to become completely fluent in Chigma:

### Hour 1: The Fast Wireframe Sprint
1. Create a blank canvas.
2. Hit **`/`** to open Quick Insert and add a **Top Navbar**, a **Hero Section**, and a **3-Card Feature Grid**.
3. Practice grouping, auto-layout gap adjustments, and 8px grid snapping with `Shift + Arrow Keys`.

### Hour 2: Design System & Components
1. Press **`Shift + D`** and set up 3 color tokens (`primary`, `surface`, `accent`).
2. Build a custom button, press **`Ctrl + Alt + K`** to make it a Master Component.
3. Spawn 4 instances, override their text labels, and change the master button color to watch them sync.

### Hour 3: Prototype & Export
1. Draw a second screen for a "Checkout Modal".
2. Link your primary button with `Click -> Open Overlay`.
3. Hit **`F5`** to play the prototype.
4. Switch to **Dev Mode** and copy the generated React + Tailwind code.

That's the entire system.

No magic, no fluff, no cloud lock-in. Just pure, fast, operator-grade UI engineering.
