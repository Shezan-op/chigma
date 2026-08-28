import type { ChigmaDocument } from '../models/document';
import type { ChigmaNode } from '../models/node';
import { createDefaultNode } from '../models/document';
import { runDesignLinter } from '../engine/quality/designLinter';
import { generateReactTailwindCode, generateCssCode, generateNextJsCode } from '../engine/export/exportMultiFramework';
import { useEditorStore } from '../store/useEditorStore';

export const McpErrorCode = {
  INVALID_NODE: 'INVALID_NODE',
  INVALID_PARENT: 'INVALID_PARENT',
  INVALID_COMPONENT: 'INVALID_COMPONENT',
  INVALID_PROPERTY: 'INVALID_PROPERTY',
  INVALID_VARIABLE: 'INVALID_VARIABLE',
  INVALID_STYLE: 'INVALID_STYLE',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  OPERATION_FAILED: 'OPERATION_FAILED'
} as const;

export type McpErrorCode = typeof McpErrorCode[keyof typeof McpErrorCode];

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpToolResult {
  success: boolean;
  data?: any;
  changes?: Array<{ type: 'created' | 'modified' | 'deleted' | 'styled'; nodeId?: string; details?: string }>;
  summary?: string;
  error?: string;
  errorCode?: McpErrorCode;
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
    description: 'Retrieves all nodes, layout hierarchy, and background for a specified page ID.',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: 'ID of the page to retrieve (defaults to active page)' }
      }
    }
  },
  {
    name: 'get_node',
    description: 'Retrieves a single node by ID with full geometry, styling, constraints, children, and overrides.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the node' }
      },
      required: ['nodeId']
    }
  },
  {
    name: 'get_selection',
    description: 'Retrieves all currently selected nodes in the active Chigma editor session.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_design_snapshot',
    description: 'Returns a deterministic semantic summary of the current design: structure, tokens, components, and layout.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', enum: ['selection', 'page', 'project'], description: 'Scope of snapshot' }
      }
    }
  },
  {
    name: 'create_node',
    description: 'Creates a new vector shape, text, chart, frame, or wireframe component on the active page.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'NodeType (e.g. button, card, navbar, frame, text, rectangle, ellipse, table)' },
        x: { type: 'number', description: 'X coordinate' },
        y: { type: 'number', description: 'Y coordinate' },
        customProps: { type: 'object', description: 'Custom properties (label, width, height, fill, stroke, etc.)' }
      },
      required: ['type']
    }
  },
  {
    name: 'create_screen',
    description: 'Creates a full artboard frame (Desktop 1440x1024, Mobile 375x812, or Tablet 768x1024) with preset layout sections.',
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: ['desktop', 'mobile', 'tablet'], description: 'Screen size preset' },
        name: { type: 'string', description: 'Name of the screen frame' },
        x: { type: 'number', description: 'X position on canvas' },
        y: { type: 'number', description: 'Y position on canvas' }
      }
    }
  },
  {
    name: 'create_section',
    description: 'Generates and places a wireframe section (hero, pricing, features, auth_form, profile_header, newsletter).',
    inputSchema: {
      type: 'object',
      properties: {
        sectionType: { type: 'string', enum: ['hero', 'pricing', 'features', 'auth', 'profile', 'newsletter'] },
        x: { type: 'number', description: 'X coordinate' },
        y: { type: 'number', description: 'Y coordinate' }
      },
      required: ['sectionType']
    }
  },
  {
    name: 'modify_node',
    description: 'Updates properties (geometry, styling, text, fills, constraints, cornerRadius) on a specific node.',
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
    description: 'Configures auto-layout flexbox container rules on a frame node.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Frame node ID' },
        direction: { type: 'string', enum: ['horizontal', 'vertical'] },
        gap: { type: 'number', description: 'Spacing gap between children (px)' },
        paddingX: { type: 'number', description: 'Horizontal padding (px)' },
        paddingY: { type: 'number', description: 'Vertical padding (px)' },
        alignItems: { type: 'string', enum: ['start', 'center', 'end', 'stretch'] }
      },
      required: ['nodeId', 'direction', 'gap']
    }
  },
  {
    name: 'apply_design_system',
    description: 'Applies design tokens (primary color, background, typography, radii) across a target frame or page.',
    inputSchema: {
      type: 'object',
      properties: {
        primaryColor: { type: 'string', description: 'Hex primary color e.g. #4F46E5' },
        backgroundColor: { type: 'string', description: 'Hex canvas/page background' },
        fontFamily: { type: 'string', description: 'Font family' },
        cornerRadius: { type: 'number', description: 'Default corner radius' }
      }
    }
  },
  {
    name: 'inspect_design',
    description: 'Runs the design linter on the active page, returning a health score and list of spacing/token warnings.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'export_code',
    description: 'Exports a selected node or frame to React + Tailwind, Next.js, or CSS stylesheet.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Target node ID to export' },
        format: { type: 'string', enum: ['react_tailwind', 'nextjs', 'css'] }
      },
      required: ['nodeId']
    }
  },
  {
    name: 'export_project',
    description: 'Exports the full project document as a structured .chigma.json object.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

/**
 * Handles MCP tool execution against a ChigmaDocument state with structured response & error codes.
 */
export function executeMcpTool(
  toolName: string,
  args: Record<string, any>,
  document: ChigmaDocument,
  activePageId?: string
): McpToolResult {
  const activePage = document.pages.find((p) => p.id === activePageId) || document.pages[0];

  if (!activePage) {
    return {
      success: false,
      errorCode: McpErrorCode.PROJECT_NOT_FOUND,
      error: 'Active page not found in document'
    };
  }

  switch (toolName) {
    case 'get_project':
      return {
        success: true,
        summary: `Retrieved project "${document.name}" with ${document.pages.length} pages.`,
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
        summary: `Retrieved page "${page.name}" with ${page.children.length} elements.`,
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
      if (!found) {
        return {
          success: false,
          errorCode: McpErrorCode.INVALID_NODE,
          error: `Node "${args.nodeId}" not found in any page.`
        };
      }
      return {
        success: true,
        summary: `Retrieved node ${found.name} (${found.type})`,
        data: found
      };
    }

    case 'get_selection': {
      const selectedIds = useEditorStore.getState().selectedIds;
      const selectedNodes = activePage.children.filter((c) => selectedIds.includes(c.id));
      return {
        success: true,
        summary: `Found ${selectedNodes.length} selected node(s).`,
        data: selectedNodes
      };
    }

    case 'get_design_snapshot': {
      const snapshot = {
        projectId: document.id,
        projectName: document.name,
        activePage: {
          id: activePage.id,
          name: activePage.name,
          elementsCount: activePage.children.length,
          elements: activePage.children.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            x: c.x,
            y: c.y,
            width: c.width,
            height: c.height,
            fill: c.fill,
            stroke: c.stroke
          }))
        },
        designTokens: (document.variableCollections || []).map((col) => ({
          collection: col.name,
          variables: col.variables.map((v) => ({ name: v.name, type: v.type, valuesByMode: v.valuesByMode }))
        }))
      };
      return {
        success: true,
        summary: `Generated semantic design snapshot for page "${activePage.name}".`,
        data: snapshot
      };
    }

    case 'create_node': {
      const x = args.x ?? 100;
      const y = args.y ?? 100;
      const newNode = createDefaultNode(args.type, x, y, args.customProps || {});
      activePage.children.push(newNode);
      return {
        success: true,
        summary: `Created ${newNode.type} node "${newNode.name}" at (${x}, ${y}).`,
        changes: [{ type: 'created', nodeId: newNode.id, details: `Created ${newNode.type}` }],
        data: newNode
      };
    }

    case 'create_screen': {
      const preset = args.preset || 'desktop';
      let w = 1440;
      let h = 1024;
      if (preset === 'mobile') { w = 375; h = 812; }
      else if (preset === 'tablet') { w = 768; h = 1024; }

      const x = args.x ?? 50;
      const y = args.y ?? 50;
      const screenFrame = createDefaultNode('frame', x, y, {
        name: args.name || `${preset.toUpperCase()} Screen`,
        width: w,
        height: h,
        fill: '#FFFFFF',
        stroke: '#E5E7EB',
        strokeWidth: 1,
        cornerRadius: 12
      });
      activePage.children.push(screenFrame);

      return {
        success: true,
        summary: `Created ${preset} screen frame (${w}x${h}) at (${x}, ${y}).`,
        changes: [{ type: 'created', nodeId: screenFrame.id, details: `Created ${preset} screen frame` }],
        data: screenFrame
      };
    }

    case 'create_section': {
      const st = args.sectionType;
      const x = args.x ?? 100;
      const y = args.y ?? 100;

      let createdNode: ChigmaNode;
      if (st === 'hero') {
        createdNode = createDefaultNode('card', x, y, {
          name: 'Hero Section',
          width: 800,
          height: 360,
          fill: '#F8FAFC',
          stroke: '#E2E8F0',
          title: 'Build Products Faster with Chigma',
          description: 'The local-first vector design & wireframing environment designed for engineers.'
        });
      } else if (st === 'pricing') {
        createdNode = createDefaultNode('card', x, y, {
          name: 'Pricing 3-Tier Grid',
          width: 840,
          height: 380,
          fill: '#FFFFFF',
          stroke: '#E5E7EB',
          title: 'Simple, Transparent Pricing'
        });
      } else {
        createdNode = createDefaultNode('card', x, y, {
          name: `${st.charAt(0).toUpperCase() + st.slice(1)} Section`,
          width: 600,
          height: 280,
          fill: '#FFFFFF',
          stroke: '#E5E7EB'
        });
      }

      activePage.children.push(createdNode);
      return {
        success: true,
        summary: `Created ${st} section at (${x}, ${y}).`,
        changes: [{ type: 'created', nodeId: createdNode.id, details: `Created section ${st}` }],
        data: createdNode
      };
    }

    case 'modify_node': {
      let found = false;
      let targetNode: ChigmaNode | null = null;
      document.pages.forEach((p) => {
        const idx = p.children.findIndex((c) => c.id === args.nodeId);
        if (idx !== -1) {
          p.children[idx] = { ...p.children[idx], ...args.updates };
          targetNode = p.children[idx];
          found = true;
        }
      });
      if (!found) {
        return {
          success: false,
          errorCode: McpErrorCode.INVALID_NODE,
          error: `Node "${args.nodeId}" not found for modification.`
        };
      }
      return {
        success: true,
        summary: `Updated properties on node "${args.nodeId}".`,
        changes: [{ type: 'modified', nodeId: args.nodeId, details: 'Properties updated' }],
        data: targetNode
      };
    }

    case 'apply_auto_layout': {
      const node = activePage.children.find((n) => n.id === args.nodeId);
      if (!node) {
        return {
          success: false,
          errorCode: McpErrorCode.INVALID_NODE,
          error: `Node "${args.nodeId}" not found for auto-layout.`
        };
      }
      (node as any).autoLayout = {
        enabled: true,
        direction: args.direction,
        gap: args.gap,
        paddingX: args.paddingX ?? 16,
        paddingY: args.paddingY ?? 16,
        alignItems: args.alignItems || 'start',
        justifyContent: 'start'
      };
      return {
        success: true,
        summary: `Applied auto-layout (${args.direction}, gap ${args.gap}px) to node "${node.name}".`,
        changes: [{ type: 'modified', nodeId: node.id, details: 'Auto-layout configured' }],
        data: node
      };
    }

    case 'apply_design_system': {
      const primary = args.primaryColor || '#4F46E5';
      const bg = args.backgroundColor;
      let count = 0;

      if (bg) {
        (activePage as any).backgroundColor = bg;
      }

      activePage.children.forEach((c) => {
        if (c.type === 'button') {
          c.fill = primary;
          count++;
        }
        if (args.cornerRadius !== undefined && 'cornerRadius' in c) {
          (c as any).cornerRadius = args.cornerRadius;
          count++;
        }
      });

      return {
        success: true,
        summary: `Applied design system across ${count} element properties on active page.`,
        changes: [{ type: 'styled', details: `Applied primary color ${primary}` }],
        data: { updatedElementsCount: count }
      };
    }

    case 'inspect_design': {
      const report = runDesignLinter(document, activePage);
      return {
        success: true,
        summary: `Design health score: ${report.score}/100 with ${report.issues.length} issues.`,
        data: report
      };
    }

    case 'export_code': {
      let node: ChigmaNode | undefined;
      document.pages.forEach((p) => {
        const n = p.children.find((c) => c.id === args.nodeId);
        if (n) node = n;
      });
      if (!node) {
        return {
          success: false,
          errorCode: McpErrorCode.INVALID_NODE,
          error: `Node "${args.nodeId}" not found for code export.`
        };
      }

      const format = args.format || 'react_tailwind';
      let code = '';
      if (format === 'nextjs') code = generateNextJsCode(node);
      else if (format === 'css') code = generateCssCode(node);
      else code = generateReactTailwindCode(node);

      return {
        success: true,
        summary: `Generated ${format} code for node "${node.name}".`,
        data: { format, code }
      };
    }

    case 'export_project': {
      return {
        success: true,
        summary: `Exported full project document "${document.name}".`,
        data: document
      };
    }

    default:
      return {
        success: false,
        errorCode: McpErrorCode.OPERATION_FAILED,
        error: `Unknown MCP tool: ${toolName}`
      };
  }
}
