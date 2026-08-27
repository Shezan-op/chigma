import { createDefaultNode } from '../../models/document';
import type { ChigmaNode, ImageNode, SvgNode } from '../../models/node';

/**
 * Handles reading an imported or dropped File (Image or SVG)
 * and returns the appropriate ChigmaNode positioned at (x, y).
 */
export async function importAssetFile(
  file: File,
  x: number,
  y: number
): Promise<ChigmaNode | null> {
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  const isImage = file.type.startsWith('image/');

  if (!isImage && !isSvg) {
    console.warn('Unsupported file type:', file.type);
    return null;
  }

  if (isSvg) {
    try {
      const svgText = await file.text();
      // Extract viewBox or dimensions if present
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElem = doc.querySelector('svg');

      let width = 120;
      let height = 120;

      if (svgElem) {
        const viewBox = svgElem.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            width = Math.min(600, Math.max(32, parts[2]));
            height = Math.min(600, Math.max(32, parts[3]));
          }
        } else {
          const wAttr = parseFloat(svgElem.getAttribute('width') || '120');
          const hAttr = parseFloat(svgElem.getAttribute('height') || '120');
          if (wAttr > 0 && hAttr > 0) {
            width = Math.min(600, wAttr);
            height = Math.min(600, hAttr);
          }
        }
      }

      const svgNode = createDefaultNode('svg', x, y, {
        name: file.name.replace(/\.svg$/i, '') || 'SVG Asset',
        width,
        height,
        svgContent: svgElem ? svgElem.innerHTML : svgText
      }) as SvgNode;

      return svgNode;
    } catch (err) {
      console.error('Failed to parse SVG file:', err);
    }
  }

  // Handle standard raster images (PNG, JPG, WEBP, GIF)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve(null);
        return;
      }

      // Create an image element to detect natural dimensions
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || 300;
        let height = img.naturalHeight || 200;

        // Scale down if overly large for canvas
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const imageNode = createDefaultNode('image', x, y, {
          name: file.name.replace(/\.[^/.]+$/, '') || 'Image',
          width,
          height,
          src: dataUrl,
          objectFit: 'cover',
          cornerRadius: 4
        }) as ImageNode;

        resolve(imageNode);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
