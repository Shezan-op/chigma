/**
 * Bézier Pen Path Editor Engine for Chigma
 * Supports anchor point editing, corner/smooth/symmetric nodes, tangent handles, and path serialization.
 */

export type BezierPointType = 'corner' | 'smooth' | 'symmetric';

export interface BezierHandle {
  x: number;
  y: number;
}

export interface BezierAnchorPoint {
  id: string;
  x: number;
  y: number;
  pointType: BezierPointType;
  handleIn?: BezierHandle;
  handleOut?: BezierHandle;
}

export interface BezierPathModel {
  id: string;
  anchors: BezierAnchorPoint[];
  closed: boolean;
}

function fmt(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

/**
 * Serializes an array of Bézier anchor points to a standard SVG path `d` string.
 */
export function anchorsToSvgPath(anchors: BezierAnchorPoint[], closed: boolean = false): string {
  if (!anchors || anchors.length === 0) return '';
  if (anchors.length === 1) return `M ${fmt(anchors[0].x)} ${fmt(anchors[0].y)}`;

  let d = `M ${fmt(anchors[0].x)} ${fmt(anchors[0].y)}`;

  for (let i = 1; i < anchors.length; i++) {
    const prev = anchors[i - 1];
    const curr = anchors[i];

    if (prev.handleOut || curr.handleIn) {
      const cp1x = prev.handleOut ? prev.handleOut.x : prev.x;
      const cp1y = prev.handleOut ? prev.handleOut.y : prev.y;
      const cp2x = curr.handleIn ? curr.handleIn.x : curr.x;
      const cp2y = curr.handleIn ? curr.handleIn.y : curr.y;
      d += ` C ${fmt(cp1x)} ${fmt(cp1y)}, ${fmt(cp2x)} ${fmt(cp2y)}, ${fmt(curr.x)} ${fmt(curr.y)}`;
    } else {
      d += ` L ${fmt(curr.x)} ${fmt(curr.y)}`;
    }
  }

  if (closed && anchors.length >= 2) {
    const first = anchors[0];
    const last = anchors[anchors.length - 1];
    if (last.handleOut || first.handleIn) {
      const cp1x = last.handleOut ? last.handleOut.x : last.x;
      const cp1y = last.handleOut ? last.handleOut.y : last.y;
      const cp2x = first.handleIn ? first.handleIn.x : first.x;
      const cp2y = first.handleIn ? first.handleIn.y : first.y;
      d += ` C ${fmt(cp1x)} ${fmt(cp1y)}, ${fmt(cp2x)} ${fmt(cp2y)}, ${fmt(first.x)} ${fmt(first.y)} Z`;
    } else {
      d += ' Z';
    }
  }

  return d;
}

/**
 * Creates a new Bézier anchor point with default coordinates and handles.
 */
export function createAnchor(x: number, y: number, pointType: BezierPointType = 'corner'): BezierAnchorPoint {
  return {
    id: `anchor_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    x,
    y,
    pointType
  };
}

/**
 * Moves an anchor and adjusts its tangent handles proportionally.
 */
export function moveAnchor(anchor: BezierAnchorPoint, dx: number, dy: number): BezierAnchorPoint {
  const updated: BezierAnchorPoint = {
    ...anchor,
    x: anchor.x + dx,
    y: anchor.y + dy
  };
  if (updated.handleIn) {
    updated.handleIn = { x: updated.handleIn.x + dx, y: updated.handleIn.y + dy };
  }
  if (updated.handleOut) {
    updated.handleOut = { x: updated.handleOut.x + dx, y: updated.handleOut.y + dy };
  }
  return updated;
}

/**
 * Updates a control handle while maintaining smooth or symmetric node constraints.
 */
export function updateAnchorHandle(
  anchor: BezierAnchorPoint,
  handle: 'in' | 'out',
  newX: number,
  newY: number
): BezierAnchorPoint {
  const updated = { ...anchor };

  if (handle === 'out') {
    updated.handleOut = { x: newX, y: newY };
    if (anchor.pointType === 'symmetric') {
      const dx = newX - anchor.x;
      const dy = newY - anchor.y;
      updated.handleIn = { x: anchor.x - dx, y: anchor.y - dy };
    } else if (anchor.pointType === 'smooth' && updated.handleIn) {
      const inDist = Math.hypot(updated.handleIn.x - anchor.x, updated.handleIn.y - anchor.y);
      const angle = Math.atan2(newY - anchor.y, newX - anchor.x) + Math.PI;
      updated.handleIn = {
        x: anchor.x + Math.cos(angle) * inDist,
        y: anchor.y + Math.sin(angle) * inDist
      };
    }
  } else {
    updated.handleIn = { x: newX, y: newY };
    if (anchor.pointType === 'symmetric') {
      const dx = newX - anchor.x;
      const dy = newY - anchor.y;
      updated.handleOut = { x: anchor.x - dx, y: anchor.y - dy };
    } else if (anchor.pointType === 'smooth' && updated.handleOut) {
      const outDist = Math.hypot(updated.handleOut.x - anchor.x, updated.handleOut.y - anchor.y);
      const angle = Math.atan2(newY - anchor.y, newX - anchor.x) + Math.PI;
      updated.handleOut = {
        x: anchor.x + Math.cos(angle) * outDist,
        y: anchor.y + Math.sin(angle) * outDist
      };
    }
  }

  return updated;
}
