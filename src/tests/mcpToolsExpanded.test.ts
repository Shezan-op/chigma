import { describe, it, expect } from 'vitest';
import type { ChigmaDocument } from '../models/document';
import { executeMcpTool, McpErrorCode } from '../mcp/mcpTools';

describe('Expanded MCP Tool Execution Engine', () => {
  const doc: ChigmaDocument = {
    id: 'doc_mcp_test',
    name: 'MCP Test Workspace',
    version: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: 'page_main',
        name: 'Main Canvas',
        children: [
          {
            id: 'node_btn_1',
            name: 'Primary CTA',
            type: 'button',
            x: 50,
            y: 50,
            width: 140,
            height: 44,
            fill: '#000000'
          } as any
        ]
      }
    ],
    variableCollections: []
  };

  it('executes get_project tool correctly', () => {
    const res = executeMcpTool('get_project', {}, doc);
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('MCP Test Workspace');
    expect(res.data.pages.length).toBe(1);
  });

  it('executes create_screen tool to add full responsive artboard', () => {
    const res = executeMcpTool('create_screen', { preset: 'mobile', name: 'Auth Screen' }, doc, 'page_main');
    expect(res.success).toBe(true);
    expect(res.data.width).toBe(375);
    expect(res.data.height).toBe(812);
    expect(doc.pages[0].children.length).toBe(2);
  });

  it('executes create_section tool for hero layouts', () => {
    const res = executeMcpTool('create_section', { sectionType: 'hero', x: 100, y: 100 }, doc, 'page_main');
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Hero Section');
  });

  it('returns structured error code for non-existent node modification', () => {
    const res = executeMcpTool('modify_node', { nodeId: 'node_ghost', updates: { x: 200 } }, doc, 'page_main');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe(McpErrorCode.INVALID_NODE);
  });

  it('executes apply_design_system tool', () => {
    const res = executeMcpTool('apply_design_system', { primaryColor: '#4F46E5', cornerRadius: 8 }, doc, 'page_main');
    expect(res.success).toBe(true);
    expect(res.data.updatedElementsCount).toBeGreaterThan(0);
  });
});
