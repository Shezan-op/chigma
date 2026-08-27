export interface McpPromptDefinition {
  name: string;
  description: string;
  arguments?: { name: string; description: string; required?: boolean }[];
}

export const MCP_PROMPTS: McpPromptDefinition[] = [
  {
    name: 'design-review',
    description: 'Instructs the AI agent to review the current active page for visual hierarchy, spacing, and WCAG contrast.',
    arguments: []
  },
  {
    name: 'create-saas-dashboard',
    description: 'Generates a full-featured SaaS analytics dashboard with responsive sidebar, KPI cards, trend line chart, and data table.',
    arguments: [
      { name: 'theme', description: 'Light or Dark mode focus', required: false }
    ]
  },
  {
    name: 'make-responsive',
    description: 'Applies responsive constraints (left_right, scale) to containers and children for mobile and tablet adaptation.',
    arguments: []
  }
];
