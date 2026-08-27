import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { GeometrySection } from './GeometrySection';
import { CornerRadiusControl } from './CornerRadiusControl';
import { FillsSection } from './FillsSection';
import { StrokesSection } from './StrokesSection';
import { EffectsSection } from './EffectsSection';
import { ConstraintsSection } from './ConstraintsSection';
import { ComponentSection } from './ComponentSection';
import { TypographySection } from './TypographySection';
import { ChartSection } from './ChartSection';
import { WireframeSection } from './WireframeSection';
import { AutoLayoutSection } from './AutoLayoutSection';
import { DevModePanel } from '../devmode/DevModePanel';
import { isChartNode, isWireframeNode, type TextNode, type ChigmaNode } from '../../models/node';
import {
  Square,
  Circle,
  Type,
  Layout,
  Sliders,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const {
    selectedIds,
    propertiesCollapsed,
    showGrid,
    setShowGrid,
    gridSize,
    setGridSize,
    showRulers,
    setShowRulers,
    snapToGrid,
    setSnapToGrid
  } = useEditorStore();

  const {
    getNodeById,
    getActivePage,
    setPageBackground,
    updateNodes
  } = useDocumentStore();

  const [activeTab, setActiveTab] = useState<'design' | 'inspect'>('design');
  const [gridColor, setGridColor] = useState('#E5E7EB');
  const [pageSizePreset, setPageSizePreset] = useState('custom');
  const [clipContent, setClipContent] = useState(false);

  if (propertiesCollapsed) return null;

  const activePage = getActivePage();
  const selectedNodes: ChigmaNode[] = selectedIds
    .map((id) => getNodeById(id))
    .filter((n): n is ChigmaNode => Boolean(n));

  const isMultiple = selectedNodes.length > 1;
  const first = selectedNodes[0];

  const handleUpdate = (props: Partial<ChigmaNode>) => {
    const updates = selectedNodes.map((n) => ({
      id: n.id,
      props
    }));
    updateNodes(updates, true, 'Update Properties');
  };

  const handlePagePresetChange = (preset: string) => {
    setPageSizePreset(preset);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'rectangle':
        return <Square size={13} />;
      case 'ellipse':
        return <Circle size={13} />;
      case 'text':
        return <Type size={13} />;
      case 'frame':
        return <Layout size={13} />;
      default:
        return <Sliders size={13} />;
    }
  };

  return (
    <aside className="chigma-properties-inspector">
      {/* Top Segmented Tab Switcher: Design | Inspect */}
      <div className="inspector-tabs-header">
        <button
          className={`inspector-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button
          className={`inspector-tab-btn ${activeTab === 'inspect' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspect')}
        >
          Inspect
        </button>
      </div>

      {/* Body Area */}
      <div className="inspector-scroll-body">
        {activeTab === 'inspect' ? (
          <DevModePanel />
        ) : selectedNodes.length === 0 ? (
          /* Canvas / Page Properties */
          <div className="inspector-content">
            <div className="inspector-page-title">Page Properties</div>

            {/* CANVAS Section */}
            <div className="inspector-section">
              <div className="section-label">CANVAS</div>

              {/* Background Color */}
              <div className="prop-row">
                <span className="prop-label">Background</span>
                <div className="color-field-container">
                  <div
                    className="color-swatch-box"
                    style={{ backgroundColor: activePage?.background || '#FFFFFF' }}
                  >
                    <input
                      type="color"
                      className="hidden-color-picker"
                      value={activePage?.background || '#FFFFFF'}
                      onChange={(e) => {
                        if (activePage) setPageBackground(activePage.id, e.target.value);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    className="color-hex-text-input"
                    value={activePage?.background || '#FFFFFF'}
                    onChange={(e) => {
                      if (activePage) setPageBackground(activePage.id, e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Show Grid Switch */}
              <div className="prop-row align-between">
                <span className="prop-label">Show Grid</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              {/* Grid Size */}
              {showGrid && (
                <div className="prop-row align-between">
                  <span className="prop-label">Grid Size</span>
                  <select
                    className="prop-select"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                  >
                    <option value="4">4px</option>
                    <option value="8">8px</option>
                    <option value="16">16px</option>
                    <option value="24">24px</option>
                    <option value="32">32px</option>
                  </select>
                </div>
              )}

              {/* Grid Color */}
              {showGrid && (
                <div className="prop-row">
                  <span className="prop-label">Grid Color</span>
                  <div className="color-field-container">
                    <div
                      className="color-swatch-box"
                      style={{ backgroundColor: gridColor }}
                    >
                      <input
                        type="color"
                        className="hidden-color-picker"
                        value={gridColor}
                        onChange={(e) => setGridColor(e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      className="color-hex-text-input"
                      value={gridColor}
                      onChange={(e) => setGridColor(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Snap to Grid Switch */}
              <div className="prop-row align-between">
                <span className="prop-label">Snap to Grid</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* RULERS Section */}
            <div className="inspector-section">
              <div className="section-label">RULERS</div>
              <div className="prop-row align-between">
                <span className="prop-label">Show Rulers</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showRulers}
                    onChange={(e) => setShowRulers(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* PAGE Section */}
            <div className="inspector-section">
              <div className="section-label">PAGE</div>
              <div className="prop-row align-between">
                <span className="prop-label">Page Size</span>
                <select
                  className="prop-select"
                  value={pageSizePreset}
                  onChange={(e) => handlePagePresetChange(e.target.value)}
                >
                  <option value="custom">Custom</option>
                  <option value="desktop">Desktop (1440 × 1024)</option>
                  <option value="tablet">Tablet (768 × 1024)</option>
                  <option value="mobile">Mobile (375 × 812)</option>
                </select>
              </div>

              {/* W and H */}
              <div className="prop-two-col-row">
                <div className="prop-input-badge-box">
                  <span className="prop-input-prefix">W</span>
                  <input type="text" className="prop-num-input" defaultValue="1440" />
                </div>
                <div className="prop-input-badge-box">
                  <span className="prop-input-prefix">H</span>
                  <input type="text" className="prop-num-input" defaultValue="1024" />
                </div>
              </div>

              {/* Clip Content */}
              <div className="prop-row align-between">
                <span className="prop-label">Clip Content</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={clipContent}
                    onChange={(e) => setClipContent(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* Node Selection Properties */
          <div className="inspector-content">
            {/* Header: Node Type & Name */}
            <div className="inspector-node-header">
              <div className="node-title-left">
                <span className="node-type-icon">{getNodeIcon(first.type)}</span>
                <span className="node-title-text">
                  {isMultiple ? `${selectedNodes.length} Elements Selected` : first.name}
                </span>
              </div>
              {!isMultiple && (
                <div className="node-header-actions">
                  <button
                    className="prop-icon-btn xs"
                    onClick={() => handleUpdate({ locked: !first.locked })}
                    title={first.locked ? 'Unlock' : 'Lock'}
                  >
                    {first.locked ? <Lock size={13} /> : <Unlock size={13} />}
                  </button>
                  <button
                    className="prop-icon-btn xs"
                    onClick={() => handleUpdate({ visible: !first.visible })}
                    title={first.visible ? 'Hide' : 'Show'}
                  >
                    {first.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              )}
            </div>

            {/* Component & Instance Master */}
            {!isMultiple && (
              <ComponentSection node={first} onUpdate={handleUpdate} />
            )}

            {/* Position & Size */}
            <GeometrySection selectedNodes={selectedNodes} />

            {/* Corner Radius Per Corner */}
            {'cornerRadius' in first && (
              <CornerRadiusControl
                value={(first as any).cornerRadius}
                onChange={(newRadius) => handleUpdate({ cornerRadius: newRadius } as any)}
              />
            )}

            {/* Responsive Constraints */}
            {!isMultiple && (
              <ConstraintsSection node={first} onUpdate={handleUpdate} />
            )}

            {/* Auto-Layout Stacks */}
            <AutoLayoutSection selectedNodes={selectedNodes} />

            {/* Fills Section */}
            <FillsSection node={first} onUpdate={handleUpdate} />

            {/* Strokes Section */}
            <StrokesSection node={first} onUpdate={handleUpdate} />

            {/* Effects Section */}
            <EffectsSection node={first} onUpdate={handleUpdate} />

            {/* Typography Section (if text node) */}
            {!isMultiple && first.type === 'text' && (
              <TypographySection node={first as TextNode} />
            )}

            {/* Chart Section (if chart node) */}
            {!isMultiple && isChartNode(first) && (
              <ChartSection node={first as any} />
            )}

            {/* Wireframe Specific Settings */}
            {!isMultiple && isWireframeNode(first) && (
              <WireframeSection node={first} />
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
