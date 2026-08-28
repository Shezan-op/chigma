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

### Multi-Mode Variables (Light & Dark)
Variables support scoped evaluations across Light and Dark themes. When exporting CSS, Chigma generates:
```css
:root {
  --color-primary: #000000;
  --color-surface: #FFFFFF;
  --color-accent: #0066FF;
  --spacing-md: 16px;
}

[data-theme="dark"] {
  --color-primary: #FFFFFF;
  --color-surface: #18181B;
  --color-accent: #3B82F6;
}
```

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

### Independent 4-Corner Radii
Each corner of a rectangle, frame, card, or button can be individually customized:
- `topLeft`, `topRight`, `bottomRight`, `bottomLeft`
- Evaluates to SVG arc bezier paths (`M... A rx ry...`) and standard CSS `border-radius: tl tr br bl`.

### Spacing Scale
- `2px` / `4px` (`xxs`): Button padding, icon gaps
- `8px` (`xs`): Grid step, field spacing
- `12px` / `16px` (`sm`/`md`): Panel padding, card interiors
- `24px` / `32px` (`lg`/`xl`): Section margins, project grid gaps

---

## 5. Master Components & Instances (❖ / ◇)

- **Main Component (`❖`)**: Purple identifier token (`#7C3AED`), automatically propogates design changes to all linked instances across project pages.
- **Instance (`◇`)**: Emerald identifier token (`#059669`), tracks local overrides (text copy, fills, dimensions) with 1-click **Go to Main**, **Swap Component**, and **Detach Instance** (`Unlink`).

---

## 6. Vector Icon System

- Standardized on a **24×24px** base coordinate grid.
- Clean 2px stroke weight with rounded caps and joins (`stroke-linecap="round" stroke-linejoin="round"`).
- Categorized into 12 semantic groups with visual search picker (`I` / `Shift+I`).

---

## 7. Responsive Constraints System

- **Horizontal**: `left`, `center`, `right`, `left_right` (Fill), `scale`.
- **Vertical**: `top`, `center`, `bottom`, `top_bottom` (Fill), `scale`.
- **Sizing Modes**: `Fixed`, `Hug Contents`, `Fill Container`.
- **Preview**: Live multi-device breakpoint simulation (Mobile 390px, Tablet 768px, Laptop 1280px, Desktop 1440px).
