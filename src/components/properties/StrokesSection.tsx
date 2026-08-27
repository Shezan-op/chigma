import React from 'react';
import type { ChigmaNode } from '../../models/node';
import type { StrokeAlign, StrokeStyle } from '../../models/styles';
import { Plus } from 'lucide-react';

interface StrokesSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

export const StrokesSection: React.FC<StrokesSectionProps> = ({ node, onUpdate }) => {
  const strokeColor = node.stroke || '#71717A';
  const strokeWidth = node.strokeWidth !== undefined ? node.strokeWidth : 1;
  const strokeStyle = node.strokeStyle || 'solid';
  const strokeAlign = node.strokeAlign || 'center';
  const isEnabled = Boolean(node.stroke && node.stroke !== 'none' && strokeWidth > 0);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onUpdate({ stroke: '#71717A', strokeWidth: 1, strokeStyle: 'solid' });
    } else {
      onUpdate({ stroke: 'none', strokeWidth: 0 });
    }
  };

  return (
    <div className="inspector-section">
      <div className="prop-row align-between">
        <span className="section-label">STROKE</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {isEnabled && (
        <div
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
          {/* Swatch, Hex, Width */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="color-field-container" style={{ flex: 1 }}>
              <div
                className="color-swatch-box"
                style={{ backgroundColor: strokeColor === 'none' ? '#71717A' : strokeColor }}
              >
                <input
                  type="color"
                  className="hidden-color-picker"
                  value={strokeColor === 'none' ? '#71717A' : strokeColor}
                  onChange={(e) => onUpdate({ stroke: e.target.value })}
                />
              </div>
              <input
                type="text"
                className="color-hex-text-input"
                value={strokeColor === 'none' ? '#71717A' : strokeColor}
                onChange={(e) => onUpdate({ stroke: e.target.value })}
              />
            </div>

            {/* Width input */}
            <div className="prop-input-badge-box" style={{ width: 60 }}>
              <input
                type="number"
                min={0}
                max={40}
                className="prop-num-input"
                value={strokeWidth}
                onChange={(e) => onUpdate({ strokeWidth: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              />
              <span style={{ fontSize: 10, color: 'var(--chigma-text-tertiary)' }}>px</span>
            </div>
          </div>

          {/* Style & Alignment */}
          <div className="prop-two-col-row">
            <select
              className="prop-select"
              value={strokeStyle}
              onChange={(e) => onUpdate({ strokeStyle: e.target.value as StrokeStyle })}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>

            <select
              className="prop-select"
              value={strokeAlign}
              onChange={(e) => onUpdate({ strokeAlign: e.target.value as StrokeAlign })}
            >
              <option value="center">Center</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
