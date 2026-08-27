import type { Page } from '../../models/document';

export interface AccessibilityIssue {
  id: string;
  nodeId: string;
  nodeName: string;
  type: 'contrast' | 'touch-target' | 'missing-label' | 'font-size';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

/**
 * Calculates luminance for a hex color string.
 */
function getLuminance(hex: string): number {
  if (!hex || hex === 'transparent') return 1;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates contrast ratio between two hex colors according to WCAG 2.1.
 */
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lum1 = getLuminance(foregroundHex);
  const lum2 = getLuminance(backgroundHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Audits all elements on a page and returns a list of accessibility findings.
 */
export function auditPageAccessibility(page: Page): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const nodes = page.children || [];

  nodes.forEach((node) => {
    // 1. Check Touch Target Size for interactive nodes (buttons, inputs, toggles, checkboxes)
    if (['button', 'input', 'dropdown', 'checkbox', 'radio', 'toggle'].includes(node.type)) {
      if (node.width < 44 || node.height < 44) {
        issues.push({
          id: `touch_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          type: 'touch-target',
          severity: node.width < 32 || node.height < 32 ? 'critical' : 'warning',
          message: `Interactive touch target is ${node.width}×${node.height}px, below the recommended 44×44px minimum.`,
          suggestion: 'Increase width and height to at least 44px to ensure effortless touch interaction on mobile devices.'
        });
      }
    }

    // 2. Check Text Contrast
    if (node.type === 'text') {
      const textColor = (node as any).fill || '#000000';
      const pageBg = page.background || '#FFFFFF';
      const ratio = getContrastRatio(textColor, pageBg);

      if (ratio < 4.5) {
        issues.push({
          id: `contrast_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          type: 'contrast',
          severity: ratio < 3.0 ? 'critical' : 'warning',
          message: `Contrast ratio is ${ratio.toFixed(1)}:1 against background (WCAG AA requires minimum 4.5:1).`,
          suggestion: 'Darken or increase the saturation of the text color to improve legibility.'
        });
      }

      if ((node as any).fontSize < 12) {
        issues.push({
          id: `font_size_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          type: 'font-size',
          severity: 'warning',
          message: `Font size is ${(node as any).fontSize}px, which may be difficult to read on small screens.`,
          suggestion: 'Increase font size to at least 12px for body and secondary text.'
        });
      }
    }

    // 3. Check Input Labels
    if (node.type === 'input' || node.type === 'textarea') {
      if (!(node as any).label || !(node as any).label.trim()) {
        issues.push({
          id: `label_${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          type: 'missing-label',
          severity: 'warning',
          message: 'Input field is missing a persistent visible label above the placeholder.',
          suggestion: 'Add an explicit label so screen readers and users retain context while typing.'
        });
      }
    }
  });

  return issues;
}
