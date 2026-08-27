import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { createDefaultNode } from '../../models/document';
import { screenToWorld } from '../../engine/geometry/matrix';
import type { NodeType } from '../../models/node';
import {
  Search,
  Square,
  Type,
  Layout,
  Table,
  CreditCard,
  PieChart,
  BarChart,
  Smile,
  X
} from 'lucide-react';

interface QuickInsertItem {
  id: string;
  name: string;
  category: 'Primitives' | 'Components' | 'Navigation' | 'Data & Charts' | 'Icons';
  type: NodeType | 'icon';
  description: string;
  icon: React.ReactNode;
}

const INSERT_CATALOG: QuickInsertItem[] = [
  { id: 'btn', name: 'Button', category: 'Components', type: 'button', description: 'Interactive button with variants (Primary, Secondary, Outline, Danger)', icon: <Square className="w-4 h-4 text-blue-500" /> },
  { id: 'input', name: 'Text Input', category: 'Components', type: 'input', description: 'Form input field with label and placeholder text', icon: <Type className="w-4 h-4 text-emerald-500" /> },
  { id: 'card', name: 'Content Card', category: 'Components', type: 'card', description: 'Surface container with header, subtitle, body, and action footer', icon: <CreditCard className="w-4 h-4 text-purple-500" /> },
  { id: 'navbar', name: 'Top Navbar', category: 'Navigation', type: 'navbar', description: 'Header navigation bar with logo branding and responsive links', icon: <Layout className="w-4 h-4 text-indigo-500" /> },
  { id: 'sidebar', name: 'Sidebar Navigation', category: 'Navigation', type: 'sidebar', description: 'Vertical navigation panel with icon links and profile widget', icon: <Layout className="w-4 h-4 text-pink-500" /> },
  { id: 'table', name: 'Data Table', category: 'Data & Charts', type: 'table', description: 'Responsive tabular data grid with column headers and striped rows', icon: <Table className="w-4 h-4 text-amber-500" /> },
  { id: 'barchart', name: 'Bar Chart', category: 'Data & Charts', type: 'bar-chart', description: 'Comparative metric bar visualization', icon: <BarChart className="w-4 h-4 text-cyan-500" /> },
  { id: 'linechart', name: 'Line Trend Chart', category: 'Data & Charts', type: 'line-chart', description: 'Temporal trend line visualization', icon: <BarChart className="w-4 h-4 text-blue-600" /> },
  { id: 'donutchart', name: 'Donut Distribution Chart', category: 'Data & Charts', type: 'donut-chart', description: 'Proportional segment donut breakdown', icon: <PieChart className="w-4 h-4 text-violet-500" /> },
  { id: 'modal', name: 'Modal Dialog Frame', category: 'Components', type: 'modal', description: 'Floating overlay dialog container', icon: <Square className="w-4 h-4 text-rose-500" /> },
  { id: 'toast', name: 'Toast Notification', category: 'Components', type: 'toast', description: 'Alert / confirmation notification bubble', icon: <CreditCard className="w-4 h-4 text-teal-500" /> },
  { id: 'frame', name: 'Empty Container Frame', category: 'Primitives', type: 'frame', description: 'Layout container supporting auto-layout and constraints', icon: <Layout className="w-4 h-4 text-zinc-500" /> },
  { id: 'rect', name: 'Rectangle Box', category: 'Primitives', type: 'rectangle', description: 'Basic box shape with styling, borders, and rounded corners', icon: <Square className="w-4 h-4 text-zinc-500" /> },
  { id: 'text', name: 'Text Heading / Paragraph', category: 'Primitives', type: 'text', description: 'Rich typography node with customizable font metrics', icon: <Type className="w-4 h-4 text-zinc-500" /> }
];

export const QuickInsertModal: React.FC = () => {
  const isOpen = useEditorStore((s) => s.isQuickInsertOpen);
  const setOpen = useEditorStore((s) => s.setQuickInsertOpen);
  const viewport = useEditorStore((s) => s.viewport);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const setIconPickerOpen = useEditorStore((s) => s.setIconPickerOpen);
  const addNode = useDocumentStore((s) => s.addNode);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = INSERT_CATALOG.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: QuickInsertItem) => {
    if (item.type === 'icon') {
      setOpen(false);
      setIconPickerOpen(true);
      return;
    }

    const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const world = screenToWorld(centerScreen, viewport);
    const node = createDefaultNode(item.type as NodeType, world.x - 100, world.y - 50);

    addNode(node);
    setSelectedIds([node.id]);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-fadeIn"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Quick Insert (/): Type component or wireframe element..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-medium"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Component Grid / List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No matching elements found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{item.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-500 dark:text-zinc-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 flex-shrink-0">
                    Insert ↵
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to insert at center</span>
            <span>ESC to dismiss</span>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              setIconPickerOpen(true);
            }}
            className="flex items-center gap-1 text-indigo-500 hover:underline font-semibold"
          >
            <Smile className="w-3.5 h-3.5" />
            Open Icon Library
          </button>
        </div>
      </div>
    </div>
  );
};
