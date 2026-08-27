import React from 'react';
import type { ChigmaNode, ResponsiveConstraints, SizingConstraints } from '../../models/node';

interface ConstraintsSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

export const ConstraintsSection: React.FC<ConstraintsSectionProps> = ({ node, onUpdate }) => {
  const constraints: ResponsiveConstraints = node.constraints || {
    horizontal: 'left',
    vertical: 'top'
  };

  const sizing: SizingConstraints = node.sizing || {
    horizontal: 'fixed',
    vertical: 'fixed'
  };

  const handleHorizontalChange = (horizontal: ResponsiveConstraints['horizontal']) => {
    onUpdate({
      constraints: { ...constraints, horizontal }
    });
  };

  const handleVerticalChange = (vertical: ResponsiveConstraints['vertical']) => {
    onUpdate({
      constraints: { ...constraints, vertical }
    });
  };

  const handleSizingChange = (
    axis: 'horizontal' | 'vertical',
    mode: 'fixed' | 'hug' | 'fill'
  ) => {
    onUpdate({
      sizing: { ...sizing, [axis]: mode }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Constraints &amp; Resizing</span>
      </div>

      <div
        style={{
          padding: '8px',
          border: '1px solid #E6E6E6',
          borderRadius: '6px',
          backgroundColor: '#FCFCFB',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Horizontal & Vertical Constraint Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>
              Horizontal
            </span>
            <select
              value={constraints.horizontal}
              onChange={(e) => handleHorizontalChange(e.target.value as any)}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="left_right">Left &amp; Right (Fill)</option>
              <option value="scale">Scale</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>
              Vertical
            </span>
            <select
              value={constraints.vertical}
              onChange={(e) => handleVerticalChange(e.target.value as any)}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
              <option value="top_bottom">Top &amp; Bottom (Fill)</option>
              <option value="scale">Scale</option>
            </select>
          </div>
        </div>

        {/* Sizing Modes (Fixed / Hug / Fill) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>
              Width Sizing
            </span>
            <select
              value={sizing.horizontal}
              onChange={(e) => handleSizingChange('horizontal', e.target.value as any)}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="fixed">Fixed Width</option>
              <option value="hug">Hug Contents</option>
              <option value="fill">Fill Container</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '2px' }}>
              Height Sizing
            </span>
            <select
              value={sizing.vertical}
              onChange={(e) => handleSizingChange('vertical', e.target.value as any)}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 4px',
                borderRadius: '4px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="fixed">Fixed Height</option>
              <option value="hug">Hug Contents</option>
              <option value="fill">Fill Container</option>
            </select>
          </div>
        </div>

        {/* Min / Max Dimensions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#737373', width: '42px' }}>Min W</span>
            <input
              type="number"
              placeholder="None"
              value={node.minWidth || ''}
              onChange={(e) =>
                onUpdate({ minWidth: e.target.value ? parseInt(e.target.value, 10) : undefined })
              }
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
            <span style={{ fontSize: '10px', color: '#737373', width: '42px' }}>Max W</span>
            <input
              type="number"
              placeholder="None"
              value={node.maxWidth || ''}
              onChange={(e) =>
                onUpdate({ maxWidth: e.target.value ? parseInt(e.target.value, 10) : undefined })
              }
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
      </div>
    </div>
  );
};
