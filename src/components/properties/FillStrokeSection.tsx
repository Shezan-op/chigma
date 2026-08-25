import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { StrokeStyle } from '../../models/styles';
import { PRESET_COLORS, FIGMA_PASTEL_COLORS } from '../../utils/color';

interface FillStrokeSectionProps {
  selectedNodes: ChigmaNode[];
}

export const FillStrokeSection: React.FC<FillStrokeSectionProps> = ({ selectedNodes }) => {
  const updateNodes = useDocumentStore((s) => s.updateNodes);

  if (selectedNodes.length === 0) return null;
  const first = selectedNodes[0];

  const hasFill = 'fill' in first;
  const hasStroke = 'stroke' in first;

  const handleUpdate = (prop: string, val: any) => {
    const updates = selectedNodes.map((n) => ({
      id: n.id,
      props: { [prop]: val }
    }));
    updateNodes(updates, true, `Change ${prop}`);
  };

  if (!hasFill && !hasStroke) return null;

  return (
    <div className="property-group">
      <div className="property-group-title">Fill &amp; Stroke</div>

      {/* Fill Color */}
      {hasFill && (
        <div className="property-field full">
          <label>Fill Color</label>
          <div className="color-picker-row">
            <input
              type="color"
              className="color-swatch-input"
              value={(first as any).fill || '#FFFFFF'}
              onChange={(e) => handleUpdate('fill', e.target.value)}
            />
            <input
              type="text"
              className="color-hex-input"
              value={(first as any).fill || ''}
              onChange={(e) => handleUpdate('fill', e.target.value)}
              placeholder="transparent"
            />
            <button
              className="btn-icon xs"
              onClick={() => handleUpdate('fill', 'transparent')}
              title="Clear Fill"
            >
              None
            </button>
          </div>

          {/* Figma Signature Pastel Swatches */}
          <div style={{ marginTop: 6, marginBottom: 2, fontSize: '11px', color: '#888888', fontWeight: 500 }}>
            Figma Pastel Blocks
          </div>
          <div className="color-presets-row">
            {FIGMA_PASTEL_COLORS.map((p) => (
              <span
                key={p.value}
                className="preset-dot"
                style={{ backgroundColor: p.value }}
                onClick={() => handleUpdate('fill', p.value)}
                title={`Figma ${p.name} (${p.value})`}
              />
            ))}
          </div>

          {/* Classic Monochrome Presets */}
          <div className="color-presets-row" style={{ marginTop: 4 }}>
            {PRESET_COLORS.slice(0, 8).map((c) => (
              <span
                key={c}
                className="preset-dot"
                style={{ backgroundColor: c }}
                onClick={() => handleUpdate('fill', c)}
                title={c}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stroke */}
      {hasStroke && (
        <>
          <div className="property-field full">
            <label>Stroke Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-swatch-input"
                value={(first as any).stroke || '#000000'}
                onChange={(e) => handleUpdate('stroke', e.target.value)}
              />
              <input
                type="text"
                className="color-hex-input"
                value={(first as any).stroke || ''}
                onChange={(e) => handleUpdate('stroke', e.target.value)}
                placeholder="none"
              />
              <button
                className="btn-icon xs"
                onClick={() => handleUpdate('stroke', 'none')}
                title="Clear Stroke"
              >
                None
              </button>
            </div>
          </div>

          <div className="property-grid-2">
            <div className="property-field">
              <label>Width</label>
              <input
                type="number"
                min={0}
                max={50}
                value={(first as any).strokeWidth ?? 1}
                onChange={(e) =>
                  handleUpdate('strokeWidth', Math.max(0, parseFloat(e.target.value) || 0))
                }
              />
            </div>
            <div className="property-field">
              <label>Style</label>
              <select
                value={(first as any).strokeStyle || 'solid'}
                onChange={(e) => handleUpdate('strokeStyle', e.target.value as StrokeStyle)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
