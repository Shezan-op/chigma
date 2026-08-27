import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import { Link2, Link2Off, FlipHorizontal, FlipVertical } from 'lucide-react';

interface GeometrySectionProps {
  selectedNodes: ChigmaNode[];
}

export const GeometrySection: React.FC<GeometrySectionProps> = ({ selectedNodes }) => {
  const updateNodes = useDocumentStore((s) => s.updateNodes);
  const [aspectLocked, setAspectLocked] = React.useState(false);

  if (selectedNodes.length === 0) return null;
  const first = selectedNodes[0];

  const handleUpdate = (prop: keyof ChigmaNode, val: number) => {
    const updates = selectedNodes.map((n) => ({
      id: n.id,
      props: { [prop]: val }
    }));
    updateNodes(updates, true, `Change ${prop}`);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    // Flip rotation or scale
    const curRot = first.rotation || 0;
    const newRot = direction === 'horizontal' ? (180 - curRot) % 360 : (360 - curRot) % 360;
    handleUpdate('rotation', newRot);
  };

  return (
    <div className="inspector-section">
      <div className="section-label">POSITION &amp; SIZE</div>

      {/* X and Y */}
      <div className="prop-two-col-row">
        <div className="prop-input-badge-box">
          <span className="prop-input-prefix">X</span>
          <input
            type="number"
            className="prop-num-input"
            value={Math.round(first.x)}
            onChange={(e) => handleUpdate('x', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="prop-input-badge-box">
          <span className="prop-input-prefix">Y</span>
          <input
            type="number"
            className="prop-num-input"
            value={Math.round(first.y)}
            onChange={(e) => handleUpdate('y', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* W and H with Aspect Ratio link button */}
      <div className="prop-two-col-row" style={{ position: 'relative' }}>
        <div className="prop-input-badge-box">
          <span className="prop-input-prefix">W</span>
          <input
            type="number"
            className="prop-num-input"
            min={1}
            value={Math.round(first.width)}
            onChange={(e) => {
              const newW = Math.max(1, parseFloat(e.target.value) || 1);
              if (aspectLocked && first.width > 0) {
                const ratio = first.height / first.width;
                handleUpdate('width', newW);
                handleUpdate('height', Math.round(newW * ratio));
              } else {
                handleUpdate('width', newW);
              }
            }}
          />
        </div>
        <div className="prop-input-badge-box">
          <span className="prop-input-prefix">H</span>
          <input
            type="number"
            className="prop-num-input"
            min={0}
            value={Math.round(first.height)}
            onChange={(e) => {
              const newH = Math.max(0, parseFloat(e.target.value) || 0);
              if (aspectLocked && first.height > 0) {
                const ratio = first.width / first.height;
                handleUpdate('height', newH);
                handleUpdate('width', Math.round(newH * ratio));
              } else {
                handleUpdate('height', newH);
              }
            }}
          />
        </div>
      </div>

      {/* Rotation & Flip Actions */}
      <div className="prop-row align-between">
        <div className="prop-input-badge-box" style={{ width: '55%' }}>
          <span className="prop-input-prefix">∠</span>
          <input
            type="number"
            className="prop-num-input"
            value={Math.round(first.rotation || 0)}
            onChange={(e) => handleUpdate('rotation', parseFloat(e.target.value) || 0)}
          />
          <span style={{ fontSize: 11, color: 'var(--chigma-text-tertiary)' }}>°</span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className={`prop-icon-btn xs ${aspectLocked ? 'active' : ''}`}
            onClick={() => setAspectLocked(!aspectLocked)}
            title={aspectLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
          >
            {aspectLocked ? <Link2 size={13} /> : <Link2Off size={13} />}
          </button>
          <button
            className="prop-icon-btn xs"
            onClick={() => handleFlip('horizontal')}
            title="Flip Horizontal"
          >
            <FlipHorizontal size={13} />
          </button>
          <button
            className="prop-icon-btn xs"
            onClick={() => handleFlip('vertical')}
            title="Flip Vertical"
          >
            <FlipVertical size={13} />
          </button>
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="prop-row">
        <span className="prop-label" style={{ width: 50 }}>Opacity</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((first.opacity ?? 1) * 100)}
          onChange={(e) =>
            handleUpdate('opacity', Math.min(1, Math.max(0, (parseFloat(e.target.value) || 100) / 100)))
          }
          style={{ flex: 1, accentColor: 'var(--chigma-accent)' }}
        />
        <span style={{ fontSize: 11, fontFamily: 'var(--chigma-font-mono)', minWidth: 32, textAlign: 'right' }}>
          {Math.round((first.opacity ?? 1) * 100)}%
        </span>
      </div>
    </div>
  );
};
