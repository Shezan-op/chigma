import { describe, it, expect } from 'vitest';
import {
  rectToPolygon,
  ellipseToPolygon,
  isPointInPolygon,
  performBooleanCsg,
  polygonToSvgPath,
  convexHull
} from '../engine/geometry/booleanCsg';

describe('2D Boolean CSG Engine', () => {
  it('converts rectangles to 4-vertex polygons', () => {
    const poly = rectToPolygon(10, 20, 100, 50);
    expect(poly.length).toBe(4);
    expect(poly[0]).toEqual({ x: 10, y: 20 });
    expect(poly[2]).toEqual({ x: 110, y: 70 });
  });

  it('converts ellipses to segmented polygons', () => {
    const poly = ellipseToPolygon(50, 50, 30, 20, 16);
    expect(poly.length).toBe(16);
  });

  it('accurately tests point containment in polygon', () => {
    const poly = rectToPolygon(0, 0, 100, 100);
    expect(isPointInPolygon({ x: 50, y: 50 }, poly)).toBe(true);
    expect(isPointInPolygon({ x: 150, y: 50 }, poly)).toBe(false);
  });

  it('performs polygon Union CSG operation', () => {
    const polyA = rectToPolygon(0, 0, 100, 100);
    const polyB = rectToPolygon(50, 50, 100, 100);
    const union = performBooleanCsg(polyA, polyB, 'union');
    expect(union.length).toBeGreaterThan(0);
    expect(union[0].length).toBeGreaterThanOrEqual(4);
  });

  it('performs polygon Intersect CSG operation', () => {
    const polyA = rectToPolygon(0, 0, 100, 100);
    const polyB = rectToPolygon(50, 50, 100, 100);
    const intersect = performBooleanCsg(polyA, polyB, 'intersect');
    expect(intersect.length).toBe(1);
  });

  it('serializes polygon vertices to valid SVG path string', () => {
    const poly = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    const path = polygonToSvgPath(poly);
    expect(path).toContain('M 0.00 0.00');
    expect(path).toContain('L 100.00 100.00');
    expect(path).toContain('Z');
  });

  it('computes 2D Convex Hull correctly', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 5, y: 5 } // internal point
    ];
    const hull = convexHull(points);
    expect(hull.length).toBe(4);
  });
});
