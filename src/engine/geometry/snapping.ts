import type { ChigmaNode } from '../../models/node';
import { getNodeAABB, type BoundingBox } from './bounds';

export interface SnapGuide {
  type: 'x' | 'y';
  position: number;
  from: number;
  to: number;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

export interface SnapOptions {
  snapToGrid?: boolean;
  gridSize?: number;
  snapToObjects?: boolean;
  threshold?: number;
}

export function calculateSnapping(
  draggingBounds: BoundingBox,
  otherNodes: ChigmaNode[],
  options: SnapOptions = {}
): SnapResult {
  const {
    snapToGrid = true,
    gridSize = 8,
    snapToObjects = true,
    threshold = 6
  } = options;

  let snappedX = draggingBounds.minX;
  let snappedY = draggingBounds.minY;
  const guides: SnapGuide[] = [];

  const width = draggingBounds.width;
  const height = draggingBounds.height;

  // 1. Grid Snapping
  if (snapToGrid && gridSize > 0) {
    const gridRemX = snappedX % gridSize;
    if (Math.abs(gridRemX) < threshold) {
      snappedX = Math.round(snappedX / gridSize) * gridSize;
    }

    const gridRemY = snappedY % gridSize;
    if (Math.abs(gridRemY) < threshold) {
      snappedY = Math.round(snappedY / gridSize) * gridSize;
    }
  }

  // 2. Object Snapping (edge & center)
  if (snapToObjects && otherNodes.length > 0) {
    const currentLeft = snappedX;
    const currentCenterX = snappedX + width / 2;
    const currentRight = snappedX + width;

    const currentTop = snappedY;
    const currentCenterY = snappedY + height / 2;
    const currentBottom = snappedY + height;

    let bestDiffX = threshold;
    let snapOffsetX = 0;
    let guideX: SnapGuide | null = null;

    let bestDiffY = threshold;
    let snapOffsetY = 0;
    let guideY: SnapGuide | null = null;

    for (const node of otherNodes) {
      if (!node.visible) continue;
      const target = getNodeAABB(node);

      const targetXCoords = [
        { val: target.minX, label: 'left' },
        { val: target.centerX, label: 'center' },
        { val: target.maxX, label: 'right' }
      ];

      const currentXCoords = [
        { val: currentLeft, offset: 0 },
        { val: currentCenterX, offset: -width / 2 },
        { val: currentRight, offset: -width }
      ];

      for (const cur of currentXCoords) {
        for (const tgt of targetXCoords) {
          const diff = Math.abs(cur.val - tgt.val);
          if (diff < bestDiffX) {
            bestDiffX = diff;
            snapOffsetX = tgt.val + cur.offset - snappedX;
            guideX = {
              type: 'x',
              position: tgt.val,
              from: Math.min(snappedY, target.minY) - 20,
              to: Math.max(snappedY + height, target.maxY) + 20
            };
          }
        }
      }

      const targetYCoords = [
        { val: target.minY, label: 'top' },
        { val: target.centerY, label: 'center' },
        { val: target.maxY, label: 'bottom' }
      ];

      const currentYCoords = [
        { val: currentTop, offset: 0 },
        { val: currentCenterY, offset: -height / 2 },
        { val: currentBottom, offset: -height }
      ];

      for (const cur of currentYCoords) {
        for (const tgt of targetYCoords) {
          const diff = Math.abs(cur.val - tgt.val);
          if (diff < bestDiffY) {
            bestDiffY = diff;
            snapOffsetY = tgt.val + cur.offset - snappedY;
            guideY = {
              type: 'y',
              position: tgt.val,
              from: Math.min(snappedX, target.minX) - 20,
              to: Math.max(snappedX + width, target.maxX) + 20
            };
          }
        }
      }
    }

    if (guideX) {
      snappedX += snapOffsetX;
      guides.push(guideX);
    }
    if (guideY) {
      snappedY += snapOffsetY;
      guides.push(guideY);
    }
  }

  return {
    x: Math.round(snappedX),
    y: Math.round(snappedY),
    guides
  };
}
