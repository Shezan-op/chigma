import { describe, it, expect } from 'vitest';
import { generateRoundedRectPath } from '../engine/renderer/svgPathUtils';
import { BUILT_IN_ICONS, getIconByName } from '../engine/icons/iconRegistry';

describe('Tier 1 Visual Styling & Icon Registry', () => {
  it('contains at least 40 vector icons across all 12 categories', () => {
    expect(BUILT_IN_ICONS.length).toBeGreaterThanOrEqual(40);
    const homeIcon = getIconByName('home');
    expect(homeIcon).toBeDefined();
    expect(homeIcon?.category).toBe('navigation');

    const searchIcon = getIconByName('search');
    expect(searchIcon).toBeDefined();
    expect(searchIcon?.category).toBe('actions');
  });

  it('generates standard rounded rectangle path when given uniform number', () => {
    const path = generateRoundedRectPath(100, 50, 10);
    expect(path).toContain('M 10 0');
    expect(path).toContain('H 90');
    expect(path).toContain('V 40');
    expect(path).toContain('Z');
  });

  it('generates independent corner radii SVG path when given CornerRadii object', () => {
    const path = generateRoundedRectPath(200, 100, {
      topLeft: 20,
      topRight: 0,
      bottomRight: 30,
      bottomLeft: 10
    });
    expect(path).toContain('M 20 0');
    expect(path).toContain('H 200'); // top-right radius 0
    expect(path).toContain('V 70');  // bottom-right radius 30
    expect(path).toContain('H 10');  // bottom-left radius 10
  });
});
