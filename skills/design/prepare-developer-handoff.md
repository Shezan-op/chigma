# Skill: Prepare Developer Handoff

## Description
Normalizes design tokens, generates CSS custom properties, aligns all coordinates to the 8px grid, and exports structured React + Tailwind CSS and Next.js components.

## Context Needed
- `pageId` or `nodeId`: Target export node/page.

## Execution Rules
1. Run design linter to normalize spacing and verify token linkage.
2. Resolve all color fills to `:root` design variables.
3. Generate idiomatic React + Tailwind component code with typed interfaces.
4. Provide 1-click copyable snippet in Dev Mode Inspector.
