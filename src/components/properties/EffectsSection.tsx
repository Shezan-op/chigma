import React from 'react';
import type { ChigmaNode } from '../../models/node';
import type { Effect, EffectType } from '../../models/styles';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface EffectsSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({ node, onUpdate }) => {
  const effects: Effect[] = node.effects || [];

  const handleUpdateEffects = (newEffects: Effect[]) => {
    onUpdate({ effects: newEffects });
  };

  const addEffect = (type: EffectType = 'drop-shadow') => {
    const newEffect: Effect = {
      id: `eff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      visible: true,
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: '#000000',
      opacity: 0.15
    };
    handleUpdateEffects([...effects, newEffect]);
  };

  const removeEffect = (id: string) => {
    handleUpdateEffects(effects.filter((e) => e.id !== id));
  };

  const toggleVisibility = (id: string) => {
    handleUpdateEffects(
      effects.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e))
    );
  };

  const updateEffect = (id: string, updates: Partial<Effect>) => {
    handleUpdateEffects(
      effects.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  return (
    <div className="inspector-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">EFFECTS</span>
        <button
          onClick={() => addEffect('drop-shadow')}
          className="prop-icon-btn xs"
          title="Add shadow or blur effect"
        >
          <Plus size={13} />
        </button>
      </div>

      {effects.map((eff, index) => (
        <div
          key={eff.id || index}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              className="prop-select"
              value={eff.type}
              onChange={(e) => updateEffect(eff.id, { type: e.target.value as EffectType })}
            >
              <option value="drop-shadow">Drop Shadow</option>
              <option value="inner-shadow">Inner Shadow</option>
              <option value="layer-blur">Layer Blur</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => toggleVisibility(eff.id)}
                className="prop-icon-btn xs"
                style={{ color: eff.visible ? 'var(--chigma-text-primary)' : 'var(--chigma-text-tertiary)' }}
              >
                {eff.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button
                onClick={() => removeEffect(eff.id)}
                className="prop-icon-btn xs danger"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {(eff.type === 'drop-shadow' || eff.type === 'inner-shadow') && (
            <div className="prop-two-col-row">
              <div className="prop-input-badge-box">
                <span className="prop-input-prefix">Blur</span>
                <input
                  type="number"
                  min={0}
                  className="prop-num-input"
                  value={eff.blur}
                  onChange={(e) => updateEffect(eff.id, { blur: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                />
              </div>

              <div className="color-field-container">
                <div className="color-swatch-box" style={{ backgroundColor: eff.color || '#000000' }}>
                  <input
                    type="color"
                    className="hidden-color-picker"
                    value={eff.color || '#000000'}
                    onChange={(e) => updateEffect(eff.id, { color: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  className="color-hex-text-input"
                  value={eff.color || '#000000'}
                  onChange={(e) => updateEffect(eff.id, { color: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
