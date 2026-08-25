import React from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { LayerTreeItem } from './LayerTreeItem';
import {
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  FolderPlus,
  FolderMinus,
  Trash2,
  Copy
} from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const activePage = useDocumentStore((s) => s.getActivePage());
  const reorderNodes = useDocumentStore((s) => s.reorderNodes);
  const groupNodes = useDocumentStore((s) => s.groupNodes);
  const ungroupNodes = useDocumentStore((s) => s.ungroupNodes);
  const deleteNodes = useDocumentStore((s) => s.deleteNodes);
  const duplicateNodes = useDocumentStore((s) => s.duplicateNodes);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);

  const nodes = activePage?.children || [];
  // Render in reverse so top layers visually appear at top of list
  const reversedNodes = [...nodes].reverse();

  const hasSelection = selectedIds.length > 0;
  const isSingleGroupSelected =
    selectedIds.length === 1 &&
    nodes.some((n) => n.id === selectedIds[0] && n.type === 'group');

  const handleGroup = () => {
    if (selectedIds.length >= 2) {
      const newGroupId = groupNodes(selectedIds);
      if (newGroupId) setSelectedIds([newGroupId]);
    }
  };

  const handleUngroup = () => {
    if (isSingleGroupSelected) {
      const restored = ungroupNodes(selectedIds[0]);
      if (restored.length > 0) setSelectedIds(restored);
    }
  };

  return (
    <div className="chigma-layers-panel">
      {/* Action Toolbar for Layers */}
      <div className="layers-action-bar">
        <div className="btn-group">
          <button
            className="btn-icon xs"
            disabled={!hasSelection}
            onClick={() => reorderNodes('front', selectedIds)}
            title="Bring to Front (Ctrl+Shift+])"
          >
            <ArrowUpToLine size={13} />
          </button>
          <button
            className="btn-icon xs"
            disabled={!hasSelection}
            onClick={() => reorderNodes('forward', selectedIds)}
            title="Bring Forward (Ctrl+])"
          >
            <ArrowUp size={13} />
          </button>
          <button
            className="btn-icon xs"
            disabled={!hasSelection}
            onClick={() => reorderNodes('backward', selectedIds)}
            title="Send Backward (Ctrl+[)"
          >
            <ArrowDown size={13} />
          </button>
          <button
            className="btn-icon xs"
            disabled={!hasSelection}
            onClick={() => reorderNodes('back', selectedIds)}
            title="Send to Back (Ctrl+Shift+[)"
          >
            <ArrowDownToLine size={13} />
          </button>
        </div>

        <div className="btn-group">
          <button
            className="btn-icon xs"
            disabled={selectedIds.length < 2}
            onClick={handleGroup}
            title="Group Selection (Ctrl+G)"
          >
            <FolderPlus size={13} />
          </button>
          <button
            className="btn-icon xs"
            disabled={!isSingleGroupSelected}
            onClick={handleUngroup}
            title="Ungroup (Ctrl+Shift+G)"
          >
            <FolderMinus size={13} />
          </button>
          <button
            className="btn-icon xs"
            disabled={!hasSelection}
            onClick={() => duplicateNodes(selectedIds)}
            title="Duplicate (Ctrl+D)"
          >
            <Copy size={13} />
          </button>
          <button
            className="btn-icon xs danger"
            disabled={!hasSelection}
            onClick={() => deleteNodes(selectedIds)}
            title="Delete (Del)"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Layers Tree */}
      <div className="layers-tree-content">
        {reversedNodes.length === 0 ? (
          <div className="empty-layers-state">
            <span>No layers on this page</span>
            <p>Draw shapes or add components</p>
          </div>
        ) : (
          reversedNodes.map((node) => <LayerTreeItem key={node.id} node={node} />)
        )}
      </div>
    </div>
  );
};
