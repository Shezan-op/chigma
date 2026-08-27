import type { ChigmaNode, NodeType, IconNode, SvgNode } from './node';

export interface DesignVariable {
  id: string;
  name: string; // e.g. "colors/primary" or "spacing/md"
  type: 'color' | 'number' | 'string' | 'boolean';
  value: any;
  valuesByMode?: Record<string, any>; // e.g. { light: '#000000', dark: '#FFFFFF' }
  description?: string;
}

export interface VariableCollection {
  id: string;
  name: string;
  modes: { id: string; name: string }[];
  defaultModeId: string;
  variables: DesignVariable[];
}

export interface ReusableStyle {
  id: string;
  name: string; // e.g. "Heading / H1", "Card / Elevated Shadow"
  type: 'text' | 'fill' | 'stroke' | 'effect';
  style: Record<string, any>;
}

export interface ComponentMaster {
  id: string;
  name: string;
  description?: string;
  mainNodeId: string;
  properties?: {
    name: string;
    type: 'text' | 'boolean' | 'instance-swap' | 'variant' | 'color';
    defaultValue: any;
  }[];
  variants?: {
    id: string;
    name: string;
    properties: Record<string, string>;
  }[];
}

export interface Page {
  id: string;
  name: string;
  children: ChigmaNode[];
  background?: string;
}

export interface ChigmaDocument {
  id: string;
  name: string;
  version: number;
  schemaVersion?: number;
  createdAt: number;
  updatedAt: number;
  pages: Page[];
  variableCollections?: VariableCollection[];
  activeModeId?: string; // e.g. 'light' | 'dark'
  styles?: ReusableStyle[];
  components?: ComponentMaster[];
  breakpoints?: { id: string; name: string; width: number }[];
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  pageCount: number;
  nodeCount: number;
  previewThumbnail?: string;
}

export function createDefaultPage(name = 'Page 1'): Page {
  return {
    id: `page_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    children: [],
    background: '#FFFFFF'
  };
}

export const DEFAULT_VARIABLE_COLLECTIONS: VariableCollection[] = [
  {
    id: 'col_brand',
    name: 'Brand & Colors',
    modes: [
      { id: 'light', name: 'Light Mode' },
      { id: 'dark', name: 'Dark Mode' }
    ],
    defaultModeId: 'light',
    variables: [
      {
        id: 'var_color_primary',
        name: 'color/primary',
        type: 'color',
        value: '#000000',
        valuesByMode: { light: '#000000', dark: '#FFFFFF' }
      },
      {
        id: 'var_color_surface',
        name: 'color/surface',
        type: 'color',
        value: '#FFFFFF',
        valuesByMode: { light: '#FFFFFF', dark: '#18181B' }
      },
      {
        id: 'var_color_accent',
        name: 'color/accent',
        type: 'color',
        value: '#0066FF',
        valuesByMode: { light: '#0066FF', dark: '#3B82F6' }
      },
      {
        id: 'var_color_block_lime',
        name: 'color/block-lime',
        type: 'color',
        value: '#DCEEB1',
        valuesByMode: { light: '#DCEEB1', dark: '#3A4428' }
      },
      {
        id: 'var_color_block_lilac',
        name: 'color/block-lilac',
        type: 'color',
        value: '#C5B0F4',
        valuesByMode: { light: '#C5B0F4', dark: '#372E54' }
      }
    ]
  },
  {
    id: 'col_spacing',
    name: 'Spacing System',
    modes: [{ id: 'default', name: 'Default' }],
    defaultModeId: 'default',
    variables: [
      { id: 'var_space_xxs', name: 'spacing/xxs', type: 'number', value: 4 },
      { id: 'var_space_xs', name: 'spacing/xs', type: 'number', value: 8 },
      { id: 'var_space_sm', name: 'spacing/sm', type: 'number', value: 12 },
      { id: 'var_space_md', name: 'spacing/md', type: 'number', value: 16 },
      { id: 'var_space_lg', name: 'spacing/lg', type: 'number', value: 24 },
      { id: 'var_space_xl', name: 'spacing/xl', type: 'number', value: 32 },
      { id: 'var_space_xxl', name: 'spacing/xxl', type: 'number', value: 48 }
    ]
  }
];

export const DEFAULT_STYLES: ReusableStyle[] = [
  {
    id: 'style_h1',
    name: 'Typography / Display H1',
    type: 'text',
    style: { fontSize: 32, fontWeight: 700, lineHeight: 1.2 }
  },
  {
    id: 'style_h2',
    name: 'Typography / Headline H2',
    type: 'text',
    style: { fontSize: 24, fontWeight: 600, lineHeight: 1.25 }
  },
  {
    id: 'style_body',
    name: 'Typography / Body Regular',
    type: 'text',
    style: { fontSize: 14, fontWeight: 400, lineHeight: 1.45 }
  },
  {
    id: 'style_shadow_card',
    name: 'Effects / Card Elevation',
    type: 'effect',
    style: {
      effects: [
        { id: 'eff_1', type: 'drop-shadow', visible: true, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.08 }
      ]
    }
  }
];

export function createDefaultDocument(name = 'Untitled Design'): ChigmaDocument {
  const now = Date.now();
  return {
    id: `doc_${now}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    version: 2,
    schemaVersion: 2,
    createdAt: now,
    updatedAt: now,
    pages: [createDefaultPage('Page 1')],
    variableCollections: DEFAULT_VARIABLE_COLLECTIONS,
    activeModeId: 'light',
    styles: DEFAULT_STYLES,
    components: [],
    breakpoints: [
      { id: 'bp_mobile', name: 'Mobile', width: 390 },
      { id: 'bp_tablet', name: 'Tablet', width: 768 },
      { id: 'bp_desktop', name: 'Desktop', width: 1280 }
    ]
  };
}

