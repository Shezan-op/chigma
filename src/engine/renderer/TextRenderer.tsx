import React from 'react';
import type { TextNode } from '../../models/node';

export const TextRenderer: React.FC<{ node: TextNode }> = React.memo(({ node }) => {
  const lines = (node.text || '').split('\n');
  const fontSize = node.fontSize || 16;
  const lineHeightVal = (node.lineHeight || 1.2) * fontSize;

  let textAnchor: 'start' | 'middle' | 'end' = 'start';
  let startX = 0;

  if (node.textAlign === 'center') {
    textAnchor = 'middle';
    startX = node.width / 2;
  } else if (node.textAlign === 'right') {
    textAnchor = 'end';
    startX = node.width;
  }

  return (
    <text
      x={startX}
      y={fontSize * 0.9}
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontSize={fontSize}
      fontWeight={node.fontWeight || 400}
      fontStyle={node.fontStyle || 'normal'}
      letterSpacing={node.letterSpacing ? `${node.letterSpacing}px` : undefined}
      fill={node.fill || '#18181B'}
      textAnchor={textAnchor}
      dominantBaseline="alphabetic"
      style={{ userSelect: 'none' }}
    >
      {lines.map((line, idx) => (
        <tspan
          key={idx}
          x={startX}
          dy={idx === 0 ? 0 : lineHeightVal}
        >
          {line || ' '}
        </tspan>
      ))}
    </text>
  );
});
