import React from 'react';
import type { IconNode } from '../../models/node';
import { getIconByName } from '../icons/iconRegistry';

interface IconRendererProps {
  node: IconNode;
}

export const IconRenderer: React.FC<IconRendererProps> = React.memo(({ node }) => {
  const iconDef = getIconByName(node.iconName || 'home');
  const pathContent = iconDef ? iconDef.svgPath : '<circle cx="12" cy="12" r="10"/>';

  return (
    <svg
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={node.color || '#000000'}
      strokeWidth={node.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: 'visible' }}
      dangerouslySetInnerHTML={{ __html: pathContent }}
    />
  );
});
