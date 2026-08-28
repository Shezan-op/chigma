import { describe, it, expect } from 'vitest';
import {
  createAnchor,
  anchorsToSvgPath,
  moveAnchor,
  updateAnchorHandle
} from '../engine/geometry/bezierPathEditor';

describe('Bézier Path Editor Engine', () => {
  it('creates default anchor point with unique ID', () => {
    const anchor = createAnchor(50, 80, 'smooth');
    expect(anchor.x).toBe(50);
    expect(anchor.y).toBe(80);
    expect(anchor.pointType).toBe('smooth');
    expect(anchor.id).toMatch(/^anchor_/);
  });

  it('generates line path for corner anchors', () => {
    const a1 = createAnchor(0, 0, 'corner');
    const a2 = createAnchor(100, 50, 'corner');
    const path = anchorsToSvgPath([a1, a2]);
    expect(path).toBe('M 0 0 L 100 50');
  });

  it('generates cubic curve path when handles are present', () => {
    const a1 = createAnchor(0, 0, 'smooth');
    a1.handleOut = { x: 20, y: 0 };
    const a2 = createAnchor(100, 100, 'smooth');
    a2.handleIn = { x: 80, y: 100 };

    const path = anchorsToSvgPath([a1, a2], true);
    expect(path).toContain('C 20 0, 80 100, 100 100');
    expect(path).toContain('Z');
  });

  it('moves anchor and translates handles proportionally', () => {
    const a = createAnchor(10, 20, 'smooth');
    a.handleIn = { x: 5, y: 20 };
    a.handleOut = { x: 15, y: 20 };

    const moved = moveAnchor(a, 30, 40);
    expect(moved.x).toBe(40);
    expect(moved.y).toBe(60);
    expect(moved.handleIn).toEqual({ x: 35, y: 60 });
    expect(moved.handleOut).toEqual({ x: 45, y: 60 });
  });

  it('maintains symmetric opposite handle for symmetric anchors', () => {
    const a = createAnchor(100, 100, 'symmetric');
    const updated = updateAnchorHandle(a, 'out', 120, 100);
    expect(updated.handleOut).toEqual({ x: 120, y: 100 });
    expect(updated.handleIn).toEqual({ x: 80, y: 100 });
  });
});
