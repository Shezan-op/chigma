# Skill: Make Responsive

## Description
Applies responsive constraints (horizontal and vertical anchors) to child nodes within frame containers to ensure graceful scaling across Mobile, Tablet, Laptop, and Desktop viewports.

## Context Needed
- `frameId` or `selection`: Target container frame.

## Execution Rules
1. Inspect child element horizontal coordinates relative to container width.
2. If child spans full width minus padding, assign `horizontal: 'left_right'`.
3. If child is aligned left, assign `horizontal: 'left'`.
4. If child is centered, assign `horizontal: 'center'`.
5. If child is aligned right, assign `horizontal: 'right'`.
6. Validate scaling in responsive preview simulation.
