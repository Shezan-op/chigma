import { describe, it, expect } from 'vitest';
import { createInitialDocument, createDefaultNode } from '../models/document';
import { runDesignLinter } from '../engine/quality/designLinter';
import { ChigmaMcpServer } from '../mcp/mcpServer';
import { executeMcpTool } from '../mcp/mcpTools';
import { generateReactTailwindCode, generateNextJsCode } from '../engine/export/exportMultiFramework';
import { RuleBasedOfflineAiProvider } from '../engine/ai/aiProvider';
import { usePrototypeSessionStore } from '../store/usePrototypeSessionStore';

describe('Phase 2: Design Quality & Linter Engine', () => {
  it('calculates design health score and catches unaligned coordinates', () => {
    const doc = createInitialDocument('Lint Test');
    const page = doc.pages[0];

    // Off-grid element at (13, 27)
    const offGridNode = createDefaultNode('rectangle', 13, 27, { width: 100, height: 100 });
    page.children.push(offGridNode);

    const report = runDesignLinter(doc, page);
    expect(report.totalIssues).toBeGreaterThan(0);
    expect(report.score).toBeLessThan(100);
    expect(report.issues.some((i) => i.category === 'spacing')).toBe(true);
  });

  it('detects undersized touch targets on interactive controls', () => {
    const doc = createInitialDocument('A11y Test');
    const page = doc.pages[0];

    const smallBtn = createDefaultNode('button', 80, 80, { width: 28, height: 24, label: 'Small' });
    page.children.push(smallBtn);

    const report = runDesignLinter(doc, page);
    expect(report.issues.some((i) => i.category === 'accessibility' && i.actionType === 'resize_target')).toBe(true);
  });
});

describe('Phase 2: Model Context Protocol (MCP) Server', () => {
  it('handles JSON-RPC 2.0 initialize and tools/list requests', () => {
    const doc = createInitialDocument('MCP Test');
    const server = new ChigmaMcpServer(doc);

    // 1. Initialize
    const initRes = server.handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize'
    });
    expect(initRes.result?.protocolVersion).toBe('2026-07-28');
    expect(initRes.result?.serverInfo?.name).toBe('chigma-mcp-server');

    // 2. Tools List
    const toolsRes = server.handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    });
    expect(toolsRes.result?.tools?.length).toBeGreaterThan(5);
  });

  it('executes get_project and create_node tools correctly', () => {
    const doc = createInitialDocument('MCP Project');
    const outcome = executeMcpTool('create_node', { type: 'button', x: 200, y: 150 }, doc);
    expect(outcome.success).toBe(true);
    expect(outcome.data?.type).toBe('button');
    expect(doc.pages[0].children.some((n) => n.id === outcome.data.id)).toBe(true);
  });
});

describe('Phase 2: Multi-Framework Code Generator', () => {
  it('generates idiomatic React + Tailwind component code', () => {
    const btn = createDefaultNode('button', 100, 100, { label: 'Submit Order', variant: 'primary' });
    const reactCode = generateReactTailwindCode(btn);

    expect(reactCode).toContain('import React from \'react\';');
    expect(reactCode).toContain('export const Button');
    expect(reactCode).toContain('Submit Order');
  });

  it('generates Next.js App Router compatible client component', () => {
    const card = createDefaultNode('card', 50, 50, { title: 'Analytics Card' });
    const nextCode = generateNextJsCode(card);

    expect(nextCode).toContain("'use client';");
    expect(nextCode).toContain('Analytics Card');
  });
});

describe('Phase 2: Offline AI Engine', () => {
  it('generates full SaaS dashboard layout offline deterministically', async () => {
    const provider = new RuleBasedOfflineAiProvider();
    const result = await provider.processPrompt('Create a SaaS analytics dashboard with metrics and charts', {
      documentName: 'Test',
      activePageName: 'Page 1'
    });

    expect(result.success).toBe(true);
    expect(result.plan.length).toBeGreaterThan(3);
    expect(result.createdNodes && result.createdNodes.length).toBeGreaterThan(5);
    expect(result.createdNodes?.some((n) => n.type === 'sidebar')).toBe(true);
    expect(result.createdNodes?.some((n) => n.type === 'line-chart')).toBe(true);
  });
});

describe('Phase 2: Interactive Prototyping Session Store', () => {
  it('manages isolated session variables and overlay lifecycles', () => {
    usePrototypeSessionStore.getState().initSession('screen_1', { cartCount: 0 });

    expect(usePrototypeSessionStore.getState().activeScreenId).toBe('screen_1');
    expect(usePrototypeSessionStore.getState().variables.cartCount).toBe(0);

    // Step variable
    usePrototypeSessionStore.getState().stepVariableValue('cartCount', 3);
    expect(usePrototypeSessionStore.getState().variables.cartCount).toBe(3);

    // Open & close overlay
    usePrototypeSessionStore.getState().openOverlay('node_btn', { position: 'center', backdrop: true });
    expect(usePrototypeSessionStore.getState().activeOverlays.length).toBe(1);

    usePrototypeSessionStore.getState().closeOverlay();
    expect(usePrototypeSessionStore.getState().activeOverlays.length).toBe(0);
  });
});
