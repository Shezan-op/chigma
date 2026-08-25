import React from 'react';
import type { BarChartNode, LineChartNode, PieChartNode, DonutChartNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import { Plus, Trash2 } from 'lucide-react';

interface ChartSectionProps {
  node: BarChartNode | LineChartNode | PieChartNode | DonutChartNode;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ node }) => {
  const updateNode = useDocumentStore((s) => s.updateNode);

  const handleUpdate = (props: any) => {
    updateNode(node.id, props, true, 'Update chart');
  };

  const data = node.data || [];

  const handleDataItemChange = (index: number, field: 'label' | 'value', val: any) => {
    const nextData = [...data];
    nextData[index] = {
      ...nextData[index],
      [field]: field === 'value' ? parseFloat(val) || 0 : val
    };
    handleUpdate({ data: nextData });
  };

  const handleAddRow = () => {
    const nextData = [...data, { label: `Item ${data.length + 1}`, value: 50 }];
    handleUpdate({ data: nextData });
  };

  const handleRemoveRow = (index: number) => {
    if (data.length <= 1) return;
    const nextData = data.filter((_, i) => i !== index);
    handleUpdate({ data: nextData });
  };

  return (
    <div className="property-group">
      <div className="property-group-title">Chart Options</div>

      {/* Chart Title */}
      <div className="property-field full">
        <label>Title</label>
        <input
          type="text"
          value={node.title || ''}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Chart Title"
        />
      </div>

      {'showGrid' in node && (
        <div className="property-checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={node.showGrid}
              onChange={(e) => handleUpdate({ showGrid: e.target.checked })}
            />
            Show Grid
          </label>
        </div>
      )}

      {'showAxis' in node && (
        <div className="property-checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={node.showAxis}
              onChange={(e) => handleUpdate({ showAxis: e.target.checked })}
            />
            Show Axis Lines
          </label>
        </div>
      )}

      {'showLabels' in node && (
        <div className="property-checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={node.showLabels}
              onChange={(e) => handleUpdate({ showLabels: e.target.checked })}
            />
            Show Labels
          </label>
        </div>
      )}

      <div className="property-field full">
        <div className="field-header-row">
          <label>Data Values</label>
          <button className="btn-icon xs" onClick={handleAddRow} title="Add Data Row">
            <Plus size={12} />
          </button>
        </div>
        <div className="chart-data-table">
          {data.map((row, idx) => (
            <div key={idx} className="chart-data-row">
              <input
                type="text"
                value={row.label}
                onChange={(e) => handleDataItemChange(idx, 'label', e.target.value)}
                placeholder="Label"
              />
              <input
                type="number"
                value={row.value}
                onChange={(e) => handleDataItemChange(idx, 'value', e.target.value)}
                placeholder="Value"
              />
              {data.length > 1 && (
                <button
                  className="btn-icon xs danger"
                  onClick={() => handleRemoveRow(idx)}
                  title="Remove Row"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
