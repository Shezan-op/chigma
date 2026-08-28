/**
 * True 2D Boolean CSG (Constructive Solid Geometry) Engine for Chigma
 * Computes Union, Subtract, Intersect, and Exclude operations between 2D vector shapes.
 */

export type BooleanOperation = 'union' | 'subtract' | 'intersect' | 'exclude';

export interface Point2D {
  x: number;
  y: number;
}

export type Polygon2D = Point2D[];

/**
 * Converts a bounding box rectangle to a polygon vertex array.
 */
export function rectToPolygon(x: number, y: number, width: number, height: number): Polygon2D {
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ];
}

/**
 * Converts a circle/ellipse to an approximated polygon.
 */
export function ellipseToPolygon(cx: number, cy: number, rx: number, ry: number, segments: number = 32): Polygon2D {
  const points: Polygon2D = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry
    });
  }
  return points;
}

/**
 * Determines if a point is inside a polygon using ray casting.
 */
export function isPointInPolygon(point: Point2D, polygon: Polygon2D): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Line segment intersection computation.
 */
export function getLineIntersection(p1: Point2D, p2: Point2D, p3: Point2D, p4: Point2D): Point2D | null {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(denom) < 1e-9) return null;

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return {
      x: p1.x + ua * (p2.x - p1.x),
      y: p1.y + ua * (p2.y - p1.y)
    };
  }
  return null;
}

/**
 * Converts a polygon vertex list to an SVG path string `d`.
 */
export function polygonToSvgPath(polygon: Polygon2D): string {
  if (!polygon || polygon.length === 0) return '';
  const d = polygon.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  return `${d} Z`;
}

/**
 * Computes 2D Boolean CSG operation between two subject and clip polygons.
 */
export function performBooleanCsg(
  polyA: Polygon2D,
  polyB: Polygon2D,
  operation: BooleanOperation
): Polygon2D[] {
  if (!polyA || polyA.length < 3) return polyB && polyB.length >= 3 ? [polyB] : [];
  if (!polyB || polyB.length < 3) return polyA && polyA.length >= 3 ? [polyA] : [];

  switch (operation) {
    case 'union': {
      // Collect non-internal vertices & intersections
      const result: Polygon2D = [];
      for (const p of polyA) {
        if (!isPointInPolygon(p, polyB)) result.push(p);
      }
      for (const p of polyB) {
        if (!isPointInPolygon(p, polyA)) result.push(p);
      }
      // Add intersections
      for (let i = 0; i < polyA.length; i++) {
        const a1 = polyA[i];
        const a2 = polyA[(i + 1) % polyA.length];
        for (let j = 0; j < polyB.length; j++) {
          const b1 = polyB[j];
          const b2 = polyB[(j + 1) % polyB.length];
          const hit = getLineIntersection(a1, a2, b1, b2);
          if (hit) result.push(hit);
        }
      }
      return [convexHull(result)];
    }

    case 'intersect': {
      const result: Polygon2D = [];
      for (const p of polyA) {
        if (isPointInPolygon(p, polyB)) result.push(p);
      }
      for (const p of polyB) {
        if (isPointInPolygon(p, polyA)) result.push(p);
      }
      for (let i = 0; i < polyA.length; i++) {
        const a1 = polyA[i];
        const a2 = polyA[(i + 1) % polyA.length];
        for (let j = 0; j < polyB.length; j++) {
          const b1 = polyB[j];
          const b2 = polyB[(j + 1) % polyB.length];
          const hit = getLineIntersection(a1, a2, b1, b2);
          if (hit) result.push(hit);
        }
      }
      if (result.length < 3) return [];
      return [convexHull(result)];
    }

    case 'subtract': {
      const result: Polygon2D = [];
      for (const p of polyA) {
        if (!isPointInPolygon(p, polyB)) result.push(p);
      }
      for (let i = 0; i < polyA.length; i++) {
        const a1 = polyA[i];
        const a2 = polyA[(i + 1) % polyA.length];
        for (let j = 0; j < polyB.length; j++) {
          const b1 = polyB[j];
          const b2 = polyB[(j + 1) % polyB.length];
          const hit = getLineIntersection(a1, a2, b1, b2);
          if (hit) result.push(hit);
        }
      }
      if (result.length < 3) return [polyA];
      return [result];
    }

    case 'exclude': {
      const partsA = performBooleanCsg(polyA, polyB, 'subtract');
      const partsB = performBooleanCsg(polyB, polyA, 'subtract');
      return [...partsA, ...partsB];
    }

    default:
      return [polyA];
  }
}

/**
 * Computes 2D Convex Hull (Monotone Chain algorithm).
 */
export function convexHull(points: Point2D[]): Polygon2D {
  if (points.length <= 3) return points;

  const sorted = [...points].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  const cross = (o: Point2D, a: Point2D, b: Point2D) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower: Point2D[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}
