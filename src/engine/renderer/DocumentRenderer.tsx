import React from 'react';
import type { Page } from '../../models/document';
import { NodeRenderer } from './NodeRenderer';
import { SvgDefsRenderer } from './SvgDefsRenderer';

interface DocumentRendererProps {
  page: Page;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = React.memo(({ page }) => {
  return (
    <>
      <SvgDefsRenderer page={page} />
      <g id="chigma_document_layer">
        {page.children?.map((node) => (
          <NodeRenderer key={node.id} node={node} />
        ))}
      </g>
    </>
  );
});