/**
 * Migration helper to ensure older .chigma.json documents (schemaVersion 1)
 * are cleanly upgraded to schemaVersion 2 without loss of any data.
 */
export function migrateDocument(doc: any): ChigmaDocument {
  if (!doc) return createDefaultDocument();

  const migrated: ChigmaDocument = {
    ...doc,
    schemaVersion: 2,
    pages: (doc.pages || []).map((page: any) => ({
      ...page,
      children: (page.children || []).map((child: any) => {
        // Upgrade legacy flat cornerRadius if needed
        return {
          ...child,
          rotation: child.rotation ?? 0,
          opacity: child.opacity ?? 1,
          visible: child.visible ?? true,
          locked: child.locked ?? false
        };
      })
    })),
    variableCollections: doc.variableCollections || DEFAULT_VARIABLE_COLLECTIONS,
    activeModeId: doc.activeModeId || 'light',
    styles: doc.styles || DEFAULT_STYLES,
    components: doc.components || [],
    breakpoints: doc.breakpoints || [
      { id: 'bp_mobile', name: 'Mobile', width: 390 },
      { id: 'bp_tablet', name: 'Tablet', width: 768 },
      { id: 'bp_desktop', name: 'Desktop', width: 1280 }
    ]
  };

  return migrated;
}

