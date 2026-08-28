import { describe, it, expect } from 'vitest';
import type { ChigmaDocument } from '../models/document';
import {
  resolveVariableValue,
  resolveColor,
  resolveSpacing
} from '../engine/variables/variableResolver';

describe('Design Variable Aliases & Modes Engine', () => {
  const sampleDoc: ChigmaDocument = {
    id: 'doc_1',
    name: 'Tokens Test',
    version: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [],
    activeModeId: 'light',
    variableCollections: [
      {
        id: 'col_primitives',
        name: 'Primitives',
        defaultModeId: 'light',
        modes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }],
        variables: [
          {
            id: 'var_blue_600',
            name: 'blue.600',
            type: 'color',
            value: '#2563EB',
            valuesByMode: { light: '#2563EB', dark: '#3B82F6' }
          },
          {
            id: 'var_spacing_8',
            name: 'spacing.8',
            type: 'number',
            value: 8
          }
        ]
      },
      {
        id: 'col_semantics',
        name: 'Semantic Tokens',
        defaultModeId: 'light',
        modes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }],
        variables: [
          {
            id: 'var_color_primary',
            name: 'color.primary',
            type: 'color',
            value: 'var_blue_600' // Alias referencing var_blue_600
          },
          {
            id: 'var_btn_padding',
            name: 'button.padding',
            type: 'number',
            value: 'var_spacing_8'
          },
          {
            id: 'var_circular_a',
            name: 'circular.a',
            type: 'color',
            value: 'var_circular_b'
          },
          {
            id: 'var_circular_b',
            name: 'circular.b',
            type: 'color',
            value: 'var_circular_a'
          }
        ]
      }
    ]
  };

  it('resolves direct variable values by active mode', () => {
    const valLight = resolveVariableValue(sampleDoc, 'var_blue_600', 'light');
    expect(valLight).toBe('#2563EB');

    const valDark = resolveVariableValue(sampleDoc, 'var_blue_600', 'dark');
    expect(valDark).toBe('#3B82F6');
  });

  it('resolves multi-hop alias references (color.primary -> blue.600)', () => {
    const resolvedLight = resolveColor(sampleDoc, 'var_color_primary', 'light');
    expect(resolvedLight).toBe('#2563EB');

    const resolvedDark = resolveColor(sampleDoc, 'var_color_primary', 'dark');
    expect(resolvedDark).toBe('#3B82F6');
  });

  it('resolves spacing aliases (button.padding -> spacing.8)', () => {
    const spacing = resolveSpacing(sampleDoc, 'var_btn_padding');
    expect(spacing).toBe(8);
  });

  it('safely handles circular alias chains without hanging', () => {
    const result = resolveVariableValue(sampleDoc, 'var_circular_a');
    expect(result).toBeUndefined();
  });
});
