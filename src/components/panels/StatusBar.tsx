import React from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';

export const StatusBar: React.FC = () => {
  const activePage = useDocumentStore((s) => s.getActivePage());
  const { selectedIds, viewport, showGrid, gridSize, snapToGrid } = useEditorStore();

  const selectedNodes = (activePage?.children || []).filter((n) => selectedIds.includes(n.id));
  const isSingle = selectedNodes.length === 1;
  const single = isSingle ? selectedNodes[0] : null;

  return (
    <footer className="chigma-status-bar">
      <div className="status-left">
        {selectedNodes.length === 0 ? (
          <span className="status-item">Ready · No selection</span>
        ) : isSingle && single ? (
          <>
            <span className="status-item highlight">{single.name}</span>
            <span className="status-item">
              X: {Math.round(single.x)} Y: {Math.round(single.y)}
            </span>
            <span className="status-item">
              W: {Math.round(single.width)} H: {Math.round(single.height)}
            </span>
            {single.rotation ? (
              <span className="status-item">∠ {Math.round(single.rotation)}°</span>
            ) : null}
          </>
        ) : (
          <span className="status-item highlight">{selectedNodes.length} objects selected</span>
        )}
      </div>

      <div className="status-right">
        <span className="status-item">
          Grid: {showGrid ? `${gridSize}px` : 'Off'}
        </span>
        <span className="status-item">
          Snap: {snapToGrid ? 'Active' : 'Off'}
        </span>
        <span className="status-item">
          Zoom: {Math.round(viewport.zoom * 100)}%
        </span>
        <span className="status-item subtle">Offline</span>
      </div>
    </footer>
  );
};
