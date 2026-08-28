import type { ChigmaDocument } from '../models/document';
import type { ChigmaNode } from '../models/node';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  repairedCount: number;
}

/**
 * Validates and auto-repairs document integrity issues:
 * - Duplicate Node IDs
 * - Orphaned or invalid parent references
 * - Broken component master links
 * - NaN / invalid geometric dimensions
 */
export function validateAndRepairDocument(document: ChigmaDocument): { document: ChigmaDocument; report: ValidationReport } {
  const errors: string[] = [];
  const warnings: string[] = [];
  let repairedCount = 0;

  if (!document || !Array.isArray(document.pages)) {
    return {
      document,
      report: { isValid: false, errors: ['Document is missing pages array'], warnings: [], repairedCount: 0 }
    };
  }

  const seenIds = new Set<string>();
  const componentIds = new Set((document.components || []).map((c) => c.id));

  function sanitizeNode(node: ChigmaNode, parentId?: string): ChigmaNode {
    // 1. Fix duplicate or missing ID
    if (!node.id || seenIds.has(node.id)) {
      const oldId = node.id;
      node.id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      warnings.push(`Remapped duplicate/invalid node ID ${oldId || '(none)'} to ${node.id}`);
      repairedCount++;
    }
    seenIds.add(node.id);

    // 2. Fix NaN or negative dimensions
    if (isNaN(node.x) || !isFinite(node.x)) { node.x = 0; repairedCount++; }
    if (isNaN(node.y) || !isFinite(node.y)) { node.y = 0; repairedCount++; }
    if (isNaN(node.width) || node.width <= 0) { node.width = 100; repairedCount++; }
    if (isNaN(node.height) || node.height < 0) { node.height = 100; repairedCount++; }

    // 3. Parent ID consistency
    if (parentId && node.parentId !== parentId) {
      node.parentId = parentId;
    }

    // 4. Validate component instance references
    if ((node as any).instanceOf || (node as any).componentId) {
      const compId = (node as any).instanceOf || (node as any).componentId;
      if (!componentIds.has(compId)) {
        warnings.push(`Instance "${(node as any).name || node.id}" references non-existent component "${compId}"`);
      }
    }

    // 5. Recursively sanitize children if frame/group
    if ('children' in node && Array.isArray((node as any).children)) {
      (node as any).children = (node as any).children.map((child: ChigmaNode) =>
        sanitizeNode(child, node.id)
      );
    }

    return node;
  }

  // Sanitize all pages
  document.pages.forEach((page) => {
    if (!page.id || seenIds.has(page.id)) {
      page.id = `page_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      repairedCount++;
    }
    seenIds.add(page.id);

    if (Array.isArray(page.children)) {
      page.children = page.children.map((node) => sanitizeNode(node));
    } else {
      page.children = [];
    }
  });

  return {
    document,
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
      repairedCount
    }
  };
}
