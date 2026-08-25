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
  Layout
} from 'lucide-react';

interface ToolItem {
  id: ToolType;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const ToolStrip: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore();

  const tools: ToolItem[] = [
    { id: 'select', label: 'Select', shortcut: 'V', icon: <MousePointer size={15} /> },
    { id: 'hand', label: 'Hand / Pan', shortcut: 'H', icon: <Hand size={15} /> },
    { id: 'frame', label: 'Frame', shortcut: 'F', icon: <Layout size={15} /> },
    { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: <Square size={15} /> },
    { id: 'ellipse', label: 'Ellipse', shortcut: 'E', icon: <Circle size={15} /> },
    { id: 'line', label: 'Line', shortcut: 'L', icon: <Minus size={15} /> },
    { id: 'arrow', label: 'Arrow', shortcut: 'A', icon: <ArrowRight size={15} /> },
    { id: 'polygon', label: 'Polygon', shortcut: '', icon: <Pentagon size={15} /> },
    { id: 'text', label: 'Text', shortcut: 'T', icon: <Type size={15} /> },
    { id: 'pencil', label: 'Pencil', shortcut: 'P', icon: <PenTool size={15} /> }
  ];

  return (
    <div className="chigma-tool-strip">
      {tools.map((t) => {
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            className={`chigma-tool-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTool(t.id)}
            title={`${t.label} (${t.shortcut || 'Click'})`}
            aria-label={t.label}
          >
            {t.icon}
          </button>
        );
      })}
    </div>
  );
};
