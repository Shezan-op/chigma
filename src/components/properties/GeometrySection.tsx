import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';

interface GeometrySectionProps {
  selectedNodes: ChigmaNode[];
}

export const GeometrySection: React.FC<GeometrySectionProps> = ({ selectedNodes }) => {
  const updateNodes = useDocumentStore((s) => s.updateNodes);

  if (selectedNodes.length === 0) return null;
  const first = selectedNodes[0];

  const handleUpdate = (prop: keyof ChigmaNode, val: number) => {
    const updates = selectedNodes.map((n) => ({
      id: n.id,
      props: { [prop]: val }
    }));
    updateNodes(updates, true, `Change ${prop}`);
  };

  const hasCornerRadius =
    'cornerRadius' in first && typeof (first as any).cornerRadius === 'number';

  return (
    <div className="property-group">
      <div className="property-group-title">Layout &amp; Position</div>

      <div className="property-grid-2">
        <div className="property-field">
          <label>X</label>
          <input
            type="number"
            value={Math.round(first.x)}
            onChange={(e) => handleUpdate('x', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="property-field">
          <label>Y</label>
          <input
            type="number"
            value={Math.round(first.y)}
            onChange={(e) => handleUpdate('y', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="property-grid-2">
        <div className="property-field">
          <label>W</label>
          <input
            type="number"
            min={1}
            value={Math.round(first.width)}
            onChange={(e) => handleUpdate('width', Math.max(1, parseFloat(e.target.value) || 1))}
          />
        </div>
        <div className="property-field">
          <label>H</label>
          <input
            type="number"
            min={0}
            value={Math.round(first.height)}
            onChange={(e) => handleUpdate('height', Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>
      </div>

      <div className="property-grid-2">
        <div className="property-field">
          <label>Angle °</label>
          <input
            type="number"
            value={Math.round(first.rotation || 0)}
            onChange={(e) => handleUpdate('rotation', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="property-field">
          <label>Opacity %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={Math.round((first.opacity ?? 1) * 100)}
            onChange={(e) =>
              handleUpdate('opacity', Math.min(1, Math.max(0, (parseFloat(e.target.value) || 100) / 100)))
            }
          />
        </div>
      </div>

      {hasCornerRadius && (
        <div className="property-field full">
          <label>Corner Radius</label>
          <input
            type="number"
            min={0}
            value={(first as any).cornerRadius || 0}
            onChange={(e) =>
              handleUpdate('cornerRadius' as any, Math.max(0, parseFloat(e.target.value) || 0))
            }
          />
        </div>
      )}
    </div>
  );
};