export function createDefaultNode(type: NodeType, x = 100, y = 100, customProps: Record<string, any> = {}): ChigmaNode {
  const id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const base = {
    id,
    x,
    y,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false
  };

  switch (type) {
    case 'icon':
      return {
        ...base,
        type: 'icon',
        name: 'Icon',
        width: 24,
        height: 24,
        iconName: 'home',
        color: '#000000',
        strokeWidth: 2,
        ...customProps
      } as IconNode;

    case 'svg':
      return {
        ...base,
        type: 'svg',
        name: 'SVG Asset',
        width: 120,
        height: 120,
        svgContent: '<circle cx="60" cy="60" r="50" fill="#0066FF"/>',
        ...customProps
      } as SvgNode;

    case 'rectangle':
      return {
        ...base,
        type: 'rectangle',
        name: 'Rectangle',
        width: 160,
        height: 100,
        fill: '#E4E4E7',
        stroke: '#71717A',
        strokeWidth: 1,
        strokeStyle: 'solid',
        cornerRadius: 4,
        ...customProps
      };

    case 'ellipse':
      return {
        ...base,
        type: 'ellipse',
        name: 'Ellipse',
        width: 120,
        height: 120,
        fill: '#E4E4E7',
        stroke: '#71717A',
        strokeWidth: 1,
        strokeStyle: 'solid',
        ...customProps
      };

    case 'line':
      return {
        ...base,
        type: 'line',
        name: 'Line',
        width: 200,
        height: 0,
        stroke: '#27272A',
        strokeWidth: 2,
        strokeStyle: 'solid',
        ...customProps
      };

    case 'arrow':
      return {
        ...base,
        type: 'arrow',
        name: 'Arrow',
        width: 200,
        height: 0,
        stroke: '#27272A',
        strokeWidth: 2,
        strokeStyle: 'solid',
        arrowStart: 'none',
        arrowEnd: 'arrow',
        ...customProps
      };

    case 'polygon':
      return {
        ...base,
        type: 'polygon',
        name: 'Polygon',
        width: 140,
        height: 120,
        sides: 3,
        fill: '#E4E4E7',
        stroke: '#71717A',
        strokeWidth: 1,
        strokeStyle: 'solid',
        ...customProps
      };

    case 'pencil':
      return {
        ...base,
        type: 'pencil',
        name: 'Drawing',
        width: 100,
        height: 100,
        points: [{ x: 0, y: 0 }],
        stroke: '#18181B',
        strokeWidth: 2,
        strokeStyle: 'solid',
        ...customProps
      };

    case 'text':
      return {
        ...base,
        type: 'text',
        name: 'Text',
        text: 'Heading',
        width: 140,
        height: 36,
        fontSize: 20,
        fontWeight: 500,
        fontStyle: 'normal',
        fill: '#18181B',
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        ...customProps
      };

    case 'frame':
      return {
        ...base,
        type: 'frame',
        name: 'Frame',
        width: 375,
        height: 667,
        fill: '#FFFFFF',
        stroke: '#E4E4E7',
        strokeWidth: 1,
        cornerRadius: 8,
        clipContent: true,
        children: [],
        ...customProps
      };

    case 'group':
      return {
        ...base,
        type: 'group',
        name: 'Group',
        width: 200,
        height: 200,
        children: [],
        ...customProps
      };

    case 'image':
      return {
        ...base,
        type: 'image',
        name: 'Image',
        width: 240,
        height: 180,
        src: '',
        objectFit: 'cover',
        cornerRadius: 4,
        ...customProps
      };

    case 'bar-chart':
      return {
        ...base,
        type: 'bar-chart',
        name: 'Bar Chart',
        width: 320,
        height: 200,
        data: [
          { label: 'Jan', value: 45, color: '#3B82F6' },
          { label: 'Feb', value: 78, color: '#60A5FA' },
          { label: 'Mar', value: 52, color: '#93C5FD' },
          { label: 'Apr', value: 90, color: '#2563EB' },
          { label: 'May', value: 65, color: '#3B82F6' }
        ],
        showGrid: true,
        showLabels: true,
        showAxis: true,
        colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB'],
        title: 'Monthly Metrics',
        ...customProps
      };

    case 'line-chart':
      return {
        ...base,
        type: 'line-chart',
        name: 'Line Chart',
        width: 320,
        height: 200,
        data: [
          { label: 'Q1', value: 30 },
          { label: 'Q2', value: 60 },
          { label: 'Q3', value: 45 },
          { label: 'Q4', value: 85 }
        ],
        showGrid: true,
        showLabels: true,
        showAxis: true,
        colors: ['#10B981'],
        title: 'Performance Trend',
        curved: true,
        ...customProps
      };

    case 'pie-chart':
      return {
        ...base,
        type: 'pie-chart',
        name: 'Pie Chart',
        width: 220,
        height: 220,
        data: [
          { label: 'Direct', value: 40, color: '#3B82F6' },
          { label: 'Organic', value: 35, color: '#10B981' },
          { label: 'Referral', value: 25, color: '#F59E0B' }
        ],
        showLabels: true,
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'],
        title: 'Traffic Share',
        ...customProps
      };

    case 'donut-chart':
      return {
        ...base,
        type: 'donut-chart',
        name: 'Donut Chart',
        width: 220,
        height: 220,
        data: [
          { label: 'Desktop', value: 55, color: '#6366F1' },
          { label: 'Mobile', value: 35, color: '#EC4899' },
          { label: 'Tablet', value: 10, color: '#14B8A6' }
        ],
        showLabels: true,
        colors: ['#6366F1', '#EC4899', '#14B8A6'],
        innerRadiusRatio: 0.6,
        title: 'Device Split',
        ...customProps
      };

    case 'button':
      return {
        ...base,
        type: 'button',
        name: 'Button',
        width: 120,
        height: 40,
        label: 'Button',
        variant: 'primary',
        size: 'md',
        cornerRadius: 6,
        fill: '#18181B',
        textColor: '#FFFFFF',
        ...customProps
      };

    case 'input':
      return {
        ...base,
        type: 'input',
        name: 'Input',
        width: 220,
        height: 42,
        label: 'Input Label',
        placeholder: 'Enter text...',
        inputType: 'text',
        cornerRadius: 6,
        ...customProps
      };

    case 'textarea':
      return {
        ...base,
        type: 'textarea',
        name: 'Textarea',
        width: 240,
        height: 90,
        label: 'Message',
        placeholder: 'Enter detailed message...',
        rows: 3,
        cornerRadius: 6,
        ...customProps
      };

    case 'checkbox':
      return {
        ...base,
        type: 'checkbox',
        name: 'Checkbox',
        width: 140,
        height: 24,
        label: 'Remember me',
        checked: true,
        ...customProps
      };

    case 'radio':
      return {
        ...base,
        type: 'radio',
        name: 'Radio Button',
        width: 140,
        height: 24,
        label: 'Option selection',
        checked: true,
        ...customProps
      };

    case 'toggle':
      return {
        ...base,
        type: 'toggle',
        name: 'Toggle',
        width: 120,
        height: 28,
        label: 'Dark mode',
        checked: true,
        ...customProps
      };

    case 'dropdown':
      return {
        ...base,
        type: 'dropdown',
        name: 'Dropdown',
        width: 200,
        height: 40,
        label: 'Select Country',
        placeholder: 'Choose an option',
        options: ['Option 1', 'Option 2', 'Option 3'],
        selectedIndex: 0,
        isOpen: false,
        cornerRadius: 6,
        ...customProps
      };

    case 'navbar':
      return {
        ...base,
        type: 'navbar',
        name: 'Navbar',
        width: 800,
        height: 60,
        brandName: 'Chigma App',
        links: ['Home', 'Features', 'Pricing', 'About'],
        showAvatar: true,
        showSearch: true,
        fill: '#FFFFFF',
        textColor: '#18181B',
        ...customProps
      };

    case 'sidebar':
      return {
        ...base,
        type: 'sidebar',
        name: 'Sidebar',
        width: 220,
        height: 500,
        title: 'Workspace',
        items: [
          { label: 'Dashboard', active: true },
          { label: 'Projects', active: false },
          { label: 'Analytics', active: false },
          { label: 'Settings', active: false }
        ],
        fill: '#F4F4F5',
        ...customProps
      };

    case 'card':
      return {
        ...base,
        type: 'card',
        name: 'Card',
        width: 280,
        height: 180,
        title: 'Project Overview',
        subtitle: 'Updated 2 hours ago',
        content: 'Clean vector-based wireframing components built for fast mockups.',
        hasImage: true,
        showFooter: true,
        footerText: 'Read more →',
        cornerRadius: 8,
        fill: '#FFFFFF',
        stroke: '#E4E4E7',
        strokeWidth: 1,
        ...customProps
      };

    case 'avatar':
      return {
        ...base,
        type: 'avatar',
        name: 'Alex Johnson',
        width: 48,
        height: 48,
        shape: 'circle',
        statusIndicator: 'online',
        fill: '#6366F1',
        ...customProps
      };

    case 'badge':
      return {
        ...base,
        type: 'badge',
        name: 'Badge',
        width: 70,
        height: 24,
        label: 'Active',
        variant: 'success',
        ...customProps
      };

    case 'table':
      return {
        ...base,
        type: 'table',
        name: 'Table',
        width: 420,
        height: 160,
        headers: ['Name', 'Role', 'Status', 'Date'],
        rows: [
          ['Emma Watson', 'Designer', 'Active', 'Aug 24'],
          ['Liam Miller', 'Developer', 'Active', 'Aug 22'],
          ['Sophia Chen', 'Product', 'Pending', 'Aug 19']
        ],
        striped: true,
        bordered: true,
        ...customProps
      };

    case 'tabs':
      return {
        ...base,
        type: 'tabs',
        name: 'Tabs',
        width: 320,
        height: 40,
        tabs: ['Overview', 'Analytics', 'Reports', 'Settings'],
        activeIndex: 0,
        ...customProps
      };

    case 'breadcrumb':
      return {
        ...base,
        type: 'breadcrumb',
        name: 'Breadcrumb',
        width: 260,
        height: 24,
        items: ['Projects', 'Design System', 'Wireframes'],
        separator: '>',
        ...customProps
      };

    case 'progress':
      return {
        ...base,
        type: 'progress',
        name: 'Progress Bar',
        width: 240,
        height: 20,
        value: 68,
        showLabel: true,
        barColor: '#3B82F6',
        ...customProps
      };

    case 'slider':
      return {
        ...base,
        type: 'slider',
        name: 'Slider',
        width: 200,
        height: 32,
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        ...customProps
      };

    case 'pagination':
      return {
        ...base,
        type: 'pagination',
        name: 'Pagination',
        width: 260,
        height: 36,
        currentPage: 2,
        totalPages: 5,
        ...customProps
      };

    case 'modal':
      return {
        ...base,
        type: 'modal',
        name: 'Modal Dialog',
        width: 360,
        height: 200,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this operation? This cannot be undone.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        cornerRadius: 10,
        ...customProps
      };

    case 'toast':
      return {
        ...base,
        type: 'toast',
        name: 'Toast Notification',
        width: 300,
        height: 64,
        title: 'Changes Saved',
        message: 'Your project has been autosaved locally.',
        variant: 'success',
        cornerRadius: 8,
        ...customProps
      };

    default:
      return {
        ...base,
        type: 'rectangle',
        name: 'Node',
        width: 100,
        height: 100,
        fill: '#E4E4E7',
        stroke: '#71717A',
        strokeWidth: 1,
        strokeStyle: 'solid',
        cornerRadius: 0,
        ...customProps
      };
  }
}
