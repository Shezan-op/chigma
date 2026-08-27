import React from 'react';
import type { SvgNode } from '../../models/node';

interface SvgRendererProps {
  node: SvgNode;
}

export const SvgRenderer: React.FC<SvgRendererProps> = React.memo(({ node }) => {
  return (
    <svg
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      viewBox={node.preserveAspectRatio ? undefined : '0 0 100 100'}
      style={{ overflow: 'visible' }}
      dangerouslySetInnerHTML={{ __html: node.svgContent || '' }}
    />
  );
});
