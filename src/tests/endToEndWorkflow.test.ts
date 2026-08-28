import { describe, it, expect } from 'vitest';
import type { ChigmaDocument } from '../models/document';
import { createDefaultNode } from '../models/document';
import { createComponentMaster, createInstanceFromMaster } from '../engine/components/componentEngine';
import { resolveColor, resolveSpacing } from '../engine/variables/variableResolver';
import { validateAndRepairDocument } from '../persistence/documentValidator';
import { generateReactTailwindCode, generateNextJsCode } from '../engine/export/exportMultiFramework';

describe('Chigma End-to-End Production Workflow', () => {
  it('executes full design-to-code creation, instantiation, token resolution, and export lifecycle', () => {
    // 1. Create Project with Token Collections
    const doc: ChigmaDocument = {
      id: 'doc_e2e_01',
      name: 'SaaS Design System',
      version: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      activeModeId: 'light',
      variableCollections: [
        {
          id: 'col_brand',
          name: 'Brand Tokens',
          defaultModeId: 'light',
          modes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }],
          variables: [
            {
              id: 'var_primary',
              name: 'brand.primary',
              type: 'color',
              value: '#4F46E5',
              valuesByMode: { light: '#4F46E5', dark: '#6366F1' }
            },
            {
              id: 'var_gap_card',
              name: 'card.gap',
              type: 'number',
              value: 16
            }
          ]
        }
      ],
      components: [],
      pages: [
        {
          id: 'page_home',
          name: 'Landing Page',
          children: []
        }
      ]
    };

    // 2. Define Master Button Component
    const baseButton = createDefaultNode('button', 0, 0, {
      name: 'Primary Button',
      width: 140,
      height: 44,
      fill: 'var_primary',
      label: 'Get Started',
      cornerRadius: 8
    });

    const { master, updatedNode: masterButton } = createComponentMaster(baseButton, 'Master Button');
    (doc as any).componentMasters = [master];

    // 3. Instantiate Component Instance with Overrides
    const buttonInstance = createInstanceFromMaster(master, masterButton, 100, 150);
    buttonInstance.overrides = { label: 'Start Free Trial Now' };
    (buttonInstance as any).label = 'Start Free Trial Now';

    expect(buttonInstance.instanceOf).toBe(master.id);
    expect(buttonInstance.overrides.label).toBe('Start Free Trial Now');

    // 4. Create Auto-Layout Parent Frame
    const cardFrame = createDefaultNode('frame', 50, 50, {
      name: 'Hero CTA Card',
      width: 480,
      height: 240,
      fill: '#FFFFFF',
      stroke: '#E5E7EB',
      autoLayout: {
        enabled: true,
        direction: 'vertical',
        gap: resolveSpacing(doc, 'var_gap_card'),
        paddingX: 24,
        paddingY: 24,
        alignItems: 'start',
        justifyContent: 'start'
      },
      children: [buttonInstance]
    });

    doc.pages[0].children.push(cardFrame);

    // 5. Verify Token Value Resolution in Light & Dark mode
    const lightFill = resolveColor(doc, masterButton.fill, 'light');
    expect(lightFill).toBe('#4F46E5');

    const darkFill = resolveColor(doc, masterButton.fill, 'dark');
    expect(darkFill).toBe('#6366F1');

    // 6. Validate Document Integrity
    const { report } = validateAndRepairDocument(doc);
    expect(report.isValid).toBe(true);

    // 7. Verify Multi-Framework Code Export
    const reactCode = generateReactTailwindCode(cardFrame);
    expect(reactCode).toContain('export const HeroCtaCard');
    expect(reactCode).toContain('rounded-xl');

    const nextJsCode = generateNextJsCode(cardFrame);
    expect(nextJsCode).toContain("'use client'");
  });
});
