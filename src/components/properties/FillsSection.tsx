import React from 'react';
import type { ChigmaNode } from '../../models/node';
import type { FillPaint, BlendMode, LinearGradient } from '../../models/styles';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface FillsSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

const BLEND_MODES: BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten'
];

export const FillsSection: React.FC<FillsSectionProps> = ({ node, onUpdate }) => {
  const fills: FillPaint[] = node.fills && node.fills.length > 0
    ? node.fills
    : [
        {
          id: 'fill_default',
          type: 'solid',
          visible: true,
          opacity: 1,
          color: node.fill || '#FFFFFF',
          blendMode: 'normal'
        }
      ];

  const handleUpdateFills = (newFills: FillPaint[]) => {
    const activeFill = newFills.find((f) => f.visible);
    const legacyFill = activeFill && activeFill.type === 'solid' ? activeFill.color : node.fill;
    onUpdate({
      fills: newFills,
      fill: legacyFill
    });
  };

  const addFill = () => {
    const newFill: FillPaint = {
      id: `fill_${Date.now()}`,
      type: 'solid',
      visible: true,
      opacity: 1,
      color: '#E4E4E7',
      blendMode: 'normal'
    };
    handleUpdateFills([...fills, newFill]);
  };

  const removeFill = (id: string) => {
    if (fills.length <= 1) return;
    handleUpdateFills(fills.filter((f) => f.id !== id));
  };

  const toggleFillVisibility = (id: string) => {
    handleUpdateFills(
      fills.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  const updateFill = (id: string, updates: Partial<FillPaint>) => {
    handleUpdateFills(
      fills.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  return (
    <div className="inspector-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">FILL</span>
        <button
          onClick={addFill}
          className="prop-icon-btn xs"
          title="Add fill layer"
        >
          <Plus size={13} />
        </button>
      </div>

      {fills.map((fill, index) => (
        <div
          key={fill.id || index}
          style={{
            padding: '6px 8px',
            border: '1px solid var(--chigma-hairline)',
            borderRadius: 'var(--chigma-radius-sm)',
            backgroundColor: 'var(--chigma-surface-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Color Swatch and Hex */}
            <div className="color-field-container" style={{ flex: 1 }}>
              <div
                className="color-swatch-box"
                style={{ backgroundColor: fill.color || '#FFFFFF' }}
              >
                <input
                  type="color"
                  className="hidden-color-picker"
                  value={fill.color || '#FFFFFF'}
                  onChange={(e) => updateFill(fill.id, { color: e.target.value })}
                />
              </div>
              <input
                type="text"
                className="color-hex-text-input"
                value={fill.color || '#FFFFFF'}
                onChange={(e) => updateFill(fill.id, { color: e.target.value })}
              />
            </div>

            {/* Opacity select */}
            <select
              className="prop-select"
              style={{ fontSize: 11, padding: '2px 4px' }}
              value={fill.opacity ?? 1}
              onChange={(e) => updateFill(fill.id, { opacity: parseFloat(e.target.value) })}
            >
              <option value="1">100%</option>
              <option value="0.8">80%</option>
              <option value="0.5">50%</option>
              <option value="0.2">20%</option>
            </select>

            {/* Visibility Eye */}
            <button
              onClick={() => toggleFillVisibility(fill.id)}
              className="prop-icon-btn xs"
              style={{ color: fill.visible ? 'var(--chigma-text-primary)' : 'var(--chigma-text-tertiary)' }}
            >
              {fill.visible ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>

            {/* Delete */}
            {fills.length > 1 && (
              <button
                onClick={() => removeFill(fill.id)}
                className="prop-icon-btn xs danger"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
