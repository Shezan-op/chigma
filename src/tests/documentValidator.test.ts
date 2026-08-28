import { describe, it, expect } from 'vitest';
import type { ChigmaDocument } from '../models/document';
import { validateAndRepairDocument } from '../persistence/documentValidator';

describe('Document Validator & Auto-Repair Engine', () => {
  it('detects and remaps duplicate node IDs across pages', () => {
    const brokenDoc: ChigmaDocument = {
      id: 'doc_dup',
      name: 'Dup Test',
      version: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: [
        {
          id: 'page_1',
          name: 'Page 1',
          children: [
            { id: 'node_dup_1', name: 'Button A', type: 'button', x: 10, y: 10, width: 100, height: 40 } as any,
            { id: 'node_dup_1', name: 'Button B', type: 'button', x: 120, y: 10, width: 100, height: 40 } as any
          ]
        }
      ]
    };

    const { document, report } = validateAndRepairDocument(brokenDoc);
    expect(report.warnings.length).toBeGreaterThan(0);
    expect(document.pages[0].children[0].id).not.toBe(document.pages[0].children[1].id);
  });

  it('repairs NaN and negative dimensions', () => {
    const invalidDoc: ChigmaDocument = {
      id: 'doc_nan',
      name: 'NaN Test',
      version: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: [
        {
          id: 'page_1',
          name: 'Page 1',
          children: [
            { id: 'node_1', name: 'Card', type: 'card', x: NaN, y: -50, width: -100, height: NaN } as any
          ]
        }
      ]
    };

    const { document } = validateAndRepairDocument(invalidDoc);
    const node = document.pages[0].children[0];
    expect(isNaN(node.x)).toBe(false);
    expect(node.width).toBeGreaterThan(0);
    expect(node.height).toBeGreaterThan(0);
  });
});
