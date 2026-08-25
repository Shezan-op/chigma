import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { X, Keyboard } from 'lucide-react';

interface ShortcutCategory {
  title: string;
  items: { key: string; description: string }[];
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    title: 'Tools',
    items: [
      { key: 'V', description: 'Select tool' },
      { key: 'F', description: 'Frame tool' },
      { key: 'R', description: 'Rectangle tool' },
      { key: 'E', description: 'Ellipse tool' },
      { key: 'L', description: 'Line tool' },
      { key: 'A', description: 'Arrow tool' },
      { key: 'T', description: 'Text tool' },
      { key: 'P', description: 'Pencil / Freehand drawing' }
    ]
  },
  {
    title: 'Editing & History',
    items: [
      { key: 'Ctrl / ⌘ + Z', description: 'Undo' },
      { key: 'Ctrl / ⌘ + Shift + Z', description: 'Redo' },
      { key: 'Ctrl / ⌘ + C', description: 'Copy' },
      { key: 'Ctrl / ⌘ + X', description: 'Cut' },
      { key: 'Ctrl / ⌘ + V', description: 'Paste' },
      { key: 'Ctrl / ⌘ + D', description: 'Duplicate with offset' },
      { key: 'Delete / Backspace', description: 'Delete selected nodes' },
      { key: 'Double Click Text', description: 'Edit text in-place' }
    ]
  },
  {
    title: 'Selection & Arrange',
    items: [
      { key: 'Ctrl / ⌘ + A', description: 'Select all nodes' },
      { key: 'Escape', description: 'Deselect all' },
      { key: 'Shift + Click', description: 'Toggle multi-selection' },
      { key: 'Ctrl / ⌘ + G', description: 'Group selected nodes' },
      { key: 'Ctrl / ⌘ + Shift + G', description: 'Ungroup nodes' },
      { key: 'Ctrl / ⌘ + ]', description: 'Bring Forward' },
      { key: 'Ctrl / ⌘ + [', description: 'Send Backward' },
      { key: 'Ctrl / ⌘ + Shift + ]', description: 'Bring to Front' },
      { key: 'Ctrl / ⌘ + Shift + [', description: 'Send to Back' }
    ]
  },
  {
    title: 'Canvas & Navigation',
    items: [
      { key: 'Space + Drag', description: 'Pan canvas' },
      { key: 'Middle Mouse Drag', description: 'Pan canvas' },
      { key: 'Mouse Wheel', description: 'Pan or zoom (with Ctrl/⌘)' },
      { key: 'Arrow Keys', description: 'Nudge 1px' },
      { key: 'Shift + Arrow Keys', description: 'Nudge 10px' },
      { key: 'Shift + Drag Handle', description: 'Preserve aspect ratio' },
      { key: 'Alt + Drag Handle', description: 'Resize from center' },
      { key: 'Shift + Drag Rotate', description: 'Snap rotation to 45°' }
    ]
  }
];

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useProjectStore();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setShortcutsModalOpen(false)}>
      <div className="chigma-modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Keyboard size={18} />
            <h3>Keyboard Shortcuts</h3>
          </div>
          <button className="btn-icon sm" onClick={() => setShortcutsModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body shortcuts-grid">
          {SHORTCUTS.map((cat, idx) => (
            <div key={idx} className="shortcut-category-card">
              <h4>{cat.title}</h4>
              <div className="shortcut-items-list">
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="shortcut-row">
                    <span className="shortcut-desc">{item.description}</span>
                    <kbd className="shortcut-badge">{item.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
