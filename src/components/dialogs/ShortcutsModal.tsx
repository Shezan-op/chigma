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
      { key: 'H / Space', description: 'Hand / Pan tool' },
      { key: 'F', description: 'Frame tool' },
      { key: 'R', description: 'Rectangle tool' },
      { key: 'O / E', description: 'Ellipse tool' },
      { key: 'L', description: 'Line tool' },
      { key: 'A', description: 'Arrow tool' },
      { key: 'T', description: 'Text tool' },
      { key: 'P', description: 'Pencil tool' }
    ]
  },
  {
    title: 'Editing & History',
    items: [
      { key: 'Ctrl + Z', description: 'Undo' },
      { key: 'Ctrl + Shift + Z', description: 'Redo' },
      { key: 'Ctrl + C', description: 'Copy' },
      { key: 'Ctrl + V', description: 'Paste' },
      { key: 'Ctrl + D', description: 'Duplicate' },
      { key: 'Delete', description: 'Delete selected' },
      { key: 'Ctrl + K', description: 'Quick Actions' }
    ]
  },
  {
    title: 'Arrangement',
    items: [
      { key: 'Ctrl + A', description: 'Select all' },
      { key: 'Esc', description: 'Deselect all' },
      { key: 'Ctrl + G', description: 'Group selection' },
      { key: 'Ctrl + Shift + G', description: 'Ungroup' },
      { key: 'Ctrl + ]', description: 'Bring Forward' },
      { key: 'Ctrl + [', description: 'Send Backward' }
    ]
  },
  {
    title: 'Canvas & View',
    items: [
      { key: 'Ctrl + Scroll', description: 'Zoom In / Out' },
      { key: 'Shift + 0', description: 'Zoom to 100%' },
      { key: 'Shift + 1', description: 'Fit to Screen' },
      { key: 'Ctrl + \\', description: 'Toggle UI Panels' },
      { key: 'Ctrl + N', description: 'New File' }
    ]
  }
];

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useProjectStore();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="chigma-modal-backdrop" onClick={() => setShortcutsModalOpen(false)}>
      <div
        className="chigma-confirm-modal-card"
        style={{ width: 680, maxWidth: '95vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Keyboard size={18} color="var(--chigma-accent)" />
            <h3 className="confirm-modal-title" style={{ margin: 0 }}>Keyboard Shortcuts</h3>
          </div>
          <button className="confirm-modal-close-btn" style={{ position: 'static' }} onClick={() => setShortcutsModalOpen(false)}>
            <X size={15} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: 4
        }}>
          {SHORTCUTS.map((cat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--chigma-surface-soft)',
                border: '1px solid var(--chigma-hairline)',
                borderRadius: 10,
                padding: 12
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--chigma-text-tertiary)', letterSpacing: '0.05em', marginBottom: 8 }}>
                {cat.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--chigma-text-primary)'
                    }}
                  >
                    <span>{item.description}</span>
                    <kbd style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--chigma-hairline)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: 10.5,
                      fontFamily: 'var(--chigma-font-mono)',
                      fontWeight: 600,
                      color: 'var(--chigma-text-secondary)'
                    }}>
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="confirm-modal-footer" style={{ marginTop: 18 }}>
          <button className="confirm-btn cancel" onClick={() => setShortcutsModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
