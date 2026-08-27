import React from 'react';
import type { ImageNode } from '../../models/node';

export const ImageRenderer: React.FC<{ node: ImageNode }> = React.memo(({ node }) => {
  const clipId = `clip_${node.id}`;
  let preserveAspectRatio = 'xMidYMid meet';
  if (node.objectFit === 'cover') {
    preserveAspectRatio = 'xMidYMid slice';
  } else if (node.objectFit === 'fill') {
    preserveAspectRatio = 'none';
  }

  const rx = typeof node.cornerRadius === 'object' && node.cornerRadius !== null
    ? node.cornerRadius.topLeft || 0
    : node.cornerRadius || 0;

  const hasRadius = rx > 0;

  return (
    <>
      {hasRadius && (
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
      {node.src ? (
        <image
          href={node.src}
          x={0}
          y={0}
          width={node.width}
          height={node.height}
          preserveAspectRatio={preserveAspectRatio}
          clipPath={hasRadius ? `url(#${clipId})` : undefined}
        />
      ) : (
        <g>
          <rect
            x={0}
            y={0}
            width={node.width}
            height={node.height}
            fill="#F4F4F5"
            stroke="#D4D4D8"
            strokeWidth={1}
            rx={rx}
          />
          <line x1={0} y1={0} x2={node.width} y2={node.height} stroke="#E4E4E7" strokeWidth={1} />
          <line x1={node.width} y1={0} x2={0} y2={node.height} stroke="#E4E4E7" strokeWidth={1} />
          <text
            x={node.width / 2}
            y={node.height / 2 + 5}
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize={12}
            fontFamily="Inter, sans-serif"
          >
            No Image
          </text>
        </g>
      )}
    </>
  );
});
