import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import {
  Droplet,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Combine,
  Scissors,
  Intersect,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

export const FloatingActionBar: React.FC = () => {
  const { selectedIds } = useEditorStore();
  const {
    getNodeById,
    updateNodes,
    reorderNodes,
    duplicateNodes,
    deleteNodes,
    alignNodes,
    distributeNodes
  } = useDocumentStore();

  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const firstNode = getNodeById(selectedIds[0]);
  const isLocked = Boolean(firstNode?.locked);
  const isMultiple = selectedIds.length > 1;

  const handleToggleLock = () => {
    const updates = selectedIds.map((id) => ({
      id,
      props: { locked: !isLocked }
    }));
    updateNodes(updates, true, 'Toggle Lock');
  };

  const handleFillChange = (newColor: string) => {
    const updates = selectedIds.map((id) => ({
      id,
      props: { fill: newColor }
    }));
    updateNodes(updates, true, 'Change Fill Color');
  };

  return (
    <div className="chigma-floating-action-bar">
      {/* 1. Fill Color Quick Droplet */}
      <div className="fab-item-container">
        <button
          className="fab-btn"
          onClick={() => setColorPickerOpen(!isColorPickerOpen)}
          title="Quick Fill Color"
        >
          <Droplet size={14} fill={firstNode?.fill || '#4F46E5'} color={firstNode?.fill || '#4F46E5'} />
        </button>

        {isColorPickerOpen && (
          <div className="fab-color-popover">
            {['#FFFFFF', '#000000', '#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#DCEEB1', '#C5B0F4'].map((col) => (
              <button
                key={col}
                className="fab-color-swatch"
                style={{ backgroundColor: col }}
                onClick={() => {
                  handleFillChange(col);
                  setColorPickerOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fab-divider" />

      {/* 2. Alignment Buttons */}
      <button
        className="fab-btn"
        onClick={() => alignNodes('left', selectedIds)}
        title="Align Left"
      >
        <AlignLeft size={14} />
      </button>
      <button
        className="fab-btn"
        onClick={() => alignNodes('center', selectedIds)}
        title="Align Center"
      >
        <AlignCenter size={14} />
      </button>
      <button
        className="fab-btn"
        onClick={() => alignNodes('right', selectedIds)}
        title="Align Right"
      >
        <AlignRight size={14} />
      </button>
      {isMultiple && (
        <>
          <button
            className="fab-btn"
            onClick={() => distributeNodes('horizontal', selectedIds)}
            title="Distribute Horizontally"
          >
            <AlignJustify size={14} />
          </button>

          <div className="fab-divider" />

          {/* Boolean CSG Operations */}
          <button
            className="fab-btn"
            onClick={() => useDocumentStore.getState().performBooleanOperation('union', selectedIds)}
            title="Boolean Union (Combine Shapes)"
          >
            <Combine size={14} />
          </button>
          <button
            className="fab-btn"
            onClick={() => useDocumentStore.getState().performBooleanOperation('subtract', selectedIds)}
            title="Boolean Subtract (Cut Front Shape)"
          >
            <Scissors size={14} />
          </button>
          <button
            className="fab-btn"
            onClick={() => useDocumentStore.getState().performBooleanOperation('intersect', selectedIds)}
            title="Boolean Intersect (Overlap Only)"
          >
            <Intersect size={14} />
          </button>
        </>
      )}

      <div className="fab-divider" />

      {/* 3. Layer Ordering */}
      <button
        className="fab-btn"
        onClick={() => reorderNodes('forward', selectedIds)}
        title="Bring Forward (Ctrl+])"
      >
        <ArrowUp size={14} />
      </button>
      <button
        className="fab-btn"
        onClick={() => reorderNodes('backward', selectedIds)}
        title="Send Backward (Ctrl+[)"
      >
        <ArrowDown size={14} />
      </button>

      <div className="fab-divider" />

      {/* 4. Lock, Duplicate, Delete */}
      <button
        className={`fab-btn ${isLocked ? 'active' : ''}`}
        onClick={handleToggleLock}
        title={isLocked ? 'Unlock Element' : 'Lock Element'}
      >
        {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
      </button>

      <button
        className="fab-btn"
        onClick={() => duplicateNodes(selectedIds)}
        title="Duplicate Element (Ctrl+D)"
      >
        <Copy size={14} />
      </button>

      <button
        className="fab-btn danger"
        onClick={() => deleteNodes(selectedIds)}
        title="Delete Element (Delete)"
      >
        <Trash2 size={14} />
      </button>

      <button
        className="fab-btn"
        title="More Actions"
      >
        <MoreHorizontal size={14} />
      </button>
    </div>
  );
};
