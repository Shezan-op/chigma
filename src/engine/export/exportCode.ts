import type { Page } from '../../models/document';
import type { ChigmaNode, GroupNode, IconNode, SvgNode, ImageNode } from '../../models/node';
import type { CornerRadii, Effect, LinearGradient } from '../../models/styles';
import { getIconByName } from '../icons/iconRegistry';

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
  fullDocument: string;
}

function resolveBorderRadiusCss(radii?: number | CornerRadii): string {
  if (!radii) return '0px';
  if (typeof radii === 'number') return `${radii}px`;
  return `${radii.topLeft || 0}px ${radii.topRight || 0}px ${radii.bottomRight || 0}px ${radii.bottomLeft || 0}px`;
}

function resolveBoxShadowCss(effects?: Effect[]): string {
  if (!effects || effects.length === 0) return '';
  const shadows = effects
    .filter((e) => e.visible && (e.type === 'drop-shadow' || e.type === 'inner-shadow'))
    .map((e) => {
      const inset = e.type === 'inner-shadow' ? 'inset ' : '';
      return `${inset}${e.x}px ${e.y}px ${e.blur}px ${e.spread || 0}px ${e.color}`;
    });
  return shadows.length > 0 ? `box-shadow: ${shadows.join(', ')};` : '';
}

function resolveFillCss(node: ChigmaNode): string {
  if (node.fills && node.fills.length > 0) {
    const activeFill = node.fills.find((f) => f.visible);
    if (activeFill) {
      if (activeFill.type === 'gradient' && activeFill.gradient) {
        const grad = activeFill.gradient as LinearGradient;
        const stops = grad.stops.map((s) => `${s.color} ${Math.round(s.offset * 100)}%`).join(', ');
        return `background: linear-gradient(${grad.angle || 90}deg, ${stops});`;
      }
      if (activeFill.color) return `background: ${activeFill.color};`;
    }
  }
  return node.fill ? `background: ${node.fill};` : 'background: transparent;';
}

