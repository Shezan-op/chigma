import { describe, it, expect } from 'vitest';
import { createDefaultDocument, migrateDocument, createDefaultNode } from '../models/document';

describe('Document Model & Schema Migration', () => {
  it('creates a fresh default document conforming to schemaVersion 2', () => {
    const doc = createDefaultDocument('Test Studio');
    expect(doc.name).toBe('Test Studio');
    expect(doc.schemaVersion).toBe(2);
    expect(doc.pages.length).toBe(1);
    expect(doc.variableCollections?.length).toBeGreaterThanOrEqual(2);
    expect(doc.styles?.length).toBeGreaterThanOrEqual(3);
    expect(doc.breakpoints?.length).toBe(3);
  });

  it('safely migrates a legacy schema v1 document without data loss', () => {
    const legacyDoc = {
      id: 'doc_legacy_123',
      name: 'Legacy Project',
      version: 1,
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
      pages: [
        {
          id: 'page_1',
          name: 'Main Page',
          children: [
            {
              id: 'node_1',
              type: 'rectangle',
              name: 'Box',
              x: 50,
              y: 50,
              width: 100,
              height: 100,
              fill: '#000000'
            }
          ]
        }
      ]
    };

    const migrated = migrateDocument(legacyDoc);
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.id).toBe('doc_legacy_123');
    expect(migrated.pages[0].children[0].name).toBe('Box');
    expect(migrated.pages[0].children[0].visible).toBe(true);
    expect(migrated.pages[0].children[0].opacity).toBe(1);
    expect(migrated.variableCollections).toBeDefined();
    expect(migrated.styles).toBeDefined();
  });

  it('creates icon and svg nodes with valid defaults', () => {
    const iconNode = createDefaultNode('icon', 10, 20);
    expect(iconNode.type).toBe('icon');
    expect(iconNode.width).toBe(24);
    expect(iconNode.height).toBe(24);

    const svgNode = createDefaultNode('svg', 30, 40);
    expect(svgNode.type).toBe('svg');
    expect(svgNode.width).toBe(120);
  });
});
