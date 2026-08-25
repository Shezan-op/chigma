import React, { useState } from 'react';
import type { ChigmaNode, GroupNode } from '../../models/node';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Square,
  Circle,
  Type,
  Folder,
  BarChart,
  Box,
  Image as ImageIcon
} from 'lucide-react';

interface LayerTreeItemProps {
  node: ChigmaNode;
  depth?: number;
}

export const LayerTreeItem: React.FC<LayerTreeItemProps> = ({ node, depth = 0 }) => {
  const { selectedIds, selectNode, hoveredId, setHoveredId } = useEditorStore();
  const { updateNode, renameDocument: _renameDoc } = useDocumentStore();
  const [expanded, setExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(node.name);

  const isSelected = selectedIds.includes(node.id);
  const isHovered = hoveredId === node.id;
  const isGroup = node.type === 'group' || node.type === 'frame';
  const children = isGroup ? ((node as GroupNode).children || []) : [];

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id, e.shiftKey);
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateNode(node.id, { visible: !node.visible }, true, 'Toggle visibility');
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateNode(node.id, { locked: !node.locked }, true, 'Toggle lock');
  };

  const handleFinishRename = () => {
    setIsEditingName(false);
    if (nameVal.trim() && nameVal !== node.name) {
      updateNode(node.id, { name: nameVal.trim() }, true, 'Rename layer');
    }
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case 'rectangle':
        return <Square size={13} />;
      case 'ellipse':
        return <Circle size={13} />;
      case 'text':
        return <Type size={13} />;
      case 'group':
      case 'frame':
        return <Folder size={13} />;
      case 'image':
        return <ImageIcon size={13} />;
      case 'bar-chart':
      case 'line-chart':
      case 'pie-chart':
      case 'donut-chart':
        return <BarChart size={13} />;
      default:
        return <Box size={13} />;
    }
  };

  return (
    <div className="chigma-layer-tree-branch">
      <div
        className={`chigma-layer-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={handleSelect}
        onMouseEnter={() => setHoveredId(node.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Expand / Collapse toggle for containers */}
        {isGroup && children.length > 0 ? (
          <button
            className="btn-icon xs"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span style={{ width: 16 }} />
        )}

        {/* Node Icon */}
        <span className="layer-type-icon">{getNodeIcon()}</span>

        {/* Node Name */}
        {isEditingName ? (
          <input
            type="text"
            className="layer-rename-input"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={handleFinishRename}
            onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="layer-name-text"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingName(true);
            }}
          >
            {node.name}
          </span>
        )}

        {/* Quick Visibility and Lock Actions */}
        <div className="layer-actions">
          <button
            className={`btn-icon xs ${!node.visible ? 'active' : ''}`}
            onClick={handleToggleVisibility}
            title={node.visible ? 'Hide Layer' : 'Show Layer'}
          >
            {node.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            className={`btn-icon xs ${node.locked ? 'active' : ''}`}
            onClick={handleToggleLock}
            title={node.locked ? 'Unlock Layer' : 'Lock Layer'}
          >
            {node.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
        </div>
      </div>

      {/* Render recursive children for groups and frames */}
      {isGroup && expanded && children.length > 0 && (
        <div className="chigma-layer-children">
          {children.map((child) => (
            <LayerTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
