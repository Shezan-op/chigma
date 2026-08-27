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
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion'
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
      color: '#FFFFFF',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Fills</span>
        <button
          onClick={addFill}
          title="Add fill layer"
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

      {fills.map((fill, index) => (
        <div
          key={fill.id || index}
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
          {/* Fill Type & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={fill.type}
              onChange={(e) => {
                const type = e.target.value as 'solid' | 'gradient';
                if (type === 'gradient') {
                  const initialGrad: LinearGradient = {
                    type: 'linear-gradient',
                    angle: 90,
                    stops: [
                      { id: 's1', color: fill.color || '#0066FF', offset: 0, opacity: 1 },
                      { id: 's2', color: '#C5B0F4', offset: 1, opacity: 1 }
                    ]
                  };
                  updateFill(fill.id, { type: 'gradient', gradient: initialGrad });
                } else {
                  updateFill(fill.id, { type: 'solid' });
                }
              }}
              style={{
                fontSize: '11px',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              <option value="solid">Solid</option>
              <option value="gradient">Linear Gradient</option>
            </select>

            {fill.type === 'solid' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                <input
                  type="color"
                  value={fill.color || '#FFFFFF'}
                  onChange={(e) => updateFill(fill.id, { color: e.target.value })}
                  style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                    border: '1px solid #D4D4D8',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={fill.color || '#FFFFFF'}
                  onChange={(e) => updateFill(fill.id, { color: e.target.value })}
                  style={{
                    width: '68px',
                    fontSize: '11px',
                    padding: '3px 4px',
                    border: '1px solid #E6E6E6',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                />
              </div>
            )}

            <button
              onClick={() => toggleFillVisibility(fill.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: fill.visible ? '#000000' : '#A3A3A3',
                padding: '2px'
              }}
            >
              {fill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

            {fills.length > 1 && (
              <button
                onClick={() => removeFill(fill.id)}
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
            )}
          </div>

          {/* Gradient Controls */}
          {fill.type === 'gradient' && fill.gradient && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '6px',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                border: '1px solid #E6E6E6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: '#737373' }}>Angle</span>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={(fill.gradient as LinearGradient).angle || 90}
                  onChange={(e) => {
                    const angle = parseInt(e.target.value, 10) || 0;
                    updateFill(fill.id, {
                      gradient: { ...fill.gradient!, angle } as LinearGradient
                    });
                  }}
                  style={{
                    width: '54px',
                    fontSize: '11px',
                    padding: '2px 4px',
                    border: '1px solid #E6E6E6',
                    borderRadius: '4px'
                  }}
                />
              </div>

              {/* Gradient Stops */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {fill.gradient.stops.map((stop, sIdx) => (
                  <div key={stop.id || sIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#737373', width: '38px' }}>
                      {Math.round(stop.offset * 100)}%
                    </span>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => {
                        const newStops = [...fill.gradient!.stops];
                        newStops[sIdx] = { ...stop, color: e.target.value };
                        updateFill(fill.id, {
                          gradient: { ...fill.gradient!, stops: newStops } as LinearGradient
                        });
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: 0,
                        border: '1px solid #D4D4D8',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(stop.offset * 100)}
                      onChange={(e) => {
                        const newStops = [...fill.gradient!.stops];
                        newStops[sIdx] = { ...stop, offset: parseInt(e.target.value, 10) / 100 };
                        updateFill(fill.id, {
                          gradient: { ...fill.gradient!, stops: newStops } as LinearGradient
                        });
                      }}
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blend Mode */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#737373' }}>Blend Mode</span>
            <select
              value={fill.blendMode || 'normal'}
              onChange={(e) => updateFill(fill.id, { blendMode: e.target.value as BlendMode })}
              style={{
                fontSize: '10px',
                padding: '2px 4px',
                borderRadius: '3px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              {BLEND_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
