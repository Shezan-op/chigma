import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { createDefaultNode } from '../../models/document';
import { screenToWorld } from '../../engine/geometry/matrix';
import type { NodeType } from '../../models/node';
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
  Table as TableIcon
} from 'lucide-react';

interface LibraryItem {
  type: NodeType;
  name: string;
  category: 'Primitives' | 'Charts' | 'Components' | 'Navigation';
  icon: React.ReactNode;
}

export const ComponentLibraryPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const addNode = useDocumentStore((s) => s.addNode);
  const { viewport, setSelectedIds } = useEditorStore();

  const libraryItems: LibraryItem[] = [
    // Primitives
    { type: 'rectangle', name: 'Rectangle', category: 'Primitives', icon: <Square size={16} /> },
    { type: 'ellipse', name: 'Ellipse', category: 'Primitives', icon: <Circle size={16} /> },
    { type: 'text', name: 'Heading / Label', category: 'Primitives', icon: <Type size={16} /> },

    // Wireframe Components
    { type: 'button', name: 'Action Button', category: 'Components', icon: <Square size={16} /> },
    { type: 'input', name: 'Text Input', category: 'Components', icon: <Type size={16} /> },
    { type: 'textarea', name: 'Textarea Box', category: 'Components', icon: <Type size={16} /> },
    { type: 'checkbox', name: 'Checkbox', category: 'Components', icon: <CheckSquare size={16} /> },
    { type: 'radio', name: 'Radio Button', category: 'Components', icon: <Radio size={16} /> },
    { type: 'toggle', name: 'Toggle Switch', category: 'Components', icon: <ToggleLeft size={16} /> },
    { type: 'dropdown', name: 'Select Dropdown', category: 'Components', icon: <Columns size={16} /> },
    { type: 'card', name: 'Content Card', category: 'Components', icon: <CreditCard size={16} /> },
    { type: 'avatar', name: 'User Avatar', category: 'Components', icon: <Circle size={16} /> },
    { type: 'badge', name: 'Status Badge', category: 'Components', icon: <Square size={16} /> },
    { type: 'table', name: 'Data Table', category: 'Components', icon: <TableIcon size={16} /> },
    { type: 'progress', name: 'Progress Bar', category: 'Components', icon: <Sliders size={16} /> },
    { type: 'slider', name: 'Range Slider', category: 'Components', icon: <Sliders size={16} /> },
    { type: 'modal', name: 'Modal Dialog', category: 'Components', icon: <Square size={16} /> },
    { type: 'toast', name: 'Toast Alert', category: 'Components', icon: <MessageSquare size={16} /> },

    // Navigation
    { type: 'navbar', name: 'Top Navbar', category: 'Navigation', icon: <Columns size={16} /> },
    { type: 'sidebar', name: 'App Sidebar', category: 'Navigation', icon: <Columns size={16} /> },
    { type: 'tabs', name: 'Tab Navigation', category: 'Navigation', icon: <Columns size={16} /> },
    { type: 'breadcrumb', name: 'Breadcrumbs', category: 'Navigation', icon: <Columns size={16} /> },
    { type: 'pagination', name: 'Pagination Bar', category: 'Navigation', icon: <Columns size={16} /> },

    // Charts
    { type: 'bar-chart', name: 'Bar Chart', category: 'Charts', icon: <BarChart size={16} /> },
    { type: 'line-chart', name: 'Line Trend', category: 'Charts', icon: <BarChart size={16} /> },
    { type: 'pie-chart', name: 'Pie Chart', category: 'Charts', icon: <PieChart size={16} /> },
    { type: 'donut-chart', name: 'Donut Chart', category: 'Charts', icon: <PieChart size={16} /> }
  ];

  const filtered = libraryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsert = (type: NodeType) => {
    const centerScreen = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    const worldPoint = screenToWorld(centerScreen, viewport);
    const node = createDefaultNode(type, worldPoint.x - 60, worldPoint.y - 40);
    addNode(node);
    setSelectedIds([node.id]);
  };

  return (
    <div className="chigma-component-library-panel">
      {/* Search Bar */}
      <div className="library-search-container">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search 20+ components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Filter */}
      <div className="library-category-chips">
        {['all', 'Primitives', 'Components', 'Navigation', 'Charts'].map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Grid of 1-Click Insertable Components */}
      <div className="library-grid">
        {filtered.map((item) => (
          <div
            key={item.type}
            className="library-card"
            onClick={() => handleInsert(item.type)}
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
