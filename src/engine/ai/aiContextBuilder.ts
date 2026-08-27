import type { ChigmaDocument, Page } from '../../models/document';
import type { ChigmaNode } from '../../models/node';
import type { AIContextPayload } from './aiProvider';

/**
 * Builds a compact, semantic representation of the active document, tokens, and components for AI reasoning.
 */
export function buildAiContext(
  document: ChigmaDocument,
  activePage: Page,
  selectedNodes: ChigmaNode[] = []
): AIContextPayload {
  const tokenNames = (document.variableCollections || []).flatMap((col) =>
    col.variables.map((v) => `${v.name} (${v.type}): ${v.value}`)
  );

  const componentNames = (document.components || []).map((c) => c.name);

  const selectedSummary =
    selectedNodes.length > 0
      ? selectedNodes
          .map(
            (n) =>
              `- [${n.type}] "${n.name}": (${Math.round(n.x)}, ${Math.round(n.y)}, ${Math.round(n.width)}×${Math.round(n.height)}px)`
          )
          .join('\n')
      : 'No elements selected (full page context)';

  // Build semantic tree summary of page
  const pageNodesSummary = activePage.children
    .slice(0, 30) // Cap to avoid context overflow
    .map(
      (n) =>
        `- ${n.name} (${n.type}) [w:${Math.round(n.width)}, h:${Math.round(n.height)}, pos:(${Math.round(n.x)}, ${Math.round(n.y)})]`
    )
    .join('\n');

  return {
    documentName: document.name,
    activePageName: activePage.name,
    selectedNodesSummary: selectedSummary,
    semanticTree: pageNodesSummary,
    designTokens: tokenNames,
    componentsAvailable: componentNames,
    viewportWidth: 1280
  };
}
