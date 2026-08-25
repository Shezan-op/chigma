import { type Point, rotatePoint } from './point';
import type { ChigmaNode } from '../../models/node';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export function getNodeCorners(node: ChigmaNode): Point[] {
  const { x, y, width, height, rotation = 0 } = node;
  const center = { x: x + width / 2, y: y + height / 2 };

  const unrotatedCorners: Point[] = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ];

  if (!rotation) return unrotatedCorners;

  return unrotatedCorners.map(p => rotatePoint(p, center, rotation));
}

export function getNodeAABB(node: ChigmaNode): BoundingBox {
  const corners = getNodeCorners(node);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const c of corners) {
    if (c.x < minX) minX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.x > maxX) maxX = c.x;
    if (c.y > maxY) maxY = c.y;
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2
  };
}

export function getNodesCompositeBounds(nodes: ChigmaNode[]): BoundingBox | null {
  if (nodes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    const aabb = getNodeAABB(node);
    if (aabb.minX < minX) minX = aabb.minX;
    if (aabb.minY < minY) minY = aabb.minY;
    if (aabb.maxX > maxX) maxX = aabb.maxX;
    if (aabb.maxY > maxY) maxY = aabb.maxY;
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2
  };
}

export function isPointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function isPointInNode(point: Point, node: ChigmaNode): boolean {
  const { x, y, width, height, rotation = 0 } = node;
  const center = { x: x + width / 2, y: y + height / 2 };

  const localPoint = rotatePoint(point, center, -rotation);

  return (
    localPoint.x >= x &&
    localPoint.x <= x + width &&
    localPoint.y >= y &&
    localPoint.y <= y + height
  );
}

export function doRectsIntersect(r1: Rect, r2: Rect): boolean {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export function doesMarqueeIntersectNode(marquee: Rect, node: ChigmaNode): boolean {
  const aabb = getNodeAABB(node);
  const nodeRect: Rect = {
    x: aabb.minX,
    y: aabb.minY,
    width: aabb.width,
    height: aabb.height
  };
  return doRectsIntersect(marquee, nodeRect);
}
