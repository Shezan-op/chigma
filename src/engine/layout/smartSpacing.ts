import type { ChigmaNode } from '../../models/node';

/**
 * Normalizes uneven horizontal or vertical gaps between selected nodes
 * to the nearest design token multiple (e.g., 4px, 8px, 16px, 24px, 32px).
 */
export function normalizeSpacing(
  nodes: ChigmaNode[],
  tokenInterval = 8
): ChigmaNode[] {
  if (nodes.length <= 1) return nodes;

  // Sort nodes based on x or y position
  const isHorizontal = Math.abs(nodes[nodes.length - 1].x - nodes[0].x) >
                       Math.abs(nodes[nodes.length - 1].y - nodes[0].y);

  const sorted = [...nodes].sort((a, b) =>
    isHorizontal ? a.x - b.x : a.y - b.y
  );

  let currentOffset = isHorizontal ? sorted[0].x : sorted[0].y;

  return sorted.map((node, index) => {
    if (index === 0) {
      currentOffset += (isHorizontal ? node.width : node.height);
      return node;
    }

    // Snap target gap to nearest token
    const prevNode = sorted[index - 1];
    const prevEnd = isHorizontal ? prevNode.x + prevNode.width : prevNode.y + prevNode.height;
    const rawGap = (isHorizontal ? node.x : node.y) - prevEnd;
    const snappedGap = Math.max(0, Math.round(rawGap / tokenInterval) * tokenInterval || tokenInterval);

    const nextPos = prevEnd + snappedGap;

    const updatedNode: ChigmaNode = {
      ...node,
      x: isHorizontal ? nextPos : node.x,
      y: isHorizontal ? node.y : nextPos
    };

    return updatedNode;
  });
}
