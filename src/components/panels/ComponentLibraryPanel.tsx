import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { createDefaultNode } from '../../models/document';
import { screenToWorld } from '../../engine/geometry/matrix';
import { createInstanceFromMaster } from '../../engine/components/componentEngine';
import type { NodeType, ChigmaNode } from '../../models/node';
import type { ComponentMaster } from '../../models/document';
import {
  Search,
  Square,
  Circle,
  Type,
  PieChart,
  BarChart,
  CreditCard,
  Sliders,
  CheckSquare,
  Radio,
  ToggleLeft,
  Columns,
  MessageSquare,
  Table as TableIcon,
  Sparkles,
  Layout,
  UserCheck,
  Mail,
  DollarSign
} from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  category: 'Primitives' | 'Charts' | 'Components' | 'Navigation' | 'Sections';
  icon: React.ReactNode;
  isSection?: boolean;
  type?: NodeType;
}

export const ComponentLibraryPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { document, getNodeById, addNode, addNodes } = useDocumentStore();
  const { viewport, setSelectedIds } = useEditorStore();

  const projectComponents = (document.componentMasters || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInsertMasterInstance = (master: ComponentMaster) => {
    const mainNode = getNodeById(master.mainNodeId);
    if (!mainNode) return;
    const centerScreen = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    const worldPoint = screenToWorld(centerScreen, viewport);
    const instance = createInstanceFromMaster(master, mainNode, worldPoint.x - 50, worldPoint.y - 30);
    addNode(instance);
    setSelectedIds([instance.id]);
  };

  const libraryItems: LibraryItem[] = [
    // Pre-built Wireframe Sections (1-Click Insertion)
    { id: 'sec_hero', name: 'Hero Header Section', category: 'Sections', icon: <Sparkles size={16} color="#0066FF" />, isSection: true },
    { id: 'sec_pricing', name: 'Pricing 3-Tier Grid', category: 'Sections', icon: <DollarSign size={16} color="#10B981" />, isSection: true },
    { id: 'sec_features', name: 'Feature 3-Card Grid', category: 'Sections', icon: <Layout size={16} color="#8B5CF6" />, isSection: true },
    { id: 'sec_auth', name: 'Sign In / Auth Form', category: 'Sections', icon: <CreditCard size={16} color="#F59E0B" />, isSection: true },
    { id: 'sec_profile', name: 'User Profile Header', category: 'Sections', icon: <UserCheck size={16} color="#EC4899" />, isSection: true },
    { id: 'sec_newsletter', name: 'Newsletter Subscribe', category: 'Sections', icon: <Mail size={16} color="#3B82F6" />, isSection: true },

    // Primitives
    { id: 'prim_rect', type: 'rectangle', name: 'Rectangle', category: 'Primitives', icon: <Square size={16} /> },
    { id: 'prim_ellipse', type: 'ellipse', name: 'Ellipse', category: 'Primitives', icon: <Circle size={16} /> },
    { id: 'prim_text', type: 'text', name: 'Heading / Label', category: 'Primitives', icon: <Type size={16} /> },

    // Wireframe Components
    { id: 'comp_btn', type: 'button', name: 'Action Button', category: 'Components', icon: <Square size={16} /> },
    { id: 'comp_input', type: 'input', name: 'Text Input', category: 'Components', icon: <Type size={16} /> },
    { id: 'comp_textarea', type: 'textarea', name: 'Textarea Box', category: 'Components', icon: <Type size={16} /> },
    { id: 'comp_chk', type: 'checkbox', name: 'Checkbox', category: 'Components', icon: <CheckSquare size={16} /> },
    { id: 'comp_radio', type: 'radio', name: 'Radio Button', category: 'Components', icon: <Radio size={16} /> },
    { id: 'comp_toggle', type: 'toggle', name: 'Toggle Switch', category: 'Components', icon: <ToggleLeft size={16} /> },
    { id: 'comp_dropdown', type: 'dropdown', name: 'Select Dropdown', category: 'Components', icon: <Columns size={16} /> },
    { id: 'comp_card', type: 'card', name: 'Content Card', category: 'Components', icon: <CreditCard size={16} /> },
    { id: 'comp_avatar', type: 'avatar', name: 'User Avatar', category: 'Components', icon: <Circle size={16} /> },
    { id: 'comp_badge', type: 'badge', name: 'Status Badge', category: 'Components', icon: <Square size={16} /> },
    { id: 'comp_table', type: 'table', name: 'Data Table', category: 'Components', icon: <TableIcon size={16} /> },
    { id: 'comp_progress', type: 'progress', name: 'Progress Bar', category: 'Components', icon: <Sliders size={16} /> },
    { id: 'comp_slider', type: 'slider', name: 'Range Slider', category: 'Components', icon: <Sliders size={16} /> },
    { id: 'comp_modal', type: 'modal', name: 'Modal Dialog', category: 'Components', icon: <Square size={16} /> },
    { id: 'comp_toast', type: 'toast', name: 'Toast Alert', category: 'Components', icon: <MessageSquare size={16} /> },

    // Navigation
    { id: 'nav_navbar', type: 'navbar', name: 'Top Navbar', category: 'Navigation', icon: <Columns size={16} /> },
    { id: 'nav_sidebar', type: 'sidebar', name: 'App Sidebar', category: 'Navigation', icon: <Columns size={16} /> },
    { id: 'nav_tabs', type: 'tabs', name: 'Tab Navigation', category: 'Navigation', icon: <Columns size={16} /> },
    { id: 'nav_breadcrumb', type: 'breadcrumb', name: 'Breadcrumbs', category: 'Navigation', icon: <Columns size={16} /> },
    { id: 'nav_pagination', type: 'pagination', name: 'Pagination Bar', category: 'Navigation', icon: <Columns size={16} /> },

    // Charts
    { id: 'chart_bar', type: 'bar-chart', name: 'Bar Chart', category: 'Charts', icon: <BarChart size={16} /> },
    { id: 'chart_line', type: 'line-chart', name: 'Line Trend', category: 'Charts', icon: <BarChart size={16} /> },
    { id: 'chart_pie', type: 'pie-chart', name: 'Pie Chart', category: 'Charts', icon: <PieChart size={16} /> },
    { id: 'chart_donut', type: 'donut-chart', name: 'Donut Chart', category: 'Charts', icon: <PieChart size={16} /> }
  ];

  const filtered = libraryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsertSection = (sectionId: string, worldX: number, worldY: number) => {
    const nodes: ChigmaNode[] = [];

    if (sectionId === 'sec_hero') {
      nodes.push(
        createDefaultNode('badge', worldX + 180, worldY, { width: 140, height: 28, label: '✨ What\'s New in v2.0' }),
        createDefaultNode('text', worldX, worldY + 44, { width: 500, height: 80, text: 'Design Wireframes at the Speed of Thought', fontSize: 28, fontWeight: 700, textAlign: 'center' }),
        createDefaultNode('text', worldX + 30, worldY + 134, { width: 440, height: 40, text: 'Rapid local prototyping tool for modern product teams.', fontSize: 14, fill: '#71717A', textAlign: 'center' }),
        createDefaultNode('button', worldX + 110, worldY + 190, { width: 130, height: 42, label: 'Start Designing', variant: 'primary', cornerRadius: 50 }),
        createDefaultNode('button', worldX + 255, worldY + 190, { width: 130, height: 42, label: 'Live Demo →', variant: 'secondary', cornerRadius: 50 })
      );
    } else if (sectionId === 'sec_pricing') {
      // 3 Tier Pricing
      nodes.push(
        createDefaultNode('card', worldX, worldY, { width: 220, height: 320, title: 'Starter Free', subtitle: '$0 / mo', content: '• 3 Projects\n• Basic Elements\n• SVG Export\n• Community Support', footerText: 'Get Started' }),
        createDefaultNode('card', worldX + 244, worldY - 10, { width: 220, height: 340, title: 'Professional', subtitle: '$29 / mo (Popular)', content: '• Unlimited Projects\n• HTML/CSS Export\n• Prototyping Modes\n• Auto-Layout Stacks', footerText: 'Upgrade to Pro' }),
        createDefaultNode('card', worldX + 488, worldY, { width: 220, height: 320, title: 'Enterprise', subtitle: '$99 / mo', content: '• Custom Templates\n• Design Tokens\n• Offline Backup\n• Priority Support', footerText: 'Contact Sales' })
      );
    } else if (sectionId === 'sec_features') {
      // 3 Feature Cards
      nodes.push(
        createDefaultNode('card', worldX, worldY, { width: 220, height: 180, title: '⚡ 60fps Vector Canvas', subtitle: 'Ultra Smooth', content: 'Hardware-accelerated SVG engine with sub-pixel alignment.' }),
        createDefaultNode('card', worldX + 244, worldY, { width: 220, height: 180, title: '🔒 100% Local & Private', subtitle: 'Zero Cloud Storage', content: 'All documents stay on your machine via IndexedDB.' }),
        createDefaultNode('card', worldX + 488, worldY, { width: 220, height: 180, title: '💻 HTML & CSS Export', subtitle: 'Developer Handoff', content: 'Export clean semantic HTML and responsive styles in 1 click.' })
      );
    } else if (sectionId === 'sec_auth') {
      // Login Form Card
      nodes.push(
        createDefaultNode('card', worldX, worldY, { width: 340, height: 360, title: 'Welcome Back', subtitle: 'Enter your credentials to access your account' }),
        createDefaultNode('input', worldX + 20, worldY + 90, { width: 300, height: 42, label: 'Email Address', placeholder: 'name@company.com' }),
        createDefaultNode('input', worldX + 20, worldY + 160, { width: 300, height: 42, label: 'Password', inputType: 'password', placeholder: '••••••••' }),
        createDefaultNode('checkbox', worldX + 20, worldY + 230, { label: 'Remember me for 30 days', checked: true }),
        createDefaultNode('button', worldX + 20, worldY + 280, { width: 300, height: 44, label: 'Sign In', variant: 'primary', cornerRadius: 50 })
      );
    } else if (sectionId === 'sec_profile') {
      // Profile Header
      nodes.push(
        createDefaultNode('card', worldX, worldY, { width: 560, height: 160, title: '', subtitle: '', content: '' }),
        createDefaultNode('avatar', worldX + 24, worldY + 24, { width: 64, height: 64, name: 'Alex Rivera', fill: '#6366F1' }),
        createDefaultNode('text', worldX + 104, worldY + 28, { width: 260, height: 26, text: 'Alex Rivera', fontSize: 18, fontWeight: 700 }),
        createDefaultNode('text', worldX + 104, worldY + 54, { width: 260, height: 20, text: 'Principal Product Designer', fontSize: 13, fill: '#71717A' }),
        createDefaultNode('badge', worldX + 104, worldY + 84, { width: 90, height: 24, label: 'PRO Member', variant: 'success' }),
        createDefaultNode('button', worldX + 430, worldY + 28, { width: 100, height: 36, label: 'Follow +', variant: 'primary', cornerRadius: 50 })
      );
    } else if (sectionId === 'sec_newsletter') {
      // Newsletter Subscribe Banner
      nodes.push(
        createDefaultNode('card', worldX, worldY, { width: 540, height: 140, title: 'Subscribe to Weekly Wireframe Tips', subtitle: 'Get the latest UX patterns and wireframing best practices delivered weekly.' }),
        createDefaultNode('input', worldX + 20, worldY + 74, { width: 330, height: 42, placeholder: 'Enter your email address...' }),
        createDefaultNode('button', worldX + 364, worldY + 74, { width: 156, height: 42, label: 'Subscribe Free', variant: 'primary', cornerRadius: 50 })
      );
    }

    if (nodes.length > 0) {
      addNodes(nodes);
      setSelectedIds(nodes.map((n) => n.id));
    }
  };

  const handleItemClick = (item: LibraryItem) => {
    const centerScreen = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    const worldPoint = screenToWorld(centerScreen, viewport);

    if (item.isSection) {
      handleInsertSection(item.id, worldPoint.x - 200, worldPoint.y - 120);
    } else if (item.type) {
      const node = createDefaultNode(item.type, worldPoint.x - 60, worldPoint.y - 40);
      addNode(node);
      setSelectedIds([node.id]);
    }
  };

  return (
    <div className="chigma-component-library-panel">
      {/* Search Bar */}
      <div className="library-search-container">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search components & sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Filter */}
      <div className="library-category-chips">
        {['all', 'Sections', 'Primitives', 'Components', 'Navigation', 'Charts'].map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Project Custom Component Masters */}
      {projectComponents.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2 flex items-center gap-1.5">
            <span>❖ Project Components</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-200 dark:bg-zinc-800 rounded-full font-normal">
              {projectComponents.length}
            </span>
          </div>
          <div className="library-grid">
            {projectComponents.map((comp) => (
              <div
                key={comp.id}
                className="library-card border border-purple-500/30 bg-purple-500/5 hover:border-purple-500"
                onClick={() => handleInsertMasterInstance(comp)}
                title={`Click to insert instance of ❖ ${comp.name}`}
              >
                <div className="library-card-icon text-purple-600 dark:text-purple-400">❖</div>
                <div className="library-card-name font-medium">{comp.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of 1-Click Insertable Components & Sections */}
      <div className="library-grid">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="library-card"
            onClick={() => handleItemClick(item)}
            title={`Click to insert ${item.name}`}
          >
            <div className="library-card-icon">{item.icon}</div>
            <div className="library-card-name">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
