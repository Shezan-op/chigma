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
import { useAutosave } from '../persistence/autosave';
import { handleGlobalKeyDown } from '../engine/shortcuts/keyboardHandler';

interface EditorProps {
  onBackToHome: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onBackToHome }) => {
  // Start silent debounced autosave (600ms)
  useAutosave(600);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleGlobalKeyDown(e);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="chigma-editor-shell">
      {/* 1. Top Header Toolbar */}
      <TopToolbar onBackToHome={onBackToHome} />

      {/* 2. Main Workspace Body */}
      <div className="chigma-workspace">
        {/* Left Tool / Layers Sidebar */}
        <LeftSidebar />

        {/* Center SVG Canvas */}
        <main className="canvas-viewport-wrapper">
          <Canvas />
        </main>

        {/* Right Properties Inspector */}
        <PropertiesPanel />
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar />

      {/* 4. Global Modals & Dialogs */}
      <ExportModal />
      <ImportModal />
      <ShortcutsModal />
      <ConfirmModal />
    </div>
  );
};
