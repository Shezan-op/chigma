import type { Page } from '../../models/document';
import { generatePageSvgString } from './exportSvg';
import { downloadFile } from '../../utils/file';

export async function exportPageToPng(
  page: Page,
  documentName = 'design',
  scale = 2
): Promise<void> {
  const svgString = generatePageSvgString(page);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not create 2D canvas context.'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) {
            const cleanName = `${documentName}-${page.name}`.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
            downloadFile(pngBlob, `${cleanName}.png`, 'image/png');
            resolve();
          } else {
            reject(new Error('Failed to generate PNG blob.'));
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
