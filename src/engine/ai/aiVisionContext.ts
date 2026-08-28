/**
 * Canvas Screenshot & Vision Context Generator for Multimodal AI
 */

export interface ScreenshotOptions {
  target?: 'page' | 'selection' | 'frame' | 'viewport';
  format?: 'png' | 'dataurl';
  width?: number;
  height?: number;
}

export async function getCanvasScreenshot(options: ScreenshotOptions = {}): Promise<string> {
  const svgEl = document.querySelector('svg.chigma-canvas-svg') as SVGSVGElement | null;
  if (!svgEl) {
    // Fallback placeholder image data url
    return createPlaceholderDataUrl(options.width || 800, options.height || 600);
  }

  try {
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const loadPromise = new Promise<string>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const w = options.width || svgEl.clientWidth || 1440;
        const h = options.height || svgEl.clientHeight || 1024;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          resolve(createPlaceholderDataUrl(w, h));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(blobUrl);

        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(createPlaceholderDataUrl(800, 600));
      };
    });

    img.src = blobUrl;
    return await loadPromise;
  } catch (e) {
    return createPlaceholderDataUrl(800, 600);
  }
}

function createPlaceholderDataUrl(w: number, h: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Chigma Design Canvas', 40, 60);
  }
  return canvas.toDataURL('image/png');
}
