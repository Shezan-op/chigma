import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { createDefaultNode } from '../../models/document';
import { screenToWorld } from '../../engine/geometry/matrix';
import { normalizeSpacing } from '../../engine/layout/smartSpacing';
import { createComponentMaster } from '../../engine/components/componentEngine';
import type { NodeType } from '../../models/node';
import {
  Search,
  Square,
  Circle,
  Type,
  Minus,
  ArrowRight,
  Hand,
  MousePointer,
  Grid,
  Maximize,
  Sliders,
  Code,
  Layout,
  Table,
  CreditCard,
  PieChart,
  BarChart,
  CornerUpLeft,
  CornerUpRight,
  Smile,
  Palette,
  ShieldCheck,
  Smartphone,
  Component,
  AlignVerticalSpaceAround,
  Sun,
  Moon,
  Sparkles,
  Server,
  FileText,
  History,
  ShieldAlert,
  Cpu,
  Plus
} from 'lucide-react';

interface PaletteCommand {
  id: string;
  title: string;
  category: 'Insert' | 'Tools' | 'Actions' | 'View' | 'Design System' | 'AI & Dev';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTool,
    viewport,
    setZoom,
    resetZoom,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    selectedIds,
    setSelectedIds,
    editorMode,
    setEditorMode,
    setAiPanelOpen,
    setQuickInsertOpen,
    setCodeExportModalOpen,
    setPrototypeMode,
    setIconPickerOpen,
    setDesignSystemModalOpen,
    setAccessibilityModalOpen,
    setResponsivePreviewOpen,
    setLinterModalOpen,
    setDecisionLogModalOpen,
    setSnapshotsModalOpen,
    setMcpModalOpen
  } = useEditorStore();

  const {
    document: doc,
    addNode,
    undo,
    redo,
    canUndo,
    canRedo,
    updateDocument,
    updateNodes,
    getNodeById
  } = useDocumentStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const insertNodeAtCenter = (type: NodeType) => {
    const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const world = screenToWorld(centerScreen, viewport);
    const node = createDefaultNode(type, world.x - 70, world.y - 40);
    addNode(node);
    setSelectedIds([node.id]);
    setCommandPaletteOpen(false);
  };

  const commands: PaletteCommand[] = [
    // Presentation
    {
      id: 'action_present_prototype',
      title: 'Present Interactive Prototype',
      category: 'View',
      icon: <Maximize size={15} color="#10B981" />,
      shortcut: 'F5',
      action: () => {
        setCommandPaletteOpen(false);
        setPrototypeMode(true);
      }
    },
    // AI & Dev Mode
    {
      id: 'action_ai_designer',
      title: 'Open Chigma AI Co-Designer',
      category: 'AI & Dev',
      icon: <Sparkles size={15} color="#8B5CF6" />,
      shortcut: 'Shift+A',
      action: () => {
        setCommandPaletteOpen(false);
        setAiPanelOpen(true);
      }
    },
    {
      id: 'action_quick_insert',
      title: 'Quick Insert Component Palette...',
      category: 'Insert',
      icon: <Plus size={15} color="#0066FF" />,
      shortcut: '/',
      action: () => {
        setCommandPaletteOpen(false);
        setQuickInsertOpen(true);
      }
    },
    {
      id: 'action_dev_mode',
      title: editorMode === 'dev' ? 'Switch to Design Mode' : 'Switch to Dev / Handoff Mode',
      category: 'AI & Dev',
      icon: <Cpu size={15} color="#4F46E5" />,
      action: () => {
        setEditorMode(editorMode === 'dev' ? 'design' : 'dev');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_linter',
      title: 'Run Design Health & Quality Linter',
      category: 'Actions',
      icon: <ShieldAlert size={15} color="#EC4899" />,
      shortcut: 'Shift+L',
      action: () => {
        setCommandPaletteOpen(false);
        setLinterModalOpen(true);
      }
    },
    {
      id: 'action_snapshots',
      title: 'Version History & Snapshots...',
      category: 'Actions',
      icon: <History size={15} color="#3B82F6" />,
      action: () => {
        setCommandPaletteOpen(false);
        setSnapshotsModalOpen(true);
      }
    },
    {
      id: 'action_decision_log',
      title: 'Project Design Decision Log...',
      category: 'Design System',
      icon: <FileText size={15} color="#9333EA" />,
      action: () => {
        setCommandPaletteOpen(false);
        setDecisionLogModalOpen(true);
      }
    },
    {
      id: 'action_mcp_server',
      title: 'Model Context Protocol (MCP) Server Status & Tools',
      category: 'AI & Dev',
      icon: <Server size={15} color="#10B981" />,
      action: () => {
        setCommandPaletteOpen(false);
        setMcpModalOpen(true);
      }
    },

    // Design System & Advanced Tools
    {
      id: 'action_icon_picker',
      title: 'Insert Vector Icon...',
      category: 'Insert',
      icon: <Smile size={15} color="#0066FF" />,
      shortcut: 'Shift+I',
      action: () => {
        setCommandPaletteOpen(false);
        setIconPickerOpen(true);
      }
    },
    {
      id: 'action_design_system',
      title: 'Design System & Variables (Tokens, Styles, Modes)',
      category: 'Design System',
      icon: <Palette size={15} color="#8B5CF6" />,
      shortcut: 'Shift+D',
      action: () => {
        setCommandPaletteOpen(false);
        setDesignSystemModalOpen(true);
      }
    },
    {
      id: 'action_a11y_audit',
      title: 'Run Accessibility & Contrast Check (WCAG)',
      category: 'Actions',
      icon: <ShieldCheck size={15} color="#10B981" />,
      action: () => {
        setCommandPaletteOpen(false);
        setAccessibilityModalOpen(true);
      }
    },
    {
      id: 'action_responsive_preview',
      title: 'Responsive Breakpoint Preview & Slider',
      category: 'View',
      icon: <Smartphone size={15} color="#F59E0B" />,
      action: () => {
        setCommandPaletteOpen(false);
        setResponsivePreviewOpen(true);
      }
    },
    {
      id: 'action_create_component',
      title: 'Convert Selection to Master Component',
      category: 'Design System',
      icon: <Component size={15} color="#7C3AED" />,
      shortcut: 'Ctrl+Alt+K',
      action: () => {
        if (selectedIds.length > 0) {
          const node = getNodeById(selectedIds[0]);
          if (node) {
            const { master, updatedNode } = createComponentMaster(node);
            const currentComponents = doc.components || [];
            updateDocument({ components: [...currentComponents, master] });
            updateNodes([{ id: node.id, props: updatedNode }]);
          }
        }
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_normalize_spacing',
      title: 'Normalize Spacing to 8px Design Grid',
      category: 'Actions',
      icon: <AlignVerticalSpaceAround size={15} color="#0066FF" />,
      action: () => {
        const nodes = selectedIds.map((id) => getNodeById(id)).filter((n): n is any => Boolean(n));
        if (nodes.length > 1) {
          const normalized = normalizeSpacing(nodes, 8);
          updateNodes(normalized.map((n) => ({ id: n.id, props: { x: n.x, y: n.y } })));
        }
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_mode_light',
      title: 'Switch to Light Mode Tokens',
      category: 'Design System',
      icon: <Sun size={15} />,
      action: () => {
        updateDocument({ activeModeId: 'light' });
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_mode_dark',
      title: 'Switch to Dark Mode Tokens',
      category: 'Design System',
      icon: <Moon size={15} />,
      action: () => {
        updateDocument({ activeModeId: 'dark' });
        setCommandPaletteOpen(false);
      }
    },

    // Tools
    {
      id: 'tool_select',
      title: 'Select Tool',
      category: 'Tools',
      icon: <MousePointer size={15} />,
      shortcut: 'V',
      action: () => {
        setActiveTool('select');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_hand',
      title: 'Hand Tool (Pan Canvas)',
      category: 'Tools',
      icon: <Hand size={15} />,
      shortcut: 'H',
      action: () => {
        setActiveTool('hand');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_frame',
      title: 'Frame Tool',
      category: 'Tools',
      icon: <Layout size={15} />,
      shortcut: 'F',
      action: () => {
        setActiveTool('frame');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_rect',
      title: 'Rectangle Tool',
      category: 'Tools',
      icon: <Square size={15} />,
      shortcut: 'R',
      action: () => {
        setActiveTool('rectangle');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_ellipse',
      title: 'Ellipse Tool',
      category: 'Tools',
      icon: <Circle size={15} />,
      shortcut: 'E',
      action: () => {
        setActiveTool('ellipse');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_text',
      title: 'Text Tool',
      category: 'Tools',
      icon: <Type size={15} />,
      shortcut: 'T',
      action: () => {
        setActiveTool('text');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_line',
      title: 'Line Tool',
      category: 'Tools',
      icon: <Minus size={15} />,
      shortcut: 'L',
      action: () => {
        setActiveTool('line');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'tool_arrow',
      title: 'Arrow Tool',
      category: 'Tools',
      icon: <ArrowRight size={15} />,
      shortcut: 'A',
      action: () => {
        setActiveTool('arrow');
        setCommandPaletteOpen(false);
      }
    },

    // Insert Wireframe Components
    {
      id: 'insert_button',
      title: 'Insert Button Component',
      category: 'Insert',
      icon: <Square size={15} />,
      action: () => insertNodeAtCenter('button')
    },
    {
      id: 'insert_input',
      title: 'Insert Text Input',
      category: 'Insert',
      icon: <Type size={15} />,
      action: () => insertNodeAtCenter('input')
    },
    {
      id: 'insert_card',
      title: 'Insert Content Card',
      category: 'Insert',
      icon: <CreditCard size={15} />,
      action: () => insertNodeAtCenter('card')
    },
    {
      id: 'insert_navbar',
      title: 'Insert Top Navbar',
      category: 'Insert',
      icon: <Layout size={15} />,
      action: () => insertNodeAtCenter('navbar')
    },
    {
      id: 'insert_sidebar',
      title: 'Insert Sidebar Navigation',
      category: 'Insert',
      icon: <Layout size={15} />,
      action: () => insertNodeAtCenter('sidebar')
    },
    {
      id: 'insert_table',
      title: 'Insert Data Table',
      category: 'Insert',
      icon: <Table size={15} />,
      action: () => insertNodeAtCenter('table')
    },
    {
      id: 'insert_bar_chart',
      title: 'Insert Bar Chart',
      category: 'Insert',
      icon: <BarChart size={15} />,
      action: () => insertNodeAtCenter('bar-chart')
    },
    {
      id: 'insert_line_chart',
      title: 'Insert Line Trend Chart',
      category: 'Insert',
      icon: <BarChart size={15} />,
      action: () => insertNodeAtCenter('line-chart')
    },
    {
      id: 'insert_donut_chart',
      title: 'Insert Donut Chart',
      category: 'Insert',
      icon: <PieChart size={15} />,
      action: () => insertNodeAtCenter('donut-chart')
    },
    {
      id: 'insert_modal',
      title: 'Insert Modal Dialog',
      category: 'Insert',
      icon: <Square size={15} />,
      action: () => insertNodeAtCenter('modal')
    },
    {
      id: 'insert_toast',
      title: 'Insert Toast Notification',
      category: 'Insert',
      icon: <Sliders size={15} />,
      action: () => insertNodeAtCenter('toast')
    },

    // Actions & Code Export
    {
      id: 'action_export_code',
      title: 'Export Wireframe to HTML/CSS/React Code',
      category: 'Actions',
      icon: <Code size={15} color="#0066FF" />,
      shortcut: 'Ctrl+Shift+C',
      action: () => {
        setCommandPaletteOpen(false);
        setCodeExportModalOpen(true);
      }
    },
    {
      id: 'action_undo',
      title: 'Undo',
      category: 'Actions',
      icon: <CornerUpLeft size={15} />,
      shortcut: 'Ctrl+Z',
      action: () => {
        if (canUndo()) undo();
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_redo',
      title: 'Redo',
      category: 'Actions',
      icon: <CornerUpRight size={15} />,
      shortcut: 'Ctrl+Y',
      action: () => {
        if (canRedo()) redo();
        setCommandPaletteOpen(false);
      }
    },

    // View & Canvas
    {
      id: 'view_toggle_grid',
      title: showGrid ? 'Hide Dot Grid' : 'Show Dot Grid',
      category: 'View',
      icon: <Grid size={15} />,
      shortcut: 'Ctrl+\'',
      action: () => {
        setShowGrid(!showGrid);
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_toggle_rulers',
      title: showRulers ? 'Hide Pixel Rulers' : 'Show Pixel Rulers',
      category: 'View',
      icon: <Sliders size={15} />,
      shortcut: 'Shift+R',
      action: () => {
        setShowRulers(!showRulers);
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_reset_zoom',
      title: 'Reset Zoom (100%)',
      category: 'View',
      icon: <Maximize size={15} />,
      shortcut: 'Ctrl+0',
      action: () => {
        resetZoom();
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_zoom_200',
      title: 'Zoom to 200%',
      category: 'View',
      icon: <Maximize size={15} />,
      action: () => {
        setZoom(2);
        setCommandPaletteOpen(false);
      }
    }
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

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
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="chigma-modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="chigma-modal-container command-palette-modal"
        style={{
          width: '560px',
          maxWidth: '92vw',
          maxHeight: '440px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid #E6E6E6'
          }}
        >
          <Search size={18} color="#888888" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, tool, or component..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              background: 'transparent',
              color: '#000000'
            }}
          />
          <span
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: '#F1F1F1',
              borderRadius: '4px',
              color: '#666666',
              fontFamily: 'ui-monospace'
            }}
          >
            ESC
          </span>
        </div>

        {/* Command Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#F1F1F1' : 'transparent',
                    color: '#000000',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#555555' }}>{cmd.icon}</span>
                    <span style={{ fontWeight: isSelected ? 600 : 400 }}>{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#888888',
                        fontFamily: 'ui-monospace, monospace',
                        background: isSelected ? '#E6E6E6' : '#F7F7F5',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
