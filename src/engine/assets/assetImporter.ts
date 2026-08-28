import { createDefaultNode } from '../../models/document';
import type { ChigmaNode, ImageNode, SvgNode } from '../../models/node';

export interface AssetMetadata {
  assetId: string;
  name: string;
  type: 'image' | 'svg';
  mime: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  byteSize: number;
  optimizedByteSize: number;
  hash: string;
  createdAt: number;
}

// In-memory asset hash registry for deduplication
const assetHashRegistry = new Map<string, string>(); // hash -> dataUrl/assetId

/**
 * Computes a fast deterministic string hash from asset content for duplicate detection.
 */
export function computeAssetHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Downscales an image client-side via canvas if it exceeds max dimension (default 2048px),
 * preserving PNG transparency and aspect ratio.
 */
export async function optimizeImageDataUrl(
  dataUrl: string,
  maxDimension: number = 2048
): Promise<{ optimizedUrl: string; width: number; height: number; originalWidth: number; originalHeight: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;

      if (origW <= maxDimension && origH <= maxDimension) {
        resolve({
          optimizedUrl: dataUrl,
          width: origW,
          height: origH,
          originalWidth: origW,
          originalHeight: origH
        });
        return;
      }

      // Compute scaled dimensions
      const ratio = Math.min(maxDimension / origW, maxDimension / origH);
      const targetW = Math.round(origW * ratio);
      const targetH = Math.round(origH * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({
          optimizedUrl: dataUrl,
          width: targetW,
          height: targetH,
          originalWidth: origW,
          originalHeight: origH
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const isPng = dataUrl.startsWith('data:image/png');
      const mime = isPng ? 'image/png' : 'image/jpeg';
      const optimizedUrl = canvas.toDataURL(mime, isPng ? undefined : 0.88);

      resolve({
        optimizedUrl,
        width: targetW,
        height: targetH,
        originalWidth: origW,
        originalHeight: origH
      });
    };

    img.onerror = () => {
      resolve({
        optimizedUrl: dataUrl,
        width: 300,
        height: 200,
        originalWidth: 300,
        originalHeight: 200
      });
    };

    img.src = dataUrl;
  });
}

/**
 * Handles reading an imported or dropped File (Image or SVG) with deduplication & optimization
 */
export async function importAssetFile(
  file: File,
  x: number,
  y: number
): Promise<ChigmaNode | null> {
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  const isImage = file.type.startsWith('image/');

  if (!isImage && !isSvg) {
    return null;
  }

  if (isSvg) {
    try {
      const svgText = await file.text();
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

  // Handle raster image optimization & deduplication
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        resolve(null);
        return;
      }

      const hash = computeAssetHash(rawDataUrl);
      let finalDataUrl = rawDataUrl;

      if (assetHashRegistry.has(hash)) {
        finalDataUrl = assetHashRegistry.get(hash)!;
      } else {
        const opt = await optimizeImageDataUrl(rawDataUrl, 2048);
        finalDataUrl = opt.optimizedUrl;
        assetHashRegistry.set(hash, finalDataUrl);
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || 300;
        let height = img.naturalHeight || 200;

        const maxCanvasDim = 600;
        if (width > maxCanvasDim || height > maxCanvasDim) {
          const ratio = Math.min(maxCanvasDim / width, maxCanvasDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const imageNode = createDefaultNode('image', x, y, {
          name: file.name.replace(/\.[^/.]+$/, '') || 'Image',
          width,
          height,
          src: finalDataUrl,
          objectFit: 'cover',
          cornerRadius: 4,
          crop: {
            fit: 'cover',
            x: 0,
            y: 0,
            scale: 1
          }
        }) as ImageNode;

        resolve(imageNode);
      };

      img.onerror = () => resolve(null);
      img.src = finalDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
