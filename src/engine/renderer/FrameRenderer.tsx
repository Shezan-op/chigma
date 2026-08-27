import React from 'react';
import type { FrameNode } from '../../models/node';
import { NodeRenderer } from './NodeRenderer';

export const FrameRenderer: React.FC<{ node: FrameNode }> = React.memo(({ node }) => {
  const clipId = `frame_clip_${node.id}`;
  const rx = typeof node.cornerRadius === 'object' && node.cornerRadius !== null
    ? node.cornerRadius.topLeft || 0
    : node.cornerRadius || 0;

  return (
    <g>
      {node.clipContent && (
        <defs>
          <clipPath id={clipId}>
            <rect
              x={0}
              y={0}
              width={node.width}
              height={node.height}
              rx={rx}
              ry={rx}
            />
          </clipPath>
        </defs>
      )}

      {/* Frame Background */}
      <rect
        x={0}
        y={0}
        width={node.width}
        height={node.height}
        rx={rx}
        ry={rx}
        fill={node.fill || '#FFFFFF'}
        stroke={node.stroke || '#E4E4E7'}
        strokeWidth={node.strokeWidth || 1}
      />

      {/* Frame Children */}
      <g clipPath={node.clipContent ? `url(#${clipId})` : undefined}>
        {node.children?.map((child) => (
          <NodeRenderer key={child.id} node={child} />
        ))}
      </g>
    </g>
  );
});
