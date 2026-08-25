import React from 'react';
import type { ChigmaNode, FrameNode, GroupNode, AutoLayoutConfig } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import { LayoutGrid, Rows, Columns } from 'lucide-react';

interface AutoLayoutSectionProps {
  selectedNodes: ChigmaNode[];
}

export const AutoLayoutSection: React.FC<AutoLayoutSectionProps> = ({ selectedNodes }) => {
  const { stackNodes, updateNode } = useDocumentStore();

  if (selectedNodes.length === 0) return null;

  const isMultiSelection = selectedNodes.length > 1;
  const first = selectedNodes[0];
  const isContainer = first.type === 'frame' || first.type === 'group';

  const defaultAutoLayout: AutoLayoutConfig = {
    enabled: false,
    direction: 'horizontal',
    gap: 16,
    paddingX: 16,
    paddingY: 16,
    alignItems: 'start',
    justifyContent: 'start'
  };

  const autoLayout: AutoLayoutConfig = (first as FrameNode | GroupNode).autoLayout || defaultAutoLayout;

  const handleToggleAutoLayout = () => {
    updateNode(first.id, {
      autoLayout: {
        ...autoLayout,
        enabled: !autoLayout.enabled
      }
    }, true, 'Toggle Auto-Layout');
  };

  const handleUpdateConfig = (partial: Partial<AutoLayoutConfig>) => {
    updateNode(first.id, {
      autoLayout: {
        ...autoLayout,
        ...partial
      }
    }, true, 'Update Auto-Layout');
  };

  const SPACING_TOKENS = [
    { label: '4', val: 4 },
    { label: '8', val: 8 },
    { label: '12', val: 12 },
    { label: '16', val: 16 },
    { label: '24', val: 24 },
    { label: '32', val: 32 },
    { label: '48', val: 48 }
  ];

  return (
    <div className="property-group">
      <div className="property-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Auto-Layout &amp; Spacing</span>
        {isContainer && (
          <button
            className={`btn-icon xs ${autoLayout.enabled ? 'active' : ''}`}
            onClick={handleToggleAutoLayout}
            title={autoLayout.enabled ? 'Disable Auto-Layout' : 'Enable Auto-Layout'}
          >
            <LayoutGrid size={12} />
          </button>
        )}
      </div>

      {/* Multi-Selection Quick Stacks */}
      {isMultiSelection && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          <label style={{ fontSize: '11px', color: '#71717A', fontWeight: 500 }}>
            Stack Selected ({selectedNodes.length} elements)
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, borderRadius: '50px' }}
              onClick={() => stackNodes('horizontal', 16, selectedNodes.map((n) => n.id))}
              title="Arrange items in a horizontal row"
            >
              <Columns size={13} />
              <span>Row Stack</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, borderRadius: '50px' }}
              onClick={() => stackNodes('vertical', 16, selectedNodes.map((n) => n.id))}
              title="Arrange items in a vertical column"
            >
              <Rows size={13} />
              <span>Column Stack</span>
            </button>
          </div>

          {/* Quick Gap Token Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: '10px', color: '#888888', marginRight: 4 }}>Gap:</span>
            {SPACING_TOKENS.map((token) => (
              <button
                key={token.val}
                className="category-chip"
                style={{ padding: '2px 6px', fontSize: '10px' }}
                onClick={() => stackNodes('horizontal', token.val, selectedNodes.map((n) => n.id))}
                title={`Set ${token.val}px gap`}
              >
                {token.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Frame Auto-Layout Configuration */}
      {isContainer && autoLayout.enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#F7F7F5', padding: 8, borderRadius: 8 }}>
          {/* Direction toggle */}
          <div className="property-grid-2">
            <div className="property-field">
              <label>Direction</label>
              <div style={{ display: 'flex', gap: 2 }}>
                <button
                  className={`btn-icon sm ${autoLayout.direction === 'horizontal' ? 'active' : ''}`}
                  onClick={() => handleUpdateConfig({ direction: 'horizontal' })}
                  title="Horizontal Row"
                >
                  <Columns size={13} />
                </button>
                <button
                  className={`btn-icon sm ${autoLayout.direction === 'vertical' ? 'active' : ''}`}
                  onClick={() => handleUpdateConfig({ direction: 'vertical' })}
                  title="Vertical Column"
                >
                  <Rows size={13} />
                </button>
              </div>
            </div>

            <div className="property-field">
              <label>Gap (px)</label>
              <input
                type="number"
                min={0}
                max={200}
                value={autoLayout.gap}
                onChange={(e) => handleUpdateConfig({ gap: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
          </div>

          {/* Padding */}
          <div className="property-grid-2">
            <div className="property-field">
              <label>Padding X</label>
              <input
                type="number"
                min={0}
                max={200}
                value={autoLayout.paddingX}
                onChange={(e) => handleUpdateConfig({ paddingX: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
            <div className="property-field">
              <label>Padding Y</label>
              <input
                type="number"
                min={0}
                max={200}
                value={autoLayout.paddingY}
                onChange={(e) => handleUpdateConfig({ paddingY: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
