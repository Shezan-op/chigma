import { describe, it, expect } from 'vitest';
import { executeMcpTool } from '../mcp/mcpTools';
import { createDefaultDocument } from '../models/document';

describe('Leady Custom SaaS Agency — Live MCP Automated Design Workflow', () => {
  it('executes full end-to-end MCP commands to design a premium dark-theme agency landing page', () => {
    // 1. Initialize Document
    const doc = createDefaultDocument('Leady - Custom SaaS Agency');
    const page = doc.pages[0];
    page.name = 'Leady Agency Landing Page';

    // Step 1: Query project
    const projRes = executeMcpTool('get_project', {}, doc);
    expect(projRes.success).toBe(true);
    expect(projRes.data.name).toBe('Leady - Custom SaaS Agency');

    // Step 2: Apply Premium Dark Theme Design System
    const sysRes = executeMcpTool(
      'apply_design_system',
      {
        primaryColor: '#6366F1', // Indigo Accent
        backgroundColor: '#09090B', // Dark Obsidian Surface
        cornerRadius: 12
      },
      doc,
      page.id
    );
    expect(sysRes.success).toBe(true);

    // Step 3: Create Screen Frame (1440x2600 Desktop Canvas)
    const screenRes = executeMcpTool(
      'create_screen',
      {
        preset: 'desktop',
        name: 'Leady Desktop Canvas',
        x: 0,
        y: 0
      },
      doc,
      page.id
    );
    expect(screenRes.success).toBe(true);
    expect(screenRes.data.width).toBe(1440);

    // Step 4: Create Top Navigation Bar
    const navRes = executeMcpTool(
      'create_node',
      {
        type: 'navbar',
        x: 80,
        y: 24,
        customProps: {
          width: 1280,
          height: 64,
          name: 'Top Navigation Bar',
          brand: '⚡ LEADY AGENCY',
          links: ['Services', 'Case Studies', 'Process', 'Pricing', 'About'],
          fill: '#18181B',
          stroke: '#27272A',
          cornerRadius: 16
        }
      },
      doc,
      page.id
    );
    expect(navRes.success).toBe(true);

    // Step 5: Create Hero Section Elements
    // Pill Badge
    const badgeRes = executeMcpTool(
      'create_node',
      {
        type: 'badge',
        x: 520,
        y: 130,
        customProps: {
          width: 400,
          height: 36,
          name: 'Status Pill Badge',
          label: '🚀 ACCEPTING 2 CLIENTS FOR Q3 — BUILD IN 6 WEEKS',
          fill: '#1E1B4B',
          stroke: '#4338CA',
          textColor: '#A5B4FC',
          cornerRadius: 999
        }
      },
      doc,
      page.id
    );
    expect(badgeRes.success).toBe(true);

    // Main Headline Text
    const headRes = executeMcpTool(
      'create_node',
      {
        type: 'text',
        x: 220,
        y: 190,
        customProps: {
          width: 1000,
          height: 110,
          name: 'Hero Main Headline',
          text: 'We Engineer Custom SaaS Products That Scale To Millions in ARR',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#FAFAFA',
          textAlign: 'center'
        }
      },
      doc,
      page.id
    );
    expect(headRes.success).toBe(true);

    // Primary & Secondary CTA Buttons
    const cta1 = executeMcpTool(
      'create_node',
      {
        type: 'button',
        x: 480,
        y: 420,
        customProps: {
          width: 220,
          height: 52,
          name: 'Primary CTA Button',
          label: 'Book 30-Min Strategy Call →',
          fill: '#6366F1',
          textColor: '#FFFFFF',
          cornerRadius: 12
        }
      },
      doc,
      page.id
    );
    expect(cta1.success).toBe(true);

    const cta2 = executeMcpTool(
      'create_node',
      {
        type: 'button',
        x: 720,
        y: 420,
        customProps: {
          width: 220,
          height: 52,
          name: 'Secondary CTA Button',
          label: 'Explore Our Work ↗',
          fill: '#27272A',
          stroke: '#3F3F46',
          textColor: '#FAFAFA',
          cornerRadius: 12
        }
      },
      doc,
      page.id
    );
    expect(cta2.success).toBe(true);

    // Step 6: Create 3 Social Proof Metric Cards
    const metrics = [
      { x: 160, title: '18+ Custom SaaS Shipped', content: 'Across FinTech, AI, Logistics, & DevTools' },
      { x: 550, title: '$34.2M Total Client ARR', content: 'Built on rock-solid serverless & PostgreSQL' },
      { x: 940, title: '6 Weeks Avg Delivery', content: 'Zero bloat. Rapid sprint to live production' }
    ];

    metrics.forEach((m, idx) => {
      const cardRes = executeMcpTool(
        'create_node',
        {
          type: 'card',
          x: m.x,
          y: 530,
          customProps: {
            width: 340,
            height: 110,
            name: `Metric Card ${idx + 1}`,
            title: m.title,
            content: m.content,
            fill: '#18181B',
            stroke: '#27272A',
            cornerRadius: 16
          }
        },
        doc,
        page.id
      );
      expect(cardRes.success).toBe(true);
    });

    // Step 7: Create 3 Services Bento Grid Cards
    const services = [
      { x: 160, title: '01. Full-Stack Web Architecture', desc: 'Next.js 15, TypeScript, Tailwind, Node microservices, PostgreSQL.' },
      { x: 550, title: '02. AI-Native & MCP Workflows', desc: 'Autonomous coding agents, tool-calling pipelines, pgvector, Ollama.' },
      { x: 940, title: '03. Product Design & Prototyping', desc: 'Polished vector UI, state prototypes, WCAG accessibility, design tokens.' }
    ];

    services.forEach((s, idx) => {
      const srvRes = executeMcpTool(
        'create_node',
        {
          type: 'card',
          x: s.x,
          y: 690,
          customProps: {
            width: 340,
            height: 320,
            name: `Service Card ${idx + 1}`,
            title: s.title,
            content: s.desc,
            fill: idx === 1 ? '#1E1B4B' : '#18181B',
            stroke: idx === 1 ? '#6366F1' : '#3F3F46',
            cornerRadius: 16
          }
        },
        doc,
        page.id
      );
      expect(srvRes.success).toBe(true);
    });

    // Step 8: Create Live Client MRR Growth Trend Chart
    const chartRes = executeMcpTool(
      'create_node',
      {
        type: 'line-chart',
        x: 160,
        y: 1060,
        customProps: {
          width: 1120,
          height: 360,
          name: 'Client MRR Growth Trend (Line Chart)',
          fill: '#18181B',
          stroke: '#27272A',
          cornerRadius: 16
        }
      },
      doc,
      page.id
    );
    expect(chartRes.success).toBe(true);

    // Step 9: Insert Prebuilt Pricing 3-Tier Grid
    const pricingRes = executeMcpTool(
      'create_section',
      {
        sectionType: 'pricing',
        x: 160,
        y: 1480
      },
      doc,
      page.id
    );
    expect(pricingRes.success).toBe(true);

    // Step 10: Run Automated Design Quality & Health Audit
    const auditRes = executeMcpTool('inspect_design', {}, doc, page.id);
    expect(auditRes.success).toBe(true);
    expect(auditRes.data.score).toBeGreaterThan(0);

    // Step 11: Export Top Navbar and Hero Components to React + Tailwind
    const exportRes = executeMcpTool(
      'export_code',
      {
        nodeId: navRes.data.id,
        format: 'react_tailwind'
      },
      doc,
      page.id
    );
    expect(exportRes.success).toBe(true);
    expect(exportRes.data.code).toContain('export const TopNavigationBar');

    // Total nodes verify
    expect(page.children.length).toBeGreaterThan(12);
  });
});
