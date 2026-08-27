import { describe, it, expect } from 'vitest';
import { createDefaultPage, createDefaultNode } from '../models/document';
import { generateWireframeCode } from '../engine/export/exportCode';

describe('HTML/CSS/JS Wireframe Exporter', () => {
  it('generates valid HTML document with embedded SVG icons, gradients, and custom properties', () => {
    const page = createDefaultPage('Landing Page');

    const button = createDefaultNode('button', 100, 100, { label: 'Explore Features' });
    const icon = createDefaultNode('icon', 50, 50, { iconName: 'home' });
    const rect = createDefaultNode('rectangle', 200, 200, {
      cornerRadius: { topLeft: 16, topRight: 16, bottomRight: 0, bottomLeft: 0 },
      effects: [
        { id: 'e1', type: 'drop-shadow', visible: true, x: 0, y: 8, blur: 20, spread: 0, color: '#000000', opacity: 0.1 }
      ]
    });

    page.children = [button, icon, rect];

    const result = generateWireframeCode(page, 'SaaS App');
    expect(result.fullDocument).toContain('<!DOCTYPE html>');
    expect(result.fullDocument).toContain('Explore Features');
    expect(result.fullDocument).toContain('<svg'); // Inline icon svg
    expect(result.fullDocument).toContain('16px 16px 0px 0px'); // Corner radius CSS
    expect(result.fullDocument).toContain('box-shadow:');
    expect(result.css).toContain('--primary');
  });
});
