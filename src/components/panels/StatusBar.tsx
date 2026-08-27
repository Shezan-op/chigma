import React from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { Hand, Maximize, ZoomIn, ZoomOut, Cloud } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const activePage = useDocumentStore((s) => s.getActivePage());
  const {
    selectedIds,
    viewport,
    zoomIn,
    zoomOut,
    resetZoom,
    showGrid,
    gridSize,
    snapToGrid,
    activeTool,
    setActiveTool
  } = useEditorStore();

  const selectedNodes = (activePage?.children || []).filter((n) => selectedIds.includes(n.id));
  const isSingle = selectedNodes.length === 1;
  const single = isSingle ? selectedNodes[0] : null;

  return (
    <footer className="chigma-status-bar">
      <div className="status-left">
        <span className="status-indicator-dot" />
        {selectedNodes.length === 0 ? (
          <span className="status-item font-semibold">Ready</span>
        ) : isSingle && single ? (
          <>
            <span className="status-item highlight">{single.name}</span>
            <span className="status-divider-dot">·</span>
            <span className="status-item">
              {Math.round(single.width)} × {Math.round(single.height)}
            </span>
            <span className="status-divider-dot">·</span>
            <span className="status-item">
              X: {Math.round(single.x)}  Y: {Math.round(single.y)}
            </span>
            {single.rotation ? (
              <>
                <span className="status-divider-dot">·</span>
                <span className="status-item">∠ {Math.round(single.rotation)}°</span>
              </>
            ) : null}
          </>
        ) : (
          <span className="status-item highlight">{selectedNodes.length} objects selected</span>
        )}
      </div>

      <div className="status-right">
        {/* Quick Pan Tool */}
        <button
          className={`status-btn-icon ${activeTool === 'hand' ? 'active' : ''}`}
          onClick={() => setActiveTool(activeTool === 'hand' ? 'select' : 'hand')}
          title="Hand / Pan Tool (H)"
        >
          <Hand size={13} />
        </button>

        {/* Zoom Controls */}
        <div className="status-zoom-group">
          <button className="status-zoom-btn" onClick={zoomOut} title="Zoom Out">
            <ZoomOut size={12} />
          </button>
          <span className="status-zoom-text" onClick={resetZoom} title="Reset Zoom">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button className="status-zoom-btn" onClick={zoomIn} title="Zoom In">
            <ZoomIn size={12} />
          </button>
        </div>

        {/* Fit to Viewport */}
        <button className="status-btn-icon" onClick={resetZoom} title="Fit to Screen (Ctrl+0)">
          <Maximize size={13} />
        </button>

        <div className="status-v-divider" />

        <span className="status-item">
          Grid: <strong>{showGrid ? `${gridSize}px` : 'Off'}</strong>
        </span>
        <span className="status-item">
          Snap: <strong>{snapToGrid ? 'Active' : 'Off'}</strong>
        </span>

        <div className="status-v-divider" />

        <div className="status-offline-badge" title="100% Local & Offline - IndexedDB">
          <Cloud size={12} />
          <span>Offline</span>
        </div>
      </div>
    </footer>
  );
};
