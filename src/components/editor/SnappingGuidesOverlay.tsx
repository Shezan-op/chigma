import React from 'react';
import type { SnapGuide } from '../../engine/geometry/snapping';

interface SnappingGuidesOverlayProps {
  guides: SnapGuide[];
}

export const SnappingGuidesOverlay: React.FC<SnappingGuidesOverlayProps> = ({ guides }) => {
  return (
    <g className="chigma-snapping-guides" style={{ pointerEvents: 'none' }}>
      {guides.map((guide, idx) => {
        if (guide.type === 'x') {
          return (
            <line
              key={idx}
              x1={guide.position}
              y1={guide.from}
              x2={guide.position}
              y2={guide.to}
              stroke="#EC4899"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          );
        } else {
          return (
            <line
              key={idx}
              x1={guide.from}
              y1={guide.position}
              x2={guide.to}
              y2={guide.position}
              stroke="#EC4899"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          );
        }
      })}
    </g>
  );
};
