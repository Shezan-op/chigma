# Chigma UI Specification & Design Tokens Guide

This document defines the exact geometric metrics, color tokens, typography hierarchy, elevation levels, and interaction physics for the **Chigma** editor shell and component system.

---

## 1. Application Layout & Metric Geometry

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header Toolbar: Height 38px, Padding 0 12px, Gap 8px                        │
├───────────┬───────────────────────────────────────────────────┬─────────────┤
│ Toolstrip │                                                   │ Inspector   │
│ Width 44px│                SVG Vector Canvas                  │ Width 280px │
│ Icons 16px│                                                   │ Padding 12px│
│           │                                                   │ Inputs 28px │
├───────────┴───────────────────────────────────────────────────┴─────────────┤
│ Footer Status Bar: Height 24px, Padding 0 12px, Font 11px                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dimensional Standards
- **Header Toolbar**: Height `38px`, horizontal padding `12px`, control gap `6px`.
- **Left Toolstrip**: Width `44px`, tool icon button size `32×32px`, icon size `16px`.
- **Left Drawer (Layers / Components)**: Width `240px`, row height `28px`, indent `12px/level`.
- **Right Properties Inspector**: Width `280px`, section header height `32px`, input height `28px`.
- **Footer Status Bar**: Height `24px`, font size `11px`.

---

## 2. Spacing System Tokens

Chigma follows an **8px base grid** with 2px and 4px micro-steps:

| Token | Value | Primary Use Case |
|---|:---:|---|
| `--space-2xs` | `2px` | Border widths, micro-focus offsets |
| `--space-xs` | `4px` | Compact button gaps, label-to-input gap |
| `--space-sm` | `6px` | Section item gaps, tag pill padding |
| `--space-md` | `8px` | Default grid step, control gap, input padding |
| `--space-lg` | `12px` | Panel horizontal padding, modal header gap |
| `--space-xl` | `16px` | Card padding, dialog body padding |
| `--space-2xl` | `24px` | Section margins, empty state spacing |
| `--space-3xl` | `32px` | Large dialog padding, template card grid gap |

---

## 3. Typography Hierarchy

Font Stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Role | Font Size | Weight | Line Height | Color Token |
|---|:---:|:---:|:---:|---|
| **App Title** | `13px` | `600` | `16px` | `--text-primary` (`#18181B`) |
| **Section Header** | `11px` | `700` | `14px` | `--text-secondary` (`#71717A`) (Caps, Tracking `0.05em`) |
| **Property Label** | `11px` | `500` | `14px` | `--text-secondary` (`#71717A`) |
| **Input / Button Text** | `12px` | `500` | `16px` | `--text-primary` (`#18181B`) |
| **Numeric Value / Coordinate** | `11px` | `500` (Mono) | `14px` | `--text-primary` (`#18181B`) |
| **Badge / Status Tag** | `10px` | `600` | `12px` | Accent / Status Token |
| **Code / Snippet** | `11px` | `400` (Mono) | `16px` | `--text-code` |

---

## 4. Color Palette & Surface Tokens

### Surface & Border Tokens
- `--surface-app`: `#F4F4F5` (Light) / `#121214` (Dark)
- `--surface-canvas`: `#E4E4E7` (Light) / `#1E1E22` (Dark)
- `--surface-panel`: `#FFFFFF` (Light) / `#18181B` (Dark)
- `--surface-input`: `#FAFAFA` (Light) / `#27272A` (Dark)
- `--surface-hover`: `#F4F4F5` (Light) / `#27272A` (Dark)
- `--border-hairline`: `#E4E4E7` (Light) / `#27272A` (Dark)
- `--border-focus`: `#0066FF` (Blue highlight)

### Figma Signature Pastel Accent Blocks
- `--chigma-block-lime`: `#DCEEB1`
- `--chigma-block-lilac`: `#C5B0F4`
- `--chigma-block-cream`: `#F4ECD6`
- `--chigma-block-pink`: `#EFD4D4`
- `--chigma-block-mint`: `#C8E6CD`
- `--chigma-block-coral`: `#F3C9B6`
- `--chigma-block-navy`: `#1F1D3D`
- `--chigma-accent-magenta`: `#FF3D8B`

---

## 5. Control & Input Specifications

### Interactive Buttons
- **Compact Tool Button**: `32×32px`, `border-radius: 6px`, `padding: 6px`.
- **Primary Action Button**: Height `32px`, `border-radius: 6px`, `padding: 0 12px`, `font-size: 12px`, `font-weight: 600`.
- **Pill CTA Button**: Height `36px`, `border-radius: 50px`, `padding: 0 16px`.
- **States**:
  - `Default`: `background: var(--surface-panel)`, `border: 1px solid var(--border-hairline)`.
  - `Hover`: `background: var(--surface-hover)`.
  - `Active / Pressed`: `transform: scale(0.98)`.
  - `Focus-Visible`: `outline: 2px solid #0066FF`, `outline-offset: 1px`.

### Numeric & Text Inputs
- **Height**: `28px`.
- **Corner Radius**: `5px`.
- **Font Size**: `11px` / `12px`.
- **Padding**: `0 8px`.
- **Prefix / Suffix**: `X`, `Y`, `W`, `H`, `R`, `%`, `px` displayed in `--text-muted` (`10px`).

---

## 6. Elevation & Motion Tokens

### Shadows
- `--shadow-dropdown`: `0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)`
- `--shadow-modal`: `0 12px 32px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.06)`
- `--shadow-floating-tool`: `0 2px 8px rgba(0, 0, 0, 0.10)`

### Transitions
- `--transition-instant`: `80ms cubic-bezier(0, 0, 0.2, 1)` (Button clicks, toggles)
- `--transition-panel`: `140ms cubic-bezier(0.16, 1, 0.3, 1)` (Sidebar expand, modal enter)
- `--transition-drag`: `0ms` (Direct canvas dragging, resizing, rotating)
