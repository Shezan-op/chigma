import React from 'react';
import type { GroupNode } from '../../models/node';
import { NodeRenderer } from './NodeRenderer';

export const GroupRenderer: React.FC<{ node: GroupNode }> = React.memo(({ node }) => {
  return (
    <g>
      {node.children?.map((child) => (
        <NodeRenderer key={child.id} node={child} />
      ))}
    </g>
  );
});
