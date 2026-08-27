import type { ChigmaDocument, Page } from '../../models/document';
import { getContrastRatio } from './accessibilityChecker';

export type LintSeverity = 'error' | 'warning' | 'info';

export interface LintIssue {
  id: string;
  nodeId?: string;
  nodeName?: string;
  category: 'spacing' | 'tokens' | 'accessibility' | 'consistency' | 'responsive';
  severity: LintSeverity;
  title: string;
  message: string;
  suggestedFix?: string;
  actionType?: 'normalize_spacing' | 'link_token' | 'resize_target' | 'fix_contrast';
}

export interface DesignHealthReport {
  score: number; // 0 - 100
  categoryScores: {
    spacing: number;
    tokens: number;
    accessibility: number;
    consistency: number;
  };
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  issues: LintIssue[];
}

/**
 * Runs a comprehensive design quality and lint audit across the active page and document tokens.
 */
export function runDesignLinter(document: ChigmaDocument, page: Page): DesignHealthReport {
  const issues: LintIssue[] = [];
  const nodes = page.children || [];

  if (nodes.length === 0) {
    return {
      score: 100,
      categoryScores: { spacing: 100, tokens: 100, accessibility: 100, consistency: 100 },
      totalIssues: 0,
      errorCount: 0,
      warningCount: 0,
      issues: []
    };
  }

  // 1. Gather all registered token colors
  const tokenColors = new Set<string>();
  (document.variableCollections || []).forEach((col) => {
    col.variables.forEach((v) => {
      if (v.type === 'color') {
        if (typeof v.value === 'string') tokenColors.add(v.value.toLowerCase());
        if (v.valuesByMode) {
          Object.values(v.valuesByMode).forEach((val) => {
            if (typeof val === 'string') tokenColors.add(val.toLowerCase());
          });
        }
      }
    });
  });

  let spacingViolations = 0;
  let tokenViolations = 0;
  let a11yViolations = 0;
  let consistencyViolations = 0;

  nodes.forEach((node) => {
    // A. Check Spacing / Grid alignment (8px grid standard)
    const isOffGridX = Math.round(node.x) % 4 !== 0;
    const isOffGridY = Math.round(node.y) % 4 !== 0;
    if (isOffGridX || isOffGridY) {
      spacingViolations++;
      issues.push({
        id: `lint_space_${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        category: 'spacing',
        severity: 'warning',
        title: 'Off-grid coordinates',
        message: `Coordinates (${Math.round(node.x)}, ${Math.round(node.y)}) are not aligned to the 4px/8px design grid.`,
        suggestedFix: `Snap position to (${Math.round(node.x / 8) * 8}, ${Math.round(node.y / 8) * 8})`,
        actionType: 'normalize_spacing'
      });
    }

    // B. Check Unlinked Magic Colors
    const checkFillColor = (hex?: string) => {
      if (!hex || hex === 'transparent') return;
      const lower = hex.toLowerCase();
      if (!tokenColors.has(lower) && !['#ffffff', '#000000', '#18181b', '#f4f4f5'].includes(lower)) {
        tokenViolations++;
        issues.push({
          id: `lint_token_${node.id}_${Math.random().toString(36).slice(2, 6)}`,
          nodeId: node.id,
          nodeName: node.name,
          category: 'tokens',
          severity: 'info',
          title: 'Unlinked Magic Color',
          message: `Uses color "${hex}" which is not defined in the Design System Variables.`,
          suggestedFix: 'Replace with design token or add to variable collection.',
          actionType: 'link_token'
        });
      }
    };

    if (node.fill) checkFillColor(node.fill);
    if (node.fills) {
      node.fills.forEach((f) => {
        if (f.type === 'solid' && f.color) checkFillColor(f.color);
      });
    }

    // C. Accessibility Checks: Touch Targets
    const interactiveTypes = ['button', 'input', 'dropdown', 'toggle', 'checkbox', 'radio'];
    if (interactiveTypes.includes(node.type)) {
      if (node.width < 44 || node.height < 44) {
        a11yViolations++;
        issues.push({
          id: `lint_a11y_target_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          category: 'accessibility',
          severity: 'warning',
          title: 'Undersized Touch Target',
          message: `Size (${Math.round(node.width)}×${Math.round(node.height)}px) is smaller than recommended WCAG 44×44px touch area.`,
          suggestedFix: 'Increase interactive container dimensions to at least 44×44px.',
          actionType: 'resize_target'
        });
      }
    }

    // D. Accessibility Checks: Contrast
    if (node.type === 'button' || node.type === 'card' || node.type === 'toast') {
      const bg = (node as any).fill || '#FFFFFF';
      const fg = (node as any).textColor || ((node as any).variant === 'primary' ? '#FFFFFF' : '#18181B');
      const ratio = getContrastRatio(fg, bg);
      if (ratio < 4.5) {
        a11yViolations++;
        issues.push({
          id: `lint_a11y_contrast_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          category: 'accessibility',
          severity: 'error',
          title: 'Insufficient Color Contrast',
          message: `Text contrast ratio is ${ratio.toFixed(2)}:1, which is below the WCAG AA minimum requirement of 4.5:1.`,
          suggestedFix: 'Increase foreground/background contrast.',
          actionType: 'fix_contrast'
        });
      }
    }

    // E. Form Elements missing labels
    if (node.type === 'input' || node.type === 'textarea') {
      if (!(node as any).label && !(node as any).placeholder) {
        consistencyViolations++;
        issues.push({
          id: `lint_form_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          category: 'consistency',
          severity: 'warning',
          title: 'Missing Accessible Label',
          message: 'Input field does not have a visible text label or placeholder text for screen readers.',
          suggestedFix: 'Add descriptive label or placeholder.'
        });
      }
    }
  });

  // Calculate category scores
  const nodeWeight = Math.max(1, nodes.length);
  const calcScore = (violations: number) => Math.max(0, Math.round(100 - (violations / nodeWeight) * 50));

  const spacingScore = calcScore(spacingViolations);
  const tokenScore = calcScore(tokenViolations);
  const a11yScore = calcScore(a11yViolations);
  const consistencyScore = calcScore(consistencyViolations);

  const overallScore = Math.round(
    spacingScore * 0.25 + tokenScore * 0.25 + a11yScore * 0.35 + consistencyScore * 0.15
  );

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return {
    score: Math.max(0, Math.min(100, overallScore)),
    categoryScores: {
      spacing: spacingScore,
      tokens: tokenScore,
      accessibility: a11yScore,
      consistency: consistencyScore
    },
    totalIssues: issues.length,
    errorCount,
    warningCount,
    issues
  };
}
