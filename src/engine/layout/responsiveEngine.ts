import type { ChigmaNode, ResponsiveConstraints, FrameNode, GroupNode } from '../../models/node';

/**
 * Calculates new position and size for a child node when its parent container resizes.
 */
export function applyResponsiveConstraints(
  child: ChigmaNode,
  prevParentWidth: number,
  prevParentHeight: number,
  newParentWidth: number,
  newParentHeight: number
): Partial<ChigmaNode> {
  const constraints: ResponsiveConstraints = child.constraints || {
    horizontal: 'left',
    vertical: 'top'
  };

  const deltaW = newParentWidth - prevParentWidth;
  const deltaH = newParentHeight - prevParentHeight;

  let nextX = child.x;
  let nextWidth = child.width;
  let nextY = child.y;
  let nextHeight = child.height;

  // 1. Horizontal constraint calculations
  switch (constraints.horizontal) {
    case 'left':
      // Anchored to left edge - x and width remain constant
      break;

    case 'right':
      nextX = child.x + deltaW;
      break;

    case 'center':
      nextX = child.x + deltaW / 2;
      break;

    case 'scale':
      if (prevParentWidth > 0) {
        nextX = (child.x / prevParentWidth) * newParentWidth;
        nextWidth = Math.max(8, (child.width / prevParentWidth) * newParentWidth);
      }
      break;

    case 'left_right':
      nextX = child.x;
      nextWidth = Math.max(8, child.width + deltaW);
      break;
  }

  // 2. Vertical constraint calculations
  switch (constraints.vertical) {
    case 'top':
      // Anchored to top edge - y and height remain constant
      break;

    case 'bottom':
      nextY = child.y + deltaH;
      break;

    case 'center':
      nextY = child.y + deltaH / 2;
      break;

    case 'scale':
      if (prevParentHeight > 0) {
        nextY = (child.y / prevParentHeight) * newParentHeight;
        nextHeight = Math.max(8, (child.height / prevParentHeight) * newParentHeight);
      }
      break;

    case 'top_bottom':
      nextY = child.y;
      nextHeight = Math.max(8, child.height + deltaH);
      break;
  }

  // 3. Clamp against Min/Max limits if specified
  if (child.minWidth !== undefined) nextWidth = Math.max(child.minWidth, nextWidth);
  if (child.maxWidth !== undefined) nextWidth = Math.min(child.maxWidth, nextWidth);
  if (child.minHeight !== undefined) nextHeight = Math.max(child.minHeight, nextHeight);
  if (child.maxHeight !== undefined) nextHeight = Math.min(child.maxHeight, nextHeight);

  return {
    x: Math.round(nextX),
    y: Math.round(nextY),
    width: Math.round(nextWidth),
    height: Math.round(nextHeight)
  };
}

/**
 * Recalculates all children of a resized frame node using their active constraints.
 */
export function resizeFrameWithConstraints(
  frameNode: ChigmaNode,
  newWidth: number,
  newHeight: number
): ChigmaNode {
  const prevWidth = frameNode.width;
  const prevHeight = frameNode.height;

  const children = 'children' in frameNode ? (frameNode as FrameNode | GroupNode).children : undefined;

  if (!children || children.length === 0) {
    return {
      ...frameNode,
      width: newWidth,
      height: newHeight
    };
  }

  const updatedChildren = children.map((child: ChigmaNode) => {
    const updates = applyResponsiveConstraints(
      child,
      prevWidth,
      prevHeight,
      newWidth,
      newHeight
    );
    return {
      ...child,
      ...updates
    };
  });

  return {
    ...frameNode,
    width: newWidth,
    height: newHeight,
    children: updatedChildren
  } as ChigmaNode;
}