export function generateWireframeCode(page: Page, documentName = 'Wireframe'): GeneratedCode {
  const nodes = page.children || [];

  // Generate CSS
  const css = `/* Chigma Design Engine Stylesheet - ${documentName} */
:root {
  --primary: #000000;
  --on-primary: #ffffff;
  --bg-page: ${page.background || '#ffffff'};
  --surface: #ffffff;
  --surface-subtle: #f7f7f5;
  --border: #e6e6e6;
  --text-main: #18181b;
  --text-muted: #71717a;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-pill: 50px;
  
  /* Figma Palette Tokens */
  --block-lime: #dceeb1;
  --block-lilac: #c5b0f4;
  --block-cream: #f4ecd6;
  --block-pink: #efd4d4;
  --block-mint: #c8e6cd;
  --block-coral: #f3c9b6;
  --block-navy: #1f1d3d;
  --accent-magenta: #ff3d8b;
  --accent-blue: #3b82f6;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  position: relative;
  overflow-x: auto;
}

.wireframe-canvas {
  position: relative;
  min-width: 1200px;
  min-height: 900px;
  width: 100%;
  height: 100%;
}

.chigma-element {
  position: absolute;
  box-sizing: border-box;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* Primitives */
.chigma-rect {
  display: block;
}

.chigma-ellipse {
  border-radius: 50%;
}

.chigma-text {
  display: flex;
  align-items: center;
  user-select: text;
  white-space: pre-wrap;
}

.chigma-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chigma-image {
  overflow: hidden;
}

.chigma-image img {
  width: 100%;
  height: 100%;
  display: block;
}

/* Wireframe Components */
.chigma-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.chigma-btn:hover {
  filter: brightness(1.1);
}

.chigma-btn-primary { background: #18181B; color: #FFFFFF; }
.chigma-btn-secondary { background: #F4F4F5; color: #18181B; }
.chigma-btn-outline { background: transparent; border: 1px solid #D4D4D8; color: #18181B; }
.chigma-btn-danger { background: #EF4444; color: #FFFFFF; }

.chigma-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chigma-input-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.chigma-input-field {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
  font-size: 13px;
  outline: none;
  background: #FFFFFF;
}

.chigma-card {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chigma-card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.chigma-card-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.chigma-card-content {
  font-size: 13px;
  color: #52525B;
  flex: 1;
}

.chigma-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #FFFFFF;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.chigma-nav-brand {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chigma-nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
  list-style: none;
}

.chigma-nav-links a {
  text-decoration: none;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.chigma-sidebar {
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  padding: 20px 16px;
}

.chigma-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 600;
}

.chigma-badge-success { background: #DEF7EC; color: #03543F; }
.chigma-badge-warning { background: #FEF08A; color: #854D0E; }
.chigma-badge-danger { background: #FDE8E8; color: #9B1C1C; }

/* Responsive Media Queries */
@media (max-width: 768px) {
  .wireframe-canvas {
    min-width: 100%;
  }
}
`;

  // Helper to generate node HTML
  const generateNodeHtml = (node: ChigmaNode): string => {
    const shadowCss = resolveBoxShadowCss(node.effects);
    const fillCss = resolveFillCss(node);
    const radiusCss = resolveBorderRadiusCss(node.cornerRadius);

    const styleAttr = `style="left: ${node.x}px; top: ${node.y}px; width: ${node.width}px; height: ${node.height}px; ${
      node.rotation ? `transform: rotate(${node.rotation}deg);` : ''
    } ${node.opacity !== undefined && node.opacity < 1 ? `opacity: ${node.opacity};` : ''} ${shadowCss}"`;

    switch (node.type) {
      case 'icon': {
        const iconDef = getIconByName((node as IconNode).iconName || 'home');
        const pathContent = iconDef ? iconDef.svgPath : '';
        return `  <div class="chigma-element chigma-icon" ${styleAttr}>
    <svg width="${node.width}" height="${node.height}" viewBox="0 0 24 24" fill="none" stroke="${
          (node as IconNode).color || '#000000'
        }" stroke-width="${(node as IconNode).strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round">${pathContent}</svg>
  </div>`;
      }

      case 'svg':
        return `  <div class="chigma-element" ${styleAttr}>
    <svg width="${node.width}" height="${node.height}" viewBox="0 0 100 100">${(node as SvgNode).svgContent || ''}</svg>
  </div>`;

      case 'image':
        return `  <div class="chigma-element chigma-image" ${styleAttr} style="${styleAttr.slice(
          7,
          -1
        )} border-radius: ${radiusCss};">
    <img src="${(node as ImageNode).src || ''}" alt="${escapeHtml(node.name)}" style="object-fit: ${
          (node as ImageNode).objectFit || 'cover'
        };" />
  </div>`;

      case 'rectangle':
        return `  <div class="chigma-element chigma-rect" ${styleAttr} style="${styleAttr.slice(
          7,
          -1
        )} ${fillCss} border: ${node.strokeWidth || 0}px ${node.strokeStyle || 'solid'} ${
          node.stroke || 'none'
        }; border-radius: ${radiusCss};"></div>`;

      case 'ellipse':
        return `  <div class="chigma-element chigma-ellipse" ${styleAttr} style="${styleAttr.slice(
          7,
          -1
        )} ${fillCss} border: ${node.strokeWidth || 0}px ${node.strokeStyle || 'solid'} ${node.stroke || 'none'};"></div>`;

      case 'text':
        return `  <div class="chigma-element chigma-text" ${styleAttr} style="${styleAttr.slice(7, -1)} font-size: ${
          node.fontSize || 16
        }px; font-weight: ${node.fontWeight || 400}; color: ${node.fill || '#18181B'}; text-align: ${
          node.textAlign || 'left'
        };">${escapeHtml(node.text || '')}</div>`;

      case 'button':
        return `  <button class="chigma-element chigma-btn chigma-btn-${node.variant || 'primary'}" ${styleAttr} style="${styleAttr.slice(
          7,
          -1
        )} border-radius: ${radiusCss}; ${fillCss} ${
          node.textColor ? `color: ${node.textColor};` : ''
        }">${escapeHtml(node.label || 'Button')}</button>`;

      case 'input':
        return `  <div class="chigma-element chigma-input-group" ${styleAttr}>
    ${node.label ? `<label>${escapeHtml(node.label)}</label>` : ''}
    <input type="${node.inputType || 'text'}" class="chigma-input-field" placeholder="${escapeHtml(
          node.placeholder || ''
        )}" value="${escapeHtml(node.value || '')}" style="border-radius: ${radiusCss};" />
  </div>`;

      case 'card':
        return `  <div class="chigma-element chigma-card" ${styleAttr} style="${styleAttr.slice(7, -1)} border-radius: ${radiusCss};">
    <div class="chigma-card-title">${escapeHtml(node.title || 'Card Title')}</div>
    ${node.subtitle ? `<div class="chigma-card-subtitle">${escapeHtml(node.subtitle)}</div>` : ''}
    <div class="chigma-card-content">${escapeHtml(node.content || '')}</div>
  </div>`;

      case 'navbar':
        return `  <header class="chigma-element chigma-navbar" ${styleAttr} style="${styleAttr.slice(7, -1)} ${fillCss}">
    <div class="chigma-nav-brand">
      <div style="width: 20px; height: 20px; background: #3B82F6; border-radius: 4px;"></div>
      <span>${escapeHtml(node.brandName || 'Brand')}</span>
    </div>
    <ul class="chigma-nav-links">
      ${(node.links || []).map((link) => `<li><a href="#">${escapeHtml(link)}</a></li>`).join('\n      ')}
    </ul>
  </header>`;

      case 'group':
      case 'frame':
        const childrenHtml = ((node as GroupNode).children || [])
          .map((child) => generateNodeHtml(child))
          .join('\n');
        return `  <div class="chigma-element chigma-container" ${styleAttr} style="${styleAttr.slice(7, -1)} ${fillCss} border-radius: ${radiusCss};">
${childrenHtml}
  </div>`;

      default:
        return `  <div class="chigma-element" ${styleAttr}></div>`;
    }
  };

  const htmlBody = nodes.map((n) => generateNodeHtml(n)).join('\n\n');

  const html = `<div class="wireframe-canvas">
${htmlBody}
</div>`;

  const js = `// Chigma Wireframe Client Interactivity
document.addEventListener('DOMContentLoaded', () => {
  console.log('Chigma wireframe page loaded successfully.');
  
  document.querySelectorAll('.chigma-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      console.log('Button clicked:', btn.textContent.trim());
    });
  });
});
`;

  const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(documentName)} — Chigma Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;

  return { html, css, js, fullDocument };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
