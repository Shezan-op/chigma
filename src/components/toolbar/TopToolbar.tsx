import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Undo2,
  Redo2,
  Grid,
  Magnet,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Upload,
  HelpCircle,
  FolderKanban,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  SplitSquareHorizontal,
  SplitSquareVertical
} from 'lucide-react';

interface TopToolbarProps {
  onBackToHome: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onBackToHome }) => {
  const document = useDocumentStore((s) => s.document);
  const renameDocument = useDocumentStore((s) => s.renameDocument);
  const undo = useDocumentStore((s) => s.undo);
  const redo = useDocumentStore((s) => s.redo);
  const canUndo = useDocumentStore((s) => s.canUndo());
  const canRedo = useDocumentStore((s) => s.canRedo());
  const alignNodes = useDocumentStore((s) => s.alignNodes);
  const distributeNodes = useDocumentStore((s) => s.distributeNodes);

  const {
    viewport,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    selectedIds
  } = useEditorStore();

  const {
    setExportModalOpen,
    setImportModalOpen,
    setShortcutsModalOpen,
    isSaving,
    lastSavedAt
  } = useProjectStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(document?.name || 'Untitled Design');

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      renameDocument(titleValue.trim());
    } else {
      setTitleValue(document?.name || 'Untitled Design');
    }
  };

  const hasMultiSelection = selectedIds.length >= 2;
  const hasThreeSelection = selectedIds.length >= 3;

  return (
    <header className="chigma-top-toolbar">
      {/* Left: Brand & Home Navigation */}
      <div className="toolbar-section left">
        <button
          className="btn-icon home-btn"
          onClick={onBackToHome}
          title="Back to Projects"
          aria-label="Back to Projects"
        >
          <FolderKanban size={18} />
        </button>

        <div className="brand-badge">
          <div className="brand-icon">
            <span className="dot dot-1" />
            <span className="dot dot-2" />
            <span className="dot dot-3" />
            <span className="dot dot-4" />
          </div>
          <span className="brand-name">Chigma</span>
        </div>

        {/* Project Title */}
        <div className="project-title-wrapper">
          {isEditingTitle ? (
            <input
              type="text"
              className="title-input"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleValue(document?.name || 'Untitled Design');
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
            />
          ) : (
            <span
              className="title-display"
              onDoubleClick={() => {
                setTitleValue(document?.name || 'Untitled Design');
                setIsEditingTitle(true);
              }}
              title="Double click to rename project"
            >
              {document?.name || 'Untitled Design'}
            </span>
          )}

          {/* Auto-save status */}
          <span className="autosave-status">
            {isSaving ? 'Saving...' : lastSavedAt ? 'Saved offline' : 'Local'}
          </span>
        </div>
      </div>

      {/* Center: History, Alignment & Snapping */}
      <div className="toolbar-section center">
        {/* Undo / Redo */}
        <div className="btn-group">
          <button
            className="btn-icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Alignment */}
        <div className="btn-group">
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('left', selectedIds)}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('center', selectedIds)}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('right', selectedIds)}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('top', selectedIds)}
            title="Align Top"
          >
            <AlignStartVertical size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('middle', selectedIds)}
            title="Align Middle"
          >
            <AlignCenterVertical size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasMultiSelection}
            onClick={() => alignNodes('bottom', selectedIds)}
            title="Align Bottom"
          >
            <AlignEndVertical size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Distribution */}
        <div className="btn-group">
          <button
            className="btn-icon"
            disabled={!hasThreeSelection}
            onClick={() => distributeNodes('horizontal', selectedIds)}
            title="Distribute Horizontally"
          >
            <SplitSquareHorizontal size={16} />
          </button>
          <button
            className="btn-icon"
            disabled={!hasThreeSelection}
            onClick={() => distributeNodes('vertical', selectedIds)}
            title="Distribute Vertically"
          >
            <SplitSquareVertical size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Grid & Snapping */}
        <div className="btn-group">
          <button
            className={`btn-icon ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title={`Toggle Grid (${showGrid ? 'On' : 'Off'})`}
          >
            <Grid size={16} />
          </button>
          <button
            className={`btn-icon ${snapToGrid ? 'active' : ''}`}
            onClick={() => setSnapToGrid(!snapToGrid)}
            title={`Toggle Snapping (${snapToGrid ? 'On' : 'Off'})`}
          >
            <Magnet size={16} />
          </button>
        </div>
      </div>

      {/* Right: Zoom & Export/Import */}
      <div className="toolbar-section right">
        {/* Zoom */}
        <div className="zoom-controls">
          <button className="btn-icon sm" onClick={zoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="zoom-percent-btn" onClick={resetZoom} title="Reset Zoom (100%)">
            {Math.round(viewport.zoom * 100)}%
          </button>
          <button className="btn-icon sm" onClick={zoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button
            className="btn-icon sm"
            onClick={() => setZoom(1)}
            title="Fit to Screen"
          >
            <Maximize size={14} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Actions */}
        <div className="btn-group">
          <button
            className="btn-text"
            onClick={() => setImportModalOpen(true)}
            title="Import .chigma.json or image"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => setExportModalOpen(true)}
            title="Export JSON, SVG, or PNG"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
          <button
            className="btn-icon"
            onClick={() => setShortcutsModalOpen(true)}
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
