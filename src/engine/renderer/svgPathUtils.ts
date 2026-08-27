import type { CornerRadii } from '../../models/styles';

/**
 * Generates an SVG path string for a rectangle with independent corner radii.
 */
export function generateRoundedRectPath(
  width: number,
  height: number,
  radii?: number | CornerRadii
): string {
  const w = Math.max(1, width);
  const h = Math.max(1, height);

  if (!radii) {
    return `M 0 0 H ${w} V ${h} H 0 Z`;
  }

  let tl = 0;
  let tr = 0;
  let br = 0;
  let bl = 0;

  if (typeof radii === 'number') {
    tl = tr = br = bl = Math.min(radii, w / 2, h / 2);
  } else {
    const maxRadius = Math.min(w / 2, h / 2);
    tl = Math.min(Math.max(0, radii.topLeft || 0), maxRadius);
    tr = Math.min(Math.max(0, radii.topRight || 0), maxRadius);
    br = Math.min(Math.max(0, radii.bottomRight || 0), maxRadius);
    bl = Math.min(Math.max(0, radii.bottomLeft || 0), maxRadius);
  }

  return `
    M ${tl} 0
    H ${w - tr}
    A ${tr} ${tr} 0 0 1 ${w} ${tr}
    V ${h - br}
    A ${br} ${br} 0 0 1 ${w - br} ${h}
    H ${bl}
    A ${bl} ${bl} 0 0 1 0 ${h - bl}
    V ${tl}
    A ${tl} ${tl} 0 0 1 ${tl} 0
    Z
  `.replace(/\s+/g, ' ').trim();
}
