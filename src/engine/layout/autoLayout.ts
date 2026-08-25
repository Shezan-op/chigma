import type { AutoLayoutConfig, ChigmaNode, FrameNode, GroupNode } from '../../models/node';

export function computeAutoLayoutPositions(
  container: FrameNode | GroupNode,
  children: ChigmaNode[],
  config: AutoLayoutConfig
): { updatedChildren: ChigmaNode[]; newWidth: number; newHeight: number } {
  if (!config.enabled || children.length === 0) {
    return { updatedChildren: children, newWidth: container.width, newHeight: container.height };
  }

  const { direction, gap, paddingX, paddingY, alignItems } = config;
  const isHorizontal = direction === 'horizontal';

  let currentOffset = isHorizontal ? paddingX : paddingY;
  let maxCrossAxisSize = 0;

  const updatedChildren: ChigmaNode[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = { ...children[i] };

    if (isHorizontal) {
      child.x = currentOffset;
      // Cross-axis alignment (Y)
      if (alignItems === 'center') {
        const parentH = container.height;
        child.y = Math.max(paddingY, (parentH - child.height) / 2);
      } else if (alignItems === 'end') {
        child.y = container.height - paddingY - child.height;
      } else {
        child.y = paddingY;
      }
      currentOffset += child.width + (i < children.length - 1 ? gap : 0);
      maxCrossAxisSize = Math.max(maxCrossAxisSize, child.height);
    } else {
      child.y = currentOffset;
      // Cross-axis alignment (X)
      if (alignItems === 'center') {
        const parentW = container.width;
        child.x = Math.max(paddingX, (parentW - child.width) / 2);
      } else if (alignItems === 'end') {
        child.x = container.width - paddingX - child.width;
      } else {
        child.x = paddingX;
      }
      currentOffset += child.height + (i < children.length - 1 ? gap : 0);
      maxCrossAxisSize = Math.max(maxCrossAxisSize, child.width);
    }

    updatedChildren.push(child);
  }

  const newWidth = isHorizontal
    ? currentOffset + paddingX
    : Math.max(container.width, maxCrossAxisSize + paddingX * 2);

  const newHeight = isHorizontal
    ? Math.max(container.height, maxCrossAxisSize + paddingY * 2)
    : currentOffset + paddingY;

  return { updatedChildren, newWidth, newHeight };
}

/**
 * Arranges a list of nodes into a single row or column stack with a specific gap.
 */
export function packNodes(
  nodes: ChigmaNode[],
  direction: 'horizontal' | 'vertical',
  gap = 16
): ChigmaNode[] {
  if (nodes.length <= 1) return nodes;

  // Sort nodes in order of current X or Y position
  const sorted = [...nodes].sort((a, b) =>
    direction === 'horizontal' ? a.x - b.x : a.y - b.y
  );

  const first = sorted[0];
  let currentPos = direction === 'horizontal' ? first.x : first.y;

  return sorted.map((node) => {
    const updated = { ...node };
    if (direction === 'horizontal') {
      updated.x = currentPos;
      // Align Y with first element
      updated.y = first.y;
      currentPos += updated.width + gap;
    } else {
      updated.y = currentPos;
      // Align X with first element
      updated.x = first.x;
      currentPos += updated.height + gap;
    }
    return updated;
  });
}
