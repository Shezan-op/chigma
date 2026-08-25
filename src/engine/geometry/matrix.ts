import type { Point } from './point';

export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export function screenToWorld(screenPoint: Point, viewport: Viewport): Point {
  return {
    x: (screenPoint.x - viewport.panX) / viewport.zoom,
    y: (screenPoint.y - viewport.panY) / viewport.zoom
  };
}

export function worldToScreen(worldPoint: Point, viewport: Viewport): Point {
  return {
    x: worldPoint.x * viewport.zoom + viewport.panX,
    y: worldPoint.y * viewport.zoom + viewport.panY
  };
}

export function calculateZoomAroundPoint(
  currentViewport: Viewport,
  screenPoint: Point,
  nextZoom: number,
  minZoom = 0.05,
  maxZoom = 32
): Viewport {
  const targetZoom = Math.min(Math.max(nextZoom, minZoom), maxZoom);
  const factor = targetZoom / currentViewport.zoom;

  const nextPanX = screenPoint.x - (screenPoint.x - currentViewport.panX) * factor;
  const nextPanY = screenPoint.y - (screenPoint.y - currentViewport.panY) * factor;

  return {
    zoom: targetZoom,
    panX: nextPanX,
    panY: nextPanY
  };
}
