import React, { useEffect } from 'react';
import { TopToolbar } from '../components/toolbar/TopToolbar';
import { LeftSidebar } from '../components/panels/LeftSidebar';
import { Canvas } from '../components/editor/Canvas';
import { PropertiesPanel } from '../components/properties/PropertiesPanel';
import { StatusBar } from '../components/panels/StatusBar';
import { ExportModal } from '../components/dialogs/ExportModal';
import { ImportModal } from '../components/dialogs/ImportModal';
import { ShortcutsModal } from '../components/dialogs/ShortcutsModal';
import { ConfirmModal } from '../components/dialogs/ConfirmModal';
import { CodeExportModal } from '../components/dialogs/CodeExportModal';
import { CommandPaletteModal } from '../components/dialogs/CommandPaletteModal';
import { PrototypePlayerModal } from '../components/prototype/PrototypePlayerModal';
import { setupKeyboardShortcuts } from '../engine/shortcuts/keyboardHandler';
import { useAutosave } from '../persistence/autosave';

interface EditorProps {
  onBackToProjects: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onBackToProjects }) => {
  // Activate Autosave Hook
  useAutosave();

  // Setup Global Keyboard Shortcuts Listener
  useEffect(() => {
    const cleanupShortcuts = setupKeyboardShortcuts();
    return cleanupShortcuts;
  }, []);

  return (
    <div className="chigma-editor-root">
      {/* 1. Header Toolbar */}
      <TopToolbar onBackToProjects={onBackToProjects} />

      {/* 2. Main Work Area */}
      <div className="chigma-work-area">
        {/* Left: Tool Strip, Layers & Component Library */}
        <LeftSidebar />

        {/* Center: Scalable SVG Canvas */}
        <main className="chigma-canvas-viewport">
          <Canvas />
        </main>

        {/* Right: Dynamic Properties Inspector */}
        <PropertiesPanel />
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar />

      {/* 4. Modals & Dialogs */}
      <ExportModal />
      <ImportModal />
      <ShortcutsModal />
      <ConfirmModal />
      <CodeExportModal />
      <CommandPaletteModal />
      <PrototypePlayerModal />
    </div>
  );
};
