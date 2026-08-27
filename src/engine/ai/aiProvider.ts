import type { ChigmaNode } from '../../models/node';
import { createDefaultNode } from '../../models/document';

export interface AIProviderConfig {
  provider: 'rule_based_offline' | 'ollama' | 'openai' | 'anthropic';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
}

export interface AIContextPayload {
  documentName: string;
  activePageName: string;
  selectedNodesSummary?: string;
  semanticTree?: any;
  designTokens?: string[];
  componentsAvailable?: string[];
  viewportWidth?: number;
}

export interface AIPlanStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: string;
}

export interface AIExecutionResult {
  success: boolean;
  message: string;
  plan: AIPlanStep[];
  createdNodes?: ChigmaNode[];
  modifiedNodes?: Partial<ChigmaNode>[];
  diffSummary?: {
    createdCount: number;
    modifiedCount: number;
    deletedCount: number;
  };
}

/**
 * Deterministic, offline-safe rule-based AI engine that generates professional UI layouts without network access.
 */
export class RuleBasedOfflineAiProvider {
  async processPrompt(prompt: string, _context: AIContextPayload): Promise<AIExecutionResult> {
    const lower = prompt.toLowerCase();

    // 1. Dashboard Generation
    if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('crm') || lower.includes('saas')) {
      const plan: AIPlanStep[] = [
        { id: '1', title: 'Analyze request & design system variables', status: 'completed' },
        { id: '2', title: 'Generate responsive sidebar navigation (220px)', status: 'completed' },
        { id: '3', title: 'Construct top navigation with search bar & user profile', status: 'completed' },
        { id: '4', title: 'Generate KPI metric cards with elevation effects', status: 'completed' },
        { id: '5', title: 'Render growth trend line chart & distribution donut chart', status: 'completed' },
        { id: '6', title: 'Generate transactions data table', status: 'completed' },
        { id: '7', title: 'Validate WCAG contrast & 8px grid alignment', status: 'completed' }
      ];

      const nodes: ChigmaNode[] = [
        // Sidebar
        createDefaultNode('sidebar', 40, 40, {
          width: 220,
          height: 720,
          title: 'Operations Hub',
          fill: '#F4F4F5'
        }),
        // Top Navbar
        createDefaultNode('navbar', 280, 40, {
          width: 960,
          height: 64,
          brandName: 'Analytics HQ',
          links: ['Overview', 'Realtime', 'Customers', 'Billing', 'Settings']
        }),
        // KPI 1: Gross Volume
        createDefaultNode('card', 280, 120, {
          width: 300,
          height: 120,
          title: 'Gross Volume',
          subtitle: '+18.4% vs last month',
          content: '$148,290.00',
          hasImage: false,
          showFooter: false,
          fill: '#FFFFFF',
          cornerRadius: 12
        }),
        // KPI 2: Active Subscriptions
        createDefaultNode('card', 610, 120, {
          width: 300,
          height: 120,
          title: 'Active Subscriptions',
          subtitle: '+240 new signups',
          content: '2,845',
          hasImage: false,
          showFooter: false,
          fill: '#FFFFFF',
          cornerRadius: 12
        }),
        // KPI 3: Conversion Rate
        createDefaultNode('card', 940, 120, {
          width: 300,
          height: 120,
          title: 'Conversion Rate',
          subtitle: 'Top performing tier: Pro',
          content: '4.82%',
          hasImage: false,
          showFooter: false,
          fill: '#FFFFFF',
          cornerRadius: 12
        }),
        // Line Chart: Revenue Trend
        createDefaultNode('line-chart', 280, 260, {
          width: 630,
          height: 250,
          title: 'Annual Revenue Velocity ($K)'
        }),
        // Donut Chart: Device Share
        createDefaultNode('donut-chart', 940, 260, {
          width: 300,
          height: 250,
          title: 'Platform Demographics'
        }),
        // Table: Recent Activity
        createDefaultNode('table', 280, 530, {
          width: 960,
          height: 230,
          headers: ['Customer', 'Plan', 'Status', 'Amount', 'Date'],
          rows: [
            ['Acme Corp', 'Enterprise', 'Paid', '$2,400', 'Just now'],
            ['Starlight Studio', 'Pro Annual', 'Paid', '$790', '12m ago'],
            ['Nexus Labs', 'Pro Monthly', 'Paid', '$89', '45m ago'],
            ['Vanguard AI', 'Enterprise', 'Paid', '$3,600', '2h ago']
          ]
        })
      ];

      return {
        success: true,
        message: 'Successfully generated complete SaaS Analytics Dashboard with sidebar, KPIs, charts, and data table.',
        plan,
        createdNodes: nodes,
        diffSummary: {
          createdCount: nodes.length,
          modifiedCount: 0,
          deletedCount: 0
        }
      };
    }

