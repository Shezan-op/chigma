# Chigma — Design System & Visual Specification

This specification documents the visual language, design tokens, typography, component anatomy, and UI aesthetics implemented in **Chigma**, derived from the Figma brand design system in `DESIGN.md`.

---

## 1. Visual Philosophy

> *"A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome — pure white surfaces, pure black ink, pill-shaped CTAs — while each section drops the page into a saturated lime, lavender, cream, mint, or pink panel that reads like a sticky note placed on a clean desk."*

Chigma balances **technical precision** (pixel-sharp rulers, crisp 1px borders, monospace coordinate tags) with **joyful visual accents** (Figma pastel blocks, rounded pills, playful avatars).

---

## 2. Color System & Tokens

### Core Editorial Frame
| Token | Value | Description |
| :--- | :--- | :--- |
| `--chigma-primary` | `#000000` | Pure black primary action color |
| `--chigma-on-primary` | `#FFFFFF` | Text on primary elements |
| `--chigma-ink` | `#000000` | Default typography ink |
| `--chigma-canvas` | `#FFFFFF` | Main surface canvas |
| `--chigma-surface-soft` | `#F7F7F5` | Secondary surface / subtle panels |
| `--chigma-hairline` | `#E6E6E6` | Crisp 1px borders and dividers |
| `--chigma-hairline-soft` | `#F1F1F1` | Subtle secondary borders |

### Signature Figma Pastel Blocks
| Token | Color | Hex Code | Visual Reference |
| :--- | :--- | :--- | :--- |
| `--chigma-block-lime` | Lime | `#DCEEB1` | Sticky note lime / growth metrics |
| `--chigma-block-lilac` | Lilac | `#C5B0F4` | Lavender tint / mobile frames |
| `--chigma-block-cream` | Cream | `#F4ECD6` | Warm off-white card surfaces |
| `--chigma-block-pink` | Pink | `#EFD4D4` | Soft pink cards / accent blocks |
| `--chigma-block-mint` | Mint | `#C8E6CD` | Fresh mint dashboard panels |
| `--chigma-block-coral` | Coral | `#F3C9B6` | Warm coral accent blocks |
| `--chigma-block-navy` | Navy | `#1F1D3D` | Deep high-contrast dark block |
| `--chigma-accent-magenta`| Magenta | `#FF3D8B` | Guide lines & alignment snaps |

---

## 3. Typography Hierarchy

| Level | Font Size | Weight | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Display XL** | 34px - 48px | 700 (Bold) | 1.10 | Hero headings, marketing titles |
| **Headline** | 20px - 26px | 600 (Semi-Bold) | 1.25 | Card headers, section titles |
| **Body** | 14px - 16px | 400 (Regular) | 1.45 | Default canvas text, card body |
| **Button / Link** | 13px - 14px | 500 (Medium) | 1.20 | Pill CTAs, navigation links |
| **Eyebrow / Monospace** | 10px - 12px | 400 (Mono) | 1.00 | Coordinate rulers, zoom %, shortcuts |

---

## 4. Radii & Spacing Geometry

### Radii Tokens
- `xs`: `2px` — Ticks, small badges
- `sm`: `6px` — Input fields, dropdowns, layer items
- `md`: `8px` — Content cards, dialog modals
- `lg`: `16px` — Project cards, starter templates
- `pill`: `50px` — Primary & secondary CTA buttons, command search bar
- `full`: `9999px` — Circular avatars, toggle switches

### Spacing Scale
- `2px` / `4px` (`xxs`): Button padding, icon gaps
- `8px` (`xs`): Grid step, field spacing
- `12px` / `16px` (`sm`/`md`): Panel padding, card interiors
- `24px` / `32px` (`lg`/`xl`): Section margins, project grid gaps

---

## 5. UI Component Anatomy

1. **Top Toolbar**:
   - Left: Black brand square badge, project title with double-click rename.
   - Center: Command Palette search pill (`Ctrl+K`), transactional Undo/Redo group, dynamic Alignment group.
   - Right: Grid/Rulers toggles, Zoom controls, **Export Code** pill CTA, Export/Import actions.
2. **Left Sidebar**:
   - 44px Tool Strip (V, H, F, R, E, L, A, T, P) with active state inverting to `#000000`.
   - Toggle tabs for **Layers** (tree with eye/lock toggles) and **Components** (searchable 1-click insertion drawer).
3. **Properties Inspector**:
   - Modular collapsible sections: Layout & Coordinates, Fill & Stroke (with Figma pastel palette), Typography, Charts, and Component attributes.
4. **Starter Templates**:
   - Saturated pastel container blocks for SaaS Landing Pages, Mobile Apps, and Analytics Dashboards.
