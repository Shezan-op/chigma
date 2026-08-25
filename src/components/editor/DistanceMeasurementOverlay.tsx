import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';


export const DistanceMeasurementOverlay: React.FC = () => {
  const { altPressed, selectedIds, hoveredId, viewport } = useEditorStore();
  const { getActivePage } = useDocumentStore();

  if (!altPressed || selectedIds.length === 0) return null;

  const page = getActivePage();
  if (!page) return null;

  const selectedNode = page.children.find((n) => n.id === selectedIds[0]);
  if (!selectedNode) return null;

  // Measure either against hovered node, or if none, against canvas origin/frame
  let targetNode: ChigmaNode | null = null;
  if (hoveredId && hoveredId !== selectedNode.id) {
    targetNode = page.children.find((n) => n.id === hoveredId) || null;
  }

  const sBounds = {
    left: selectedNode.x,
    right: selectedNode.x + selectedNode.width,
    top: selectedNode.y,
    bottom: selectedNode.y + selectedNode.height,
    midX: selectedNode.x + selectedNode.width / 2,
    midY: selectedNode.y + selectedNode.height / 2
  };

  const lines: { x1: number; y1: number; x2: number; y2: number; label: string; midX: number; midY: number }[] = [];

  if (targetNode) {
    const tBounds = {
      left: targetNode.x,
      right: targetNode.x + targetNode.width,
      top: targetNode.y,
      bottom: targetNode.y + targetNode.height,
      midX: targetNode.x + targetNode.width / 2,
      midY: targetNode.y + targetNode.height / 2
    };

    // Horizontal Distance (Left to Right or Right to Left)
    if (sBounds.right <= tBounds.left) {
      // Selected is left of target
      const gapX = Math.round(tBounds.left - sBounds.right);
      const midY = sBounds.midY;
      lines.push({
        x1: sBounds.right,
        y1: midY,
        x2: tBounds.left,
        y2: midY,
        label: `${gapX}px`,
        midX: (sBounds.right + tBounds.left) / 2,
        midY
      });
    } else if (tBounds.right <= sBounds.left) {
      // Selected is right of target
      const gapX = Math.round(sBounds.left - tBounds.right);
      const midY = sBounds.midY;
      lines.push({
        x1: tBounds.right,
        y1: midY,
        x2: sBounds.left,
        y2: midY,
        label: `${gapX}px`,
        midX: (tBounds.right + sBounds.left) / 2,
        midY
      });
    }

    // Vertical Distance (Top to Bottom or Bottom to Top)
    if (sBounds.bottom <= tBounds.top) {
      // Selected is above target
      const gapY = Math.round(tBounds.top - sBounds.bottom);
      const midX = sBounds.midX;
      lines.push({
        x1: midX,
        y1: sBounds.bottom,
        x2: midX,
        y2: tBounds.top,
        label: `${gapY}px`,
        midX,
        midY: (sBounds.bottom + tBounds.top) / 2
      });
    } else if (tBounds.bottom <= sBounds.top) {
      // Selected is below target
      const gapY = Math.round(sBounds.top - tBounds.bottom);
      const midX = sBounds.midX;
      lines.push({
        x1: midX,
        y1: tBounds.bottom,
        x2: midX,
        y2: sBounds.top,
        label: `${gapY}px`,
        midX,
        midY: (tBounds.bottom + sBounds.top) / 2
      });
    }
  }

  return (
    <g className="chigma-distance-measurement-layer" style={{ pointerEvents: 'none' }}>
      {/* Outline for target node if hovered */}
      {targetNode && (
        <rect
          x={targetNode.x}
          y={targetNode.y}
          width={targetNode.width}
          height={targetNode.height}
          fill="none"
          stroke="#FF0055"
          strokeWidth={1.5 / viewport.zoom}
          strokeDasharray={`${4 / viewport.zoom},${4 / viewport.zoom}`}
        />
      )}

      {/* Measurement lines and badges */}
      {lines.map((line, idx) => {
        const badgeWidth = 42 / viewport.zoom;
        const badgeHeight = 18 / viewport.zoom;
        const fontSize = 10 / viewport.zoom;

        return (
          <g key={idx}>
            {/* Guide line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#FF0055"
              strokeWidth={1.5 / viewport.zoom}
            />

            {/* End caps */}
            <circle cx={line.x1} cy={line.y1} r={2.5 / viewport.zoom} fill="#FF0055" />
            <circle cx={line.x2} cy={line.y2} r={2.5 / viewport.zoom} fill="#FF0055" />

            {/* Measurement Badge */}
            <rect
              x={line.midX - badgeWidth / 2}
              y={line.midY - badgeHeight / 2}
              width={badgeWidth}
              height={badgeHeight}
              rx={9 / viewport.zoom}
              fill="#FF0055"
            />
            <text
              x={line.midX}
              y={line.midY + (3.5 / viewport.zoom)}
              fill="#FFFFFF"
              fontSize={fontSize}
              fontWeight={700}
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              {line.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
