import { describe, it, expect } from 'vitest';
import { createDefaultNode } from '../models/document';
import { applyResponsiveConstraints } from '../engine/layout/responsiveEngine';

describe('Responsive Layout & Constraints Engine', () => {
  it('keeps Left & Top anchored child fixed in position and size', () => {
    const child = createDefaultNode('rectangle', 20, 20, {
      width: 100,
      height: 40,
      constraints: { horizontal: 'left', vertical: 'top' }
    });

    const updates = applyResponsiveConstraints(child, 400, 300, 600, 450);
    expect(updates.x).toBe(20);
    expect(updates.width).toBe(100);
    expect(updates.y).toBe(20);
    expect(updates.height).toBe(40);
  });

  it('shifts Right-anchored child by delta width', () => {
    const child = createDefaultNode('button', 300, 20, {
      width: 80,
      height: 36,
      constraints: { horizontal: 'right', vertical: 'top' }
    });

    // Parent expands from 400 to 500 (+100 delta)
    const updates = applyResponsiveConstraints(child, 400, 300, 500, 300);
    expect(updates.x).toBe(400); // 300 + 100
    expect(updates.width).toBe(80);
  });

  it('expands Left+Right (stretch) child width by delta', () => {
    const child = createDefaultNode('rectangle', 20, 20, {
      width: 360,
      height: 60,
      constraints: { horizontal: 'left_right', vertical: 'top' }
    });

    // Parent expands from 400 to 600 (+200 delta)
    const updates = applyResponsiveConstraints(child, 400, 300, 600, 300);
    expect(updates.x).toBe(20);
    expect(updates.width).toBe(560); // 360 + 200
  });

  it('scales child proportionally under Scale constraint', () => {
    const child = createDefaultNode('ellipse', 50, 50, {
      width: 100,
      height: 100,
      constraints: { horizontal: 'scale', vertical: 'scale' }
    });

    // Parent doubles from 200x200 to 400x400
    const updates = applyResponsiveConstraints(child, 200, 200, 400, 400);
    expect(updates.x).toBe(100);
    expect(updates.y).toBe(100);
    expect(updates.width).toBe(200);
    expect(updates.height).toBe(200);
  });
});
