import React from 'react';
import { useEditorStore, type ToolType } from '../../store/useEditorStore';
import {
  MousePointer,
  Hand,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pentagon,
  Type,
  PenTool,
  Layout,
  LayoutGrid,
  Sparkles,
  Sliders
} from 'lucide-react';

interface ToolItem {
  id: ToolType;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const ToolStrip: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    setLeftSidebarTab,
    setIconPickerOpen,
    setDesignSystemModalOpen
  } = useEditorStore();

  const primaryTools: ToolItem[] = [
    { id: 'select', label: 'Select Tool', shortcut: 'V', icon: <MousePointer size={16} /> },
    { id: 'hand', label: 'Hand / Pan Tool', shortcut: 'H', icon: <Hand size={16} /> },
    { id: 'frame', label: 'Frame Tool', shortcut: 'F', icon: <Layout size={16} /> },
    { id: 'rectangle', label: 'Rectangle Tool', shortcut: 'R', icon: <Square size={16} /> },
    { id: 'ellipse', label: 'Ellipse Tool', shortcut: 'E', icon: <Circle size={16} /> },
    { id: 'line', label: 'Line Tool', shortcut: 'L', icon: <Minus size={16} /> },
    { id: 'arrow', label: 'Arrow Tool', shortcut: 'A', icon: <ArrowRight size={16} /> },
    { id: 'polygon', label: 'Polygon Tool', shortcut: '', icon: <Pentagon size={16} /> },
    { id: 'text', label: 'Text Tool', shortcut: 'T', icon: <Type size={16} /> },
    { id: 'pencil', label: 'Pencil Tool', shortcut: 'P', icon: <PenTool size={16} /> }
  ];

  return (
    <div className="chigma-vertical-toolstrip">
      <div className="toolstrip-top-group">
        {primaryTools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              className={`toolstrip-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTool(t.id)}
              title={`${t.label} (${t.shortcut || 'Click'})`}
              aria-label={t.label}
            >
              {t.icon}
            </button>
          );
        })}

        <div className="toolstrip-divider" />

        {/* Components Drawer Shortcut */}
        <button
          className="toolstrip-btn"
          onClick={() => setLeftSidebarTab('components')}
          title="Component Library"
        >
          <LayoutGrid size={16} />
        </button>

        {/* Vector Icon Picker */}
        <button
          className="toolstrip-btn"
          onClick={() => setIconPickerOpen(true)}
          title="Vector Icons Picker"
        >
          <Sparkles size={16} />
        </button>

        {/* Design System & Tokens */}
        <button
          className="toolstrip-btn"
          onClick={() => setDesignSystemModalOpen(true)}
          title="Design System & Variables"
        >
          <Sliders size={16} />
        </button>
      </div>

      {/* Bottom User Avatar in Toolstrip */}
      <div className="toolstrip-bottom-group">
        <div className="toolstrip-user-badge" title="Shezan">
          <span>S</span>
        </div>
      </div>
    </div>
  );
};
