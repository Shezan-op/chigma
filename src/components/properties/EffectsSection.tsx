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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Effects</span>
        <button
          onClick={() => addEffect('drop-shadow')}
          title="Add shadow or blur effect"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: '#0066FF',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {effects.length === 0 && (
        <div
          style={{
            padding: '8px',
            fontSize: '11px',
            color: '#A3A3A3',
            textAlign: 'center',
            border: '1px dashed #E6E6E6',
            borderRadius: '6px'
          }}
        >
          No effects applied
        </div>
      )}

      {effects.map((eff, index) => (
        <div
          key={eff.id || index}
          style={{
            padding: '8px',
            border: '1px solid #E6E6E6',
            borderRadius: '6px',
            backgroundColor: '#FCFCFB',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              value={eff.type}
              onChange={(e) => updateEffect(eff.id, { type: e.target.value as EffectType })}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              <option value="drop-shadow">Drop Shadow</option>
              <option value="inner-shadow">Inner Shadow</option>
              <option value="layer-blur">Layer Blur</option>
              <option value="background-blur">Background Blur</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => toggleVisibility(eff.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: eff.visible ? '#000000' : '#A3A3A3',
                  padding: '2px'
                }}
              >
                {eff.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => removeEffect(eff.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#EF4444',
                  padding: '2px'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Shadow properties */}
          {(eff.type === 'drop-shadow' || eff.type === 'inner-shadow') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#737373', width: '12px' }}>X</span>
                  <input
                    type="number"
                    value={eff.x}
                    onChange={(e) => updateEffect(eff.id, { x: parseInt(e.target.value, 10) || 0 })}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '2px 4px',
                      border: '1px solid #E6E6E6',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#737373', width: '12px' }}>Y</span>
                  <input
                    type="number"
                    value={eff.y}
                    onChange={(e) => updateEffect(eff.id, { y: parseInt(e.target.value, 10) || 0 })}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '2px 4px',
                      border: '1px solid #E6E6E6',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#737373', width: '24px' }}>Blur</span>
                  <input
                    type="number"
                    min="0"
                    value={eff.blur}
                    onChange={(e) => updateEffect(eff.id, { blur: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '2px 4px',
                      border: '1px solid #E6E6E6',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#737373', width: '32px' }}>Color</span>
                  <input
                    type="color"
                    value={eff.color}
                    onChange={(e) => updateEffect(eff.id, { color: e.target.value })}
                    style={{
                      width: '24px',
                      height: '24px',
                      padding: 0,
                      border: '1px solid #D4D4D8',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Blur properties */}
          {(eff.type === 'layer-blur' || eff.type === 'background-blur') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#737373' }}>Blur Radius</span>
              <input
                type="number"
                min="0"
                value={eff.blur}
                onChange={(e) => updateEffect(eff.id, { blur: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                style={{
                  flex: 1,
                  fontSize: '11px',
                  padding: '2px 4px',
                  border: '1px solid #E6E6E6',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
