import { describe, it, expect, beforeEach } from 'vitest';
import { useDocumentStore } from '../store/useDocumentStore';
import { createDefaultNode } from '../models/document';

describe('Document Store Boolean CSG Integration', () => {
  beforeEach(() => {
    const { addNode, getActivePage } = useDocumentStore.getState();
    const page = getActivePage();
    if (page) {
      page.children = [];
    }
  });

  it('performs Boolean Union between two overlapping rectangles and replaces them with combined vector shape', () => {
    const nodeA = createDefaultNode('rectangle', 0, 0, { width: 100, height: 100, fill: '#4F46E5' });
    const nodeB = createDefaultNode('rectangle', 50, 50, { width: 100, height: 100, fill: '#3B82F6' });

    useDocumentStore.getState().addNode(nodeA);
    useDocumentStore.getState().addNode(nodeB);

    expect(useDocumentStore.getState().getActivePage()?.children.length).toBe(2);

    useDocumentStore.getState().performBooleanOperation('union', [nodeA.id, nodeB.id]);

    const page = useDocumentStore.getState().getActivePage();
    expect(page?.children.length).toBe(1);

    const resultNode = page?.children[0];
    expect(resultNode?.type).toBe('svg');
    expect(resultNode?.name).toContain('Union Shape');
    expect((resultNode as any)?.svgContent).toContain('<svg');
    expect((resultNode as any)?.svgContent).toContain('<path');
  });

  it('performs Boolean Subtract cutting the second shape from the first', () => {
    const nodeA = createDefaultNode('rectangle', 0, 0, { width: 100, height: 100, fill: '#4F46E5' });
    const nodeB = createDefaultNode('rectangle', 50, 50, { width: 100, height: 100, fill: '#EF4444' });

    useDocumentStore.getState().addNode(nodeA);
    useDocumentStore.getState().addNode(nodeB);

    useDocumentStore.getState().performBooleanOperation('subtract', [nodeA.id, nodeB.id]);

    const page = useDocumentStore.getState().getActivePage();
    expect(page?.children.length).toBe(1);
    expect(page?.children[0].name).toContain('Subtract Shape');
  });
});
