import React, { useState } from 'react';
import type { CornerRadii } from '../../models/styles';
import { Link2, Unlink } from 'lucide-react';

interface CornerRadiusControlProps {
  value?: number | CornerRadii;
  onChange: (value: number | CornerRadii) => void;
}

export const CornerRadiusControl: React.FC<CornerRadiusControlProps> = ({ value = 0, onChange }) => {
  const isIndividual = typeof value === 'object' && value !== null && !value.linked;
  const [showIndividual, setShowIndividual] = useState(isIndividual);

  const getRadii = (): { tl: number; tr: number; br: number; bl: number } => {
    if (typeof value === 'number') {
      return { tl: value, tr: value, br: value, bl: value };
    }
    return {
      tl: value.topLeft || 0,
      tr: value.topRight || 0,
      br: value.bottomRight || 0,
      bl: value.bottomLeft || 0
    };
  };

  const radii = getRadii();
  const unifiedValue = typeof value === 'number' ? value : value.topLeft || 0;

  const handleUnifiedChange = (newVal: number) => {
    const clamped = Math.max(0, newVal);
    onChange(clamped);
  };

  const handleIndividualChange = (corner: 'tl' | 'tr' | 'br' | 'bl', newVal: number) => {
    const clamped = Math.max(0, newVal);
    const updated: CornerRadii = {
      topLeft: corner === 'tl' ? clamped : radii.tl,
      topRight: corner === 'tr' ? clamped : radii.tr,
      bottomRight: corner === 'br' ? clamped : radii.br,
      bottomLeft: corner === 'bl' ? clamped : radii.bl,
      linked: false
    };
    onChange(updated);
  };

  const toggleLinked = () => {
    if (showIndividual) {
      // Collapse back to unified
      setShowIndividual(false);
      onChange(radii.tl);
    } else {
      // Expand to individual corners
      setShowIndividual(true);
      onChange({
        topLeft: unifiedValue,
        topRight: unifiedValue,
        bottomRight: unifiedValue,
        bottomLeft: unifiedValue,
        linked: false
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Corner Radius</span>
        <button
          onClick={toggleLinked}
          title={showIndividual ? 'Link all corners' : 'Independent corner radii'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: showIndividual ? '#0066FF' : '#737373',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {showIndividual ? <Unlink size={14} /> : <Link2 size={14} />}
        </button>
      </div>

      {!showIndividual ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="number"
            min="0"
            max="999"
            value={unifiedValue}
            onChange={(e) => handleUnifiedChange(parseInt(e.target.value, 10) || 0)}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #E6E6E6',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '2px' }}>
            {[0, 4, 8, 16, 999].map((preset) => (
              <button
                key={preset}
                onClick={() => handleUnifiedChange(preset)}
                style={{
                  padding: '2px 5px',
                  fontSize: '10px',
                  border: '1px solid #E6E6E6',
                  borderRadius: '3px',
                  backgroundColor: unifiedValue === preset ? '#000000' : '#F7F7F5',
                  color: unifiedValue === preset ? '#FFFFFF' : '#525252',
                  cursor: 'pointer'
                }}
              >
                {preset === 999 ? 'Pill' : preset}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#737373', width: '16px' }}>TL</span>
            <input
              type="number"
              min="0"
              value={radii.tl}
              onChange={(e) => handleIndividualChange('tl', parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100%',
                padding: '4px 6px',
                fontSize: '11px',
                border: '1px solid #E6E6E6',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#737373', width: '16px' }}>TR</span>
            <input
              type="number"
              min="0"
              value={radii.tr}
              onChange={(e) => handleIndividualChange('tr', parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100%',
                padding: '4px 6px',
                fontSize: '11px',
                border: '1px solid #E6E6E6',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#737373', width: '16px' }}>BL</span>
            <input
              type="number"
              min="0"
              value={radii.bl}
              onChange={(e) => handleIndividualChange('bl', parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100%',
                padding: '4px 6px',
                fontSize: '11px',
                border: '1px solid #E6E6E6',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#737373', width: '16px' }}>BR</span>
            <input
              type="number"
              min="0"
              value={radii.br}
              onChange={(e) => handleIndividualChange('br', parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100%',
                padding: '4px 6px',
                fontSize: '11px',
                border: '1px solid #E6E6E6',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
