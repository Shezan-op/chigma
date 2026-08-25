import type { Page } from '../../models/document';
import { getNodesCompositeBounds } from '../geometry/bounds';
import { downloadFile } from '../../utils/file';

export function generatePageSvgString(page: Page): string {
  const docLayerEl = document.getElementById('chigma_document_layer');
  if (!docLayerEl) {
    throw new Error('Document layer not found in DOM.');
  }

  const nodes = page.children || [];
  const bounds = getNodesCompositeBounds(nodes);

  const pad = 40;
  const minX = bounds ? Math.min(0, bounds.minX - pad) : 0;
  const minY = bounds ? Math.min(0, bounds.minY - pad) : 0;
  const width = bounds ? Math.max(800, bounds.width + pad * 2) : 800;
  const height = bounds ? Math.max(600, bounds.height + pad * 2) : 600;

  const innerContent = docLayerEl.innerHTML;
  const bg = page.background || '#FFFFFF';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap');
    text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  </style>
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${bg}" />
  ${innerContent}
</svg>`;
}

export function exportPageToSvg(page: Page, documentName = 'design'): void {
  const svgString = generatePageSvgString(page);
  const cleanName = `${documentName}-${page.name}`.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  downloadFile(svgString, `${cleanName}.svg`, 'image/svg+xml;charset=utf-8');
}
