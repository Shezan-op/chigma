import type { ChigmaDocument } from '../models/document';
import type { ChigmaNode } from '../models/node';
import { createDefaultNode } from '../models/document';
import { runDesignLinter } from '../engine/quality/designLinter';
import { generateReactTailwindCode, generateCssCode } from '../engine/export/exportMultiFramework';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const MCP_TOOL_DEFINITIONS: McpToolDefinition[] = [
  {
    name: 'get_project',
    description: 'Retrieves current project metadata, page list, variable collections, and component masters.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_page',
    description: 'Retrieves all nodes and background for a specified page ID.',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: 'ID of the page to retrieve' }
      },
      required: ['pageId']
    }
  },
  {
    name: 'get_node',
    description: 'Retrieves a single node by ID with geometry, styling, constraints, and overrides.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the node' }
      },
      required: ['nodeId']
    }
  },
  {
    name: 'create_node',
    description: 'Creates a new vector shape, text, chart, or wireframe component on the active page.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'NodeType (e.g. button, card, navbar, frame, text, rectangle, table)' },
        x: { type: 'number', description: 'X coordinate' },
        y: { type: 'number', description: 'Y coordinate' },
        customProps: { type: 'object', description: 'Custom properties (label, width, height, fill, etc.)' }
      },
      required: ['type']
    }
  },
  {
    name: 'modify_node',
    description: 'Updates properties (geometry, styling, text, fills, constraints) on a specific node.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Target node ID' },
        updates: { type: 'object', description: 'Partial node properties to apply' }
      },
      required: ['nodeId', 'updates']
    }
  },
  {
    name: 'apply_auto_layout',
    description: 'Applies auto-layout rules to a frame container.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Frame node ID' },
        direction: { type: 'string', enum: ['horizontal', 'vertical'] },
        gap: { type: 'number', description: 'Spacing gap between children' },
        paddingX: { type: 'number' },
        paddingY: { type: 'number' }
      },
      required: ['nodeId', 'direction', 'gap']
    }
  },
  {
    name: 'inspect_design',
    description: 'Runs design linter on the active page, calculating health score and listing spacing/token issues.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'export_code',
    description: 'Exports a selected node or full frame to React + Tailwind or CSS.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Target node ID to export' },
        format: { type: 'string', enum: ['react_tailwind', 'css', 'nextjs'] }
      },
      required: ['nodeId']
    }
  }
];

/**
 * Handles MCP tool execution against a live or provided ChigmaDocument state.
 */
export function executeMcpTool(
  toolName: string,
  args: Record<string, any>,
  document: ChigmaDocument,
  activePageId?: string
): { success: boolean; data?: any; error?: string } {
  const activePage = document.pages.find((p) => p.id === activePageId) || document.pages[0];

  switch (toolName) {
    case 'get_project':
      return {
        success: true,
        data: {
          id: document.id,
          name: document.name,
          pages: document.pages.map((p) => ({ id: p.id, name: p.name, nodeCount: p.children.length })),
          variablesCount: (document.variableCollections || []).flatMap((c) => c.variables).length,
          componentsCount: (document.components || []).length
        }
      };

    case 'get_page': {
      const page = document.pages.find((p) => p.id === args.pageId) || activePage;
      return {
        success: true,
        data: {
          id: page.id,
          name: page.name,
          nodes: page.children
        }
      };
    }

    case 'get_node': {
      let found: ChigmaNode | undefined;
      document.pages.forEach((p) => {
        const n = p.children.find((c) => c.id === args.nodeId);
        if (n) found = n;
      });
      if (!found) return { success: false, error: `Node ${args.nodeId} not found` };
      return { success: true, data: found };
    }

    case 'create_node': {
      const x = args.x ?? 100;
      const y = args.y ?? 100;
      const newNode = createDefaultNode(args.type, x, y, args.customProps || {});
      activePage.children.push(newNode);
      return { success: true, data: newNode };
    }

    case 'modify_node': {
      let found = false;
      document.pages.forEach((p) => {
        const idx = p.children.findIndex((c) => c.id === args.nodeId);
        if (idx !== -1) {
          p.children[idx] = { ...p.children[idx], ...args.updates };
          found = true;
        }
      });
      if (!found) return { success: false, error: `Node ${args.nodeId} not found` };
      return { success: true, data: { nodeId: args.nodeId, modified: true } };
    }

    case 'apply_auto_layout': {
      const node = activePage.children.find((n) => n.id === args.nodeId);
      if (!node) return { success: false, error: `Node ${args.nodeId} not found` };
      (node as any).autoLayout = {
        enabled: true,
        direction: args.direction,
        gap: args.gap,
        paddingX: args.paddingX ?? 16,
        paddingY: args.paddingY ?? 16,
        alignItems: 'start',
        justifyContent: 'start'
      };
      return { success: true, data: node };
    }

    case 'inspect_design': {
      const report = runDesignLinter(document, activePage);
      return { success: true, data: report };
    }

    case 'export_code': {
      let node: ChigmaNode | undefined;
      document.pages.forEach((p) => {
        const n = p.children.find((c) => c.id === args.nodeId);
        if (n) node = n;
      });
      if (!node) return { success: false, error: `Node ${args.nodeId} not found` };

      const format = args.format || 'react_tailwind';
      const code = format === 'css' ? generateCssCode(node) : generateReactTailwindCode(node);
      return { success: true, data: { format, code } };
    }

    default:
      return { success: false, error: `Unknown MCP tool: ${toolName}` };
  }
}