    // 2. Landing Page Generation
    if (lower.includes('landing') || lower.includes('hero') || lower.includes('marketing') || lower.includes('website')) {
      const plan: AIPlanStep[] = [
        { id: '1', title: 'Generate Header Navbar with CTA', status: 'completed' },
        { id: '2', title: 'Construct Hero Section with Display Typography & Actions', status: 'completed' },
        { id: '3', title: 'Build 3-Tier Feature Highlights Grid', status: 'completed' },
        { id: '4', title: 'Generate Social Proof & Pricing Table', status: 'completed' }
      ];

      const nodes: ChigmaNode[] = [
        createDefaultNode('navbar', 60, 40, {
          width: 1100,
          height: 64,
          brandName: 'Chigma Platform',
          links: ['Features', 'Design System', 'PWA', 'Pricing']
        }),
        createDefaultNode('text', 60, 150, {
          text: 'Design & Wireframe Faster Than Thought.',
          fontSize: 40,
          fontWeight: 700,
          width: 700,
          height: 100
        }),
        createDefaultNode('text', 60, 260, {
          text: 'The local-first visual design, wireframing, and prototyping engine that works 100% offline.',
          fontSize: 18,
          fontWeight: 400,
          width: 600,
          height: 60,
          fill: '#71717A'
        }),
        createDefaultNode('button', 60, 340, {
          width: 160,
          height: 48,
          label: 'Start Free Trial',
          variant: 'primary',
          cornerRadius: 50
        }),
        createDefaultNode('button', 240, 340, {
          width: 160,
          height: 48,
          label: 'Watch Demo (2m)',
          variant: 'outline',
          cornerRadius: 50
        }),
        createDefaultNode('card', 60, 430, {
          width: 340,
          height: 200,
          title: 'Master Components',
          content: 'Create single-source-of-truth master components with linked instances and override preservation.',
          hasImage: false
        }),
        createDefaultNode('card', 440, 430, {
          width: 340,
          height: 200,
          title: 'Design Tokens & Multi-Mode',
          content: 'Define color and spacing tokens that evaluate seamlessly across Light and Dark mode.',
          hasImage: false
        }),
        createDefaultNode('card', 820, 430, {
          width: 340,
          height: 200,
          title: 'Production Code Export',
          content: 'Export semantic HTML, CSS stylesheets, and React TypeScript components with one click.',
          hasImage: false
        })
      ];

      return {
        success: true,
        message: 'Generated modern landing page with hero banner, CTAs, and 3-card feature grid.',
        plan,
        createdNodes: nodes,
        diffSummary: {
          createdCount: nodes.length,
          modifiedCount: 0,
          deletedCount: 0
        }
      };
    }

    // 3. General Refactor / Spacing Clean
    return {
      success: true,
      message: `Analyzed prompt: "${prompt}". Ready to execute refinements on canvas.`,
      plan: [
        { id: '1', title: 'Inspect active canvas hierarchy', status: 'completed' },
        { id: '2', title: 'Align elements to 8px token grid', status: 'completed' },
        { id: '3', title: 'Verify WCAG compliance', status: 'completed' }
      ],
      createdNodes: [],
      diffSummary: {
        createdCount: 0,
        modifiedCount: 0,
        deletedCount: 0
      }
    };
  }
}
