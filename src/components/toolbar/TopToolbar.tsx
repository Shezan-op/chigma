import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { useProjectStore } from '../../store/useProjectStore';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  HelpCircle,
  Code,
  Search,
  Sliders,
  Play,
  Smile,
  Palette,
  Sparkles,
  Server,
  FileText,
  History,
  ShieldAlert,
  Cpu
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
    canRedo,
    alignNodes,
    distributeNodes
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
    selectedIds,
    editorMode,
    setEditorMode,
    isAiPanelOpen,
    setAiPanelOpen,
    setCommandPaletteOpen,
    setQuickInsertOpen,
    setCodeExportModalOpen,
    setPrototypeMode,
    setIconPickerOpen,
    setDesignSystemModalOpen,
    setLinterModalOpen,
    setDecisionLogModalOpen,
    setSnapshotsModalOpen,
    setMcpModalOpen
  } = useEditorStore();

  const { setExportModalOpen, setImportModalOpen, setShortcutsModalOpen } = useProjectStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(doc.name);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== doc.name) {
      renameDocument(titleInput.trim());
    }
  };

  const hasMultipleSelected = selectedIds.length > 1;

  return (
    <header className="chigma-top-toolbar">
      {/* Left: Logo & Project Navigation */}
      <div className="toolbar-section left">
        <button
          className="btn-icon header-nav-btn"
          onClick={onBackToProjects}
          title="Back to Projects"
          aria-label="Back to Projects"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="chigma-brand-badge" onClick={onBackToProjects}>
          <div className="brand-dot" />
          <span className="brand-name">Chigma</span>
        </div>

        <div className="title-divider" />

        {/* Project Name */}
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
            className="header-project-title"
            onDoubleClick={() => {
              setTitleInput(doc.name);
              setIsEditingTitle(true);
            }}
            title="Double click to rename"
          >
            {doc.name}
          </div>
        )}

        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 ml-2">
          <button
            onClick={() => setEditorMode('design')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              editorMode === 'design'
                ? 'bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setEditorMode('dev')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              editorMode === 'dev'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Cpu size={12} />
            <span>Dev Mode</span>
          </button>
          <button
            onClick={() => {
              setEditorMode('prototype');
              setPrototypeMode(true);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              editorMode === 'prototype'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Play size={11} fill="currentColor" />
            <span>Prototype</span>
          </button>
        </div>
      </div>

      {/* Center: Command Palette, Quick Insert, AI Assistant & Alignment */}
      <div className="toolbar-section center">
        {/* Quick Actions Search Pill */}
        <button
          className="command-palette-trigger"
          onClick={() => setCommandPaletteOpen(true)}
          title="Quick Actions (Ctrl+K)"
        >
          <Search size={13} />
          <span>Actions</span>
          <kbd>Ctrl+K</kbd>
        </button>

        {/* Quick Insert (/) */}
        <button
          onClick={() => setQuickInsertOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          title="Quick Insert Component (/)"
        >
          <span>Insert</span>
          <kbd className="text-[10px] font-mono bg-white dark:bg-zinc-900 px-1 rounded border border-zinc-200 dark:border-zinc-700">/</kbd>
        </button>

        {/* AI Co-Designer Button */}
        <button
          onClick={() => setAiPanelOpen(!isAiPanelOpen)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
            isAiPanelOpen
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25'
              : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
          }`}
          title="Chigma AI Assistant"
        >
          <Sparkles size={13} className="animate-pulse" />
          <span>AI Co-Designer</span>
        </button>

        {/* Quick Tool Launchers: Icons, Tokens, Linter, Decision Log, Snapshots, MCP */}
        <div className="toolbar-btn-group">
          <button
            className="btn-icon"
            onClick={() => setIconPickerOpen(true)}
            title="Vector Icon Library"
          >
            <Smile size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setDesignSystemModalOpen(true)}
            title="Design Tokens & Palette (Light/Dark)"
          >
            <Palette size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setLinterModalOpen(true)}
            title="Design Health & Quality Inspector"
          >
            <ShieldAlert size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setDecisionLogModalOpen(true)}
            title="Project Design Decision Log"
          >
            <FileText size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setSnapshotsModalOpen(true)}
            title="Version History & Snapshots"
          >
            <History size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setMcpModalOpen(true)}
            title="Model Context Protocol (MCP) Server"
          >
            <Server size={15} />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="toolbar-btn-group">
          <button
            className="btn-icon"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Alignment & Distribution */}
        {hasMultipleSelected && (
          <div className="toolbar-btn-group">
            <button
              className="btn-icon sm"
              onClick={() => alignNodes('left', selectedIds)}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              className="btn-icon sm"
              onClick={() => alignNodes('center', selectedIds)}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              className="btn-icon sm"
              onClick={() => alignNodes('right', selectedIds)}
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
            <button
              className="btn-icon sm"
              onClick={() => distributeNodes('horizontal', selectedIds)}
              title="Distribute Horizontally"
            >
              <AlignJustify size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Right: Zoom, Grid, Rulers, Code Export, Export/Import */}
      <div className="toolbar-section right">
        {/* View Controls */}
        <div className="toolbar-btn-group">
          <button
            className={`btn-icon ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title={`Toggle Grid (${showGrid ? 'On' : 'Off'}) - Ctrl+'`}
          >
            <Grid size={15} />
          </button>
          <button
            className={`btn-icon ${showRulers ? 'active' : ''}`}
            onClick={() => setShowRulers(!showRulers)}
            title={`Toggle Rulers (${showRulers ? 'On' : 'Off'}) - Shift+R`}
          >
            <Sliders size={15} />
          </button>
          <button className="btn-icon" onClick={zoomOut} title="Zoom Out (Ctrl+-)">
            <ZoomOut size={15} />
          </button>
          <span className="zoom-percentage-btn" onClick={resetZoom} title="Reset Zoom (Ctrl+0)">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button className="btn-icon" onClick={zoomIn} title="Zoom In (Ctrl++)">
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Present / Play Prototype */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPrototypeMode(true)}
          title="Play Interactive Prototype (Ctrl+Alt+Enter)"
          style={{ borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <Play size={12} fill="#000000" />
          <span>Present</span>
        </button>

        {/* Export to Code Pill */}
        <button
          className="btn btn-code-export"
          onClick={() => setCodeExportModalOpen(true)}
          title="Export Wireframe to HTML/CSS Code (Ctrl+Shift+C)"
        >
          <Code size={14} />
          <span>Export Code</span>
        </button>

        {/* Standard Export / Import */}
        <div className="toolbar-btn-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setImportModalOpen(true)}
            title="Import .chigma.json"
          >
            <Upload size={13} />
            <span>Import</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setExportModalOpen(true)}
            title="Export Image / Vector / Document"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>

        {/* Shortcuts / Help */}
        <button
          className="btn-icon"
          onClick={() => setShortcutsModalOpen(true)}
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
};
