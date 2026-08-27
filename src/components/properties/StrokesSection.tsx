import React from 'react';
import type { ChigmaNode } from '../../models/node';
import type { StrokeAlign, StrokeStyle } from '../../models/styles';

interface StrokesSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

export const StrokesSection: React.FC<StrokesSectionProps> = ({ node, onUpdate }) => {
  const strokeColor = node.stroke || '#71717A';
  const strokeWidth = node.strokeWidth !== undefined ? node.strokeWidth : 1;
  const strokeStyle = node.strokeStyle || 'solid';
  const strokeAlign = node.strokeAlign || 'center';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Stroke</span>
      </div>

      <div
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="color"
            value={strokeColor === 'none' ? '#000000' : strokeColor}
            onChange={(e) => onUpdate({ stroke: e.target.value })}
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
            value={strokeColor}
            onChange={(e) => onUpdate({ stroke: e.target.value })}
            style={{
              width: '74px',
              fontSize: '11px',
              padding: '3px 4px',
              border: '1px solid #E6E6E6',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}
          />
          <input
            type="number"
            min="0"
            max="40"
            value={strokeWidth}
            onChange={(e) => onUpdate({ strokeWidth: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            style={{
              width: '48px',
              fontSize: '11px',
              padding: '3px 4px',
              border: '1px solid #E6E6E6',
              borderRadius: '4px'
            }}
            placeholder="Width"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>Style</span>
            <select
              value={strokeStyle}
              onChange={(e) => onUpdate({ strokeStyle: e.target.value as StrokeStyle })}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>Align</span>
            <select
              value={strokeAlign}
              onChange={(e) => onUpdate({ strokeAlign: e.target.value as StrokeAlign })}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="center">Center</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
