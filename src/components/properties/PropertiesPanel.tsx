import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { GeometrySection } from './GeometrySection';
import { FillStrokeSection } from './FillStrokeSection';
import { TypographySection } from './TypographySection';
import { ChartSection } from './ChartSection';
import { WireframeSection } from './WireframeSection';
import { AutoLayoutSection } from './AutoLayoutSection';
import { InteractionSection } from './InteractionSection';
import { isChartNode, isWireframeNode, type TextNode, type ChigmaNode } from '../../models/node';
import { Sliders } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedIds, propertiesCollapsed } = useEditorStore();
  const { getNodeById, getActivePage, setPageBackground } = useDocumentStore();

  if (propertiesCollapsed) return null;

  const activePage = getActivePage();
  const selectedNodes: ChigmaNode[] = selectedIds
    .map((id) => getNodeById(id))
    .filter((n): n is ChigmaNode => Boolean(n));

  if (selectedNodes.length === 0) {
    return (
      <aside className="chigma-properties-panel">
        <div className="panel-header">
          <div className="panel-title">Page Properties</div>
        </div>
        <div className="panel-body">
          <div className="property-group">
            <div className="property-group-title">Canvas Settings</div>
            <div className="property-field full">
              <label>Background Color</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  className="color-swatch-input"
                  value={activePage?.background || '#FFFFFF'}
                  onChange={(e) => {
                    if (activePage) {
                      setPageBackground(activePage.id, e.target.value);
                    }
                  }}
                />
                <input
                  type="text"
                  className="color-hex-input"
                  value={activePage?.background || '#FFFFFF'}
                  onChange={(e) => {
                    if (activePage) {
                      setPageBackground(activePage.id, e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const first = selectedNodes[0];
  const isMultiple = selectedNodes.length > 1;

  return (
    <aside className="chigma-properties-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={14} style={{ marginRight: 6 }} />
          {isMultiple ? `${selectedNodes.length} Elements Selected` : first.name}
        </div>
      </div>

      <div className="panel-body">
        {/* Geometry / Dimensions Section */}
        <GeometrySection selectedNodes={selectedNodes} />

        {/* Auto-Layout & Spacing Section */}
        <AutoLayoutSection selectedNodes={selectedNodes} />

        {/* Fill & Stroke Section */}
        <FillStrokeSection selectedNodes={selectedNodes} />

        {/* Prototyping Interaction Section */}
        <InteractionSection selectedNodes={selectedNodes} />

        {/* Typography (Single Text Node) */}
        {!isMultiple && first.type === 'text' && (
          <TypographySection node={first as TextNode} />
        )}

        {/* Chart Settings (Single Chart Node) */}
        {!isMultiple && isChartNode(first) && (
          <ChartSection node={first as any} />
        )}

        {/* Wireframe Component Specific Settings */}
        {!isMultiple && isWireframeNode(first) && (
          <WireframeSection node={first} />
        )}
      </div>
    </aside>
  );
};
