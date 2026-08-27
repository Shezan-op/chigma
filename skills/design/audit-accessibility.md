# Skill: Audit Accessibility

## Description
Scans all elements on the active page for WCAG 2.1 AA/AAA compliance, minimum touch target sizes (44×44px), text contrast ratios (4.5:1), and semantic input labels.

## Context Needed
- `pageId`: Active target page.

## Execution Rules
1. Inspect all interactive controls (`button`, `input`, `dropdown`, `toggle`).
2. Flag any interactive target with width or height < 44px.
3. Calculate relative luminance and contrast ratio between text foreground and background fills.
4. Flag any text node with contrast ratio < 4.5:1.
5. Return structured report with 1-click remediation actions.
