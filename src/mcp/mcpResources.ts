import type { ChigmaDocument } from '../models/document';

export interface McpResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export const MCP_RESOURCES: McpResourceDefinition[] = [
  {
    uri: 'chigma://project/current',
    name: 'Current Project Metadata',
    description: 'Overview of current project name, pages, and statistics',
    mimeType: 'application/json'
  },
  {
    uri: 'chigma://design-system',
    name: 'Design System Tokens',
    description: 'Registered design variables, colors, and typography styles',
    mimeType: 'application/json'
  },
  {
    uri: 'chigma://components',
    name: 'Component Masters',
    description: 'All master component definitions in the document',
    mimeType: 'application/json'
  }
];

export function readMcpResource(uri: string, document: ChigmaDocument): { contents: string; mimeType: string } | null {
  if (uri === 'chigma://project/current') {
    return {
      contents: JSON.stringify({
        id: document.id,
        name: document.name,
        pages: document.pages.map((p) => ({ id: p.id, name: p.name, nodes: p.children.length }))
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  if (uri === 'chigma://design-system') {
    return {
      contents: JSON.stringify({
        variableCollections: document.variableCollections,
        styles: document.styles
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  if (uri === 'chigma://components') {
    return {
      contents: JSON.stringify(document.components || [], null, 2),
      mimeType: 'application/json'
    };
  }

  return null;
}
