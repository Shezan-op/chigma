import React from 'react';
import type { ChigmaNode } from '../../models/node';
import type { Viewport } from '../../engine/geometry/matrix';
import { getNodesCompositeBounds } from '../../engine/geometry/bounds';

interface TransformOverlayProps {
  selectedNodes: ChigmaNode[];
  viewport: Viewport;
}

export const TransformOverlay: React.FC<TransformOverlayProps> = ({ selectedNodes, viewport }) => {
  if (selectedNodes.length === 0) return null;

  const isSingle = selectedNodes.length === 1;
  const single = selectedNodes[0];
  const bounds = isSingle
    ? {
        minX: single.x,
        minY: single.y,
        maxX: single.x + single.width,
        maxY: single.y + single.height,
        width: single.width,
        height: single.height,
        centerX: single.x + single.width / 2,
        centerY: single.y + single.height / 2
      }
    : getNodesCompositeBounds(selectedNodes);

  if (!bounds) return null;

  const { minX, minY, width, height, centerX, centerY } = bounds;
  const rotation = isSingle ? single.rotation || 0 : 0;
  const transform = rotation ? `rotate(${rotation} ${centerX} ${centerY})` : undefined;

  const handleSize = 8 / (viewport.zoom || 1);
  const halfHandle = handleSize / 2;
  const rotateHandleDist = 20 / (viewport.zoom || 1);

  return (
    <g className="chigma-transform-overlay" transform={transform} style={{ pointerEvents: 'all' }}>
      {/* Bounding Box Border */}
      <rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={1 / (viewport.zoom || 1)}
        style={{ pointerEvents: 'none' }}
      />

      {/* 8 Resize Handles */}
      {/* North-West */}
      <rect
        data-handle-type="nw"
        x={minX - halfHandle}
        y={minY - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'nwse-resize' }}
      />
      {/* North */}
      <rect
        data-handle-type="n"
        x={minX + width / 2 - halfHandle}
        y={minY - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'ns-resize' }}
      />
      {/* North-East */}
      <rect
        data-handle-type="ne"
        x={minX + width - halfHandle}
        y={minY - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'nesw-resize' }}
      />
      {/* East */}
      <rect
        data-handle-type="e"
        x={minX + width - halfHandle}
        y={minY + height / 2 - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'ew-resize' }}
      />
      {/* South-East */}
      <rect
        data-handle-type="se"
        x={minX + width - halfHandle}
        y={minY + height - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'nwse-resize' }}
      />
      {/* South */}
      <rect
        data-handle-type="s"
        x={minX + width / 2 - halfHandle}
        y={minY + height - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'ns-resize' }}
      />
      {/* South-West */}
      <rect
        data-handle-type="sw"
        x={minX - halfHandle}
        y={minY + height - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'nesw-resize' }}
      />
      {/* West */}
      <rect
        data-handle-type="w"
        x={minX - halfHandle}
        y={minY + height / 2 - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="#FFFFFF"
        stroke="#3B82F6"
        strokeWidth={1.5 / (viewport.zoom || 1)}
        style={{ cursor: 'ew-resize' }}
      />

      {/* Rotation Handle (Single Node only) */}
      {isSingle && (
        <g>
          <line
            x1={minX + width / 2}
            y1={minY}
            x2={minX + width / 2}
            y2={minY - rotateHandleDist}
            stroke="#3B82F6"
            strokeWidth={1 / (viewport.zoom || 1)}
            style={{ pointerEvents: 'none' }}
          />
          <circle
            data-handle-type="rotate"
            cx={minX + width / 2}
            cy={minY - rotateHandleDist}
            r={halfHandle + 1}
            fill="#FFFFFF"
            stroke="#3B82F6"
            strokeWidth={1.5 / (viewport.zoom || 1)}
            style={{ cursor: 'grab' }}
          />
        </g>
      )}
    </g>
  );
};
