import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  HelpCircle,
  Code,
  Search,
  Sliders,
  Play,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface TopToolbarProps {
  onBackToProjects: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onBackToProjects }) => {
  const {
    document: doc,
    renameDocument,
    undo,
    redo,
    canUndo,
    canRedo
  } = useDocumentStore();

  const {
    viewport,
    zoomIn,
    zoomOut,
    resetZoom,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    setEditorMode,
    isAiPanelOpen,
    setAiPanelOpen,
    setCommandPaletteOpen,
    setCodeExportModalOpen,
    setPrototypeMode
  } = useEditorStore();

  const { setExportModalOpen, setImportModalOpen, setShortcutsModalOpen } = useProjectStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(doc.name);
  const [isMenuDropdownOpen, setMenuDropdownOpen] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== doc.name) {
      renameDocument(titleInput.trim());
    }
  };

  return (
    <header className="chigma-top-toolbar">
      {/* 1. Left Section: Logo & Project Navigation */}
      <div className="toolbar-section left">
        {/* Brand Dropdown */}
        <div className="relative">
          <button
            className="chigma-brand-btn"
            onClick={() => setMenuDropdownOpen(!isMenuDropdownOpen)}
            title="Chigma Menu"
          >
            <div className="chigma-logo-squircle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#000000" />
                <path d="M7 8C7 6.89543 7.89543 6 9 6H15C16.1046 6 17 6.89543 17 8V9C17 10.1046 16.1046 11 15 11H9C7.89543 11 7 10.1046 7 9V8Z" fill="#FFFFFF" />
                <path d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V16C17 17.1046 16.1046 18 15 18H9C7.89543 18 7 17.1046 7 16V15Z" fill="#FFFFFF" />
                <circle cx="9.5" cy="8.5" r="1.5" fill="#4F46E5" />
              </svg>
            </div>
            <span className="brand-text">Chigma</span>
            <ChevronDown size={12} className="brand-chevron" />
          </button>

          {isMenuDropdownOpen && (
            <div className="chigma-top-menu-dropdown">
              <button className="top-menu-item" onClick={onBackToProjects}>
                <span>Back to Projects</span>
              </button>
              <button className="top-menu-item" onClick={() => setImportModalOpen(true)}>
                <span>Import .chigma.json</span>
              </button>
              <button className="top-menu-item" onClick={() => setExportModalOpen(true)}>
                <span>Export Project</span>
              </button>
              <div className="top-menu-divider" />
              <button className="top-menu-item" onClick={() => setShortcutsModalOpen(true)}>
                <span>Keyboard Shortcuts</span>
              </button>
            </div>
          )}
        </div>

        <div className="title-divider" />

        {/* Project Title Input / Display */}
        {isEditingTitle ? (
          <input
            type="text"
            className="header-title-input"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
          />
        ) : (
          <div
            className="header-project-title-btn"
            onClick={() => {
              setTitleInput(doc.name);
              setIsEditingTitle(true);
            }}
            title="Click to rename"
          >
            <span>{doc.name}</span>
            <ChevronDown size={12} />
          </div>
        )}
      </div>

      {/* 2. Center-Left & Center Section: Quick Actions, Undo/Redo, Grid & Zoom */}
      <div className="toolbar-section center">
        {/* Quick Actions Search Pill */}
        <button
          className="quick-actions-trigger"
          onClick={() => setCommandPaletteOpen(true)}
          title="Quick Actions (Ctrl+K)"
        >
          <Search size={13} />
          <span>Quick Actions</span>
          <kbd className="quick-actions-kbd">Ctrl+K</kbd>
        </button>

        {/* Undo / Redo */}
        <div className="toolbar-btn-pill-group">
          <button
            className="toolbar-pill-icon-btn"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            className="toolbar-pill-icon-btn"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Grid & Guides / Rulers */}
        <div className="toolbar-btn-pill-group">
          <button
            className={`toolbar-pill-icon-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title={`Toggle Grid (${showGrid ? 'On' : 'Off'})`}
          >
            <Grid size={14} />
          </button>
          <button
            className={`toolbar-pill-icon-btn ${showRulers ? 'active' : ''}`}
            onClick={() => setShowRulers(!showRulers)}
            title={`Toggle Rulers (${showRulers ? 'On' : 'Off'})`}
          >
            <Sliders size={14} />
          </button>
        </div>

        {/* Zoom Controls Pill (- 100% +) */}
        <div className="toolbar-zoom-pill">
          <button className="zoom-btn" onClick={zoomOut} title="Zoom Out (Ctrl+-)">
            <ZoomOut size={13} />
          </button>
          <span className="zoom-val" onClick={resetZoom} title="Reset Zoom (Ctrl+0)">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button className="zoom-btn" onClick={zoomIn} title="Zoom In (Ctrl++)">
            <ZoomIn size={13} />
          </button>
        </div>

        {/* AI Co-Designer Pill */}
        <button
          onClick={() => setAiPanelOpen(!isAiPanelOpen)}
          className={`ai-toolbar-btn ${isAiPanelOpen ? 'active' : ''}`}
          title="Chigma AI Assistant"
        >
          <Sparkles size={13} />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* 3. Right Section: Present, Export Code, Import, Export, Help */}
      <div className="toolbar-section right">
        {/* Present Button */}
        <button
          className="toolbar-btn outline"
          onClick={() => {
            setEditorMode('prototype');
            setPrototypeMode(true);
          }}
          title="Present Interactive Prototype (F5 / Ctrl+Alt+Enter)"
        >
          <Play size={12} fill="currentColor" />
          <span>Present</span>
        </button>

        {/* Export Code Black Button */}
        <button
          className="toolbar-btn dark"
          onClick={() => setCodeExportModalOpen(true)}
          title="Export to React, Next.js & HTML/CSS (Ctrl+Shift+C)"
        >
          <Code size={13} />
          <span>Export Code</span>
        </button>

        {/* Import Button */}
        <button
          className="toolbar-btn outline"
          onClick={() => setImportModalOpen(true)}
          title="Import .chigma.json"
        >
          <Upload size={13} />
          <span>Import</span>
        </button>

        {/* Primary Export Button */}
        <button
          className="toolbar-btn primary"
          onClick={() => setExportModalOpen(true)}
          title="Export Image / SVG / Project"
        >
          <Download size={13} />
          <span>Export</span>
        </button>

        {/* Help Question Icon */}
        <button
          className="toolbar-icon-circle-btn"
          onClick={() => setShortcutsModalOpen(true)}
          title="Help & Shortcuts (?)"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
};
