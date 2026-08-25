import React from 'react';
import type { MarqueeState } from '../../store/useEditorStore';

interface MarqueeOverlayProps {
  marquee: MarqueeState;
}

export const MarqueeOverlay: React.FC<MarqueeOverlayProps> = ({ marquee }) => {
  const x = Math.min(marquee.startX, marquee.currentX);
  const y = Math.min(marquee.startY, marquee.currentY);
  const width = Math.abs(marquee.currentX - marquee.startX);
  const height = Math.abs(marquee.currentY - marquee.startY);

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(59, 130, 246, 0.08)"
      stroke="#3B82F6"
      strokeWidth={1}
      strokeDasharray="4,4"
      style={{ pointerEvents: 'none' }}
    />
  );
};
