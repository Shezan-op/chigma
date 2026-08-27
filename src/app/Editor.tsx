import React, { useEffect } from 'react';
import { TopToolbar } from '../components/toolbar/TopToolbar';
import { LeftSidebar } from '../components/panels/LeftSidebar';
import { Canvas } from '../components/editor/Canvas';
import { PropertiesPanel } from '../components/properties/PropertiesPanel';
import { DevModePanel } from '../components/devmode/DevModePanel';
import { AiAgentPanel } from '../components/ai/AiAgentPanel';
import { StatusBar } from '../components/panels/StatusBar';
import { ExportModal } from '../components/dialogs/ExportModal';
import { ImportModal } from '../components/dialogs/ImportModal';
import { ShortcutsModal } from '../components/dialogs/ShortcutsModal';
import { ConfirmModal } from '../components/dialogs/ConfirmModal';
import { CodeExportModal } from '../components/dialogs/CodeExportModal';
import { CommandPaletteModal } from '../components/dialogs/CommandPaletteModal';
import { QuickInsertModal } from '../components/dialogs/QuickInsertModal';
import { PrototypePlayerModal } from '../components/prototype/PrototypePlayerModal';
import { IconPickerModal } from '../components/dialogs/IconPickerModal';
import { DesignSystemModal } from '../components/dialogs/DesignSystemModal';
import { AccessibilityAuditModal } from '../components/dialogs/AccessibilityAuditModal';
import { ResponsivePreviewModal } from '../components/prototype/ResponsivePreviewModal';
import { DesignLinterModal } from '../components/dialogs/DesignLinterModal';
import { DecisionLogModal } from '../components/dialogs/DecisionLogModal';
import { SnapshotsModal } from '../components/dialogs/SnapshotsModal';
import { McpModal } from '../components/dialogs/McpModal';
import { setupKeyboardShortcuts } from '../engine/shortcuts/keyboardHandler';
import { useAutosave } from '../persistence/autosave';
import { useEditorStore } from '../store/useEditorStore';

interface EditorProps {
  onBackToProjects: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onBackToProjects }) => {
  // Activate Autosave Hook
  useAutosave();

  const {
    editorMode,
    isIconPickerOpen,
    setIconPickerOpen,
    isDesignSystemModalOpen,
    setDesignSystemModalOpen,
    isAccessibilityModalOpen,
    setAccessibilityModalOpen,
    isResponsivePreviewOpen,
    setResponsivePreviewOpen,
    isLinterModalOpen,
    setLinterModalOpen,
    isDecisionLogModalOpen,
    setDecisionLogModalOpen,
    isSnapshotsModalOpen,
    setSnapshotsModalOpen,
    isMcpModalOpen,
    setMcpModalOpen
  } = useEditorStore();

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

        {/* Right: Dynamic Properties Inspector or Dev Mode Handoff Panel */}
        {editorMode === 'dev' ? (
          <aside className="w-80 h-full">
            <DevModePanel />
          </aside>
        ) : (
          <PropertiesPanel />
        )}

        {/* AI Co-Designer Sidebar */}
        <AiAgentPanel />
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
      <QuickInsertModal />
      <PrototypePlayerModal />

      {/* 5. Design Engine Modals */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
      />
      <DesignSystemModal
        isOpen={isDesignSystemModalOpen}
        onClose={() => setDesignSystemModalOpen(false)}
      />
      <AccessibilityAuditModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setAccessibilityModalOpen(false)}
      />
      <ResponsivePreviewModal
        isOpen={isResponsivePreviewOpen}
        onClose={() => setResponsivePreviewOpen(false)}
      />
      <DesignLinterModal
        isOpen={isLinterModalOpen}
        onClose={() => setLinterModalOpen(false)}
      />
      <DecisionLogModal
        isOpen={isDecisionLogModalOpen}
        onClose={() => setDecisionLogModalOpen(false)}
      />
      <SnapshotsModal
        isOpen={isSnapshotsModalOpen}
        onClose={() => setSnapshotsModalOpen(false)}
      />
      <McpModal
        isOpen={isMcpModalOpen}
        onClose={() => setMcpModalOpen(false)}
      />
    </div>
  );
};
