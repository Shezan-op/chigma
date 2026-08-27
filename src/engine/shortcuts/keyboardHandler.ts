import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { createComponentMaster } from '../components/componentEngine';

export function setupKeyboardShortcuts(): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 0. Update Alt key state
    if (e.key === 'Alt') {
      useEditorStore.getState().setAltPressed(true);
    }

    // Ignore keystrokes inside text input elements
    const activeEl = document.activeElement;
    const isEditingText =
      activeEl?.tagName === 'INPUT' ||
      activeEl?.tagName === 'TEXTAREA' ||
      (activeEl as HTMLElement)?.isContentEditable;

    const {
      setActiveTool,
      selectedIds,
      setSelectedIds,
      deselectAll,
      zoomIn,
      zoomOut,
      resetZoom,
      showGrid,
      setShowGrid,
      showRulers,
      setShowRulers,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      isQuickInsertOpen,
      setQuickInsertOpen,
      isCodeExportModalOpen,
      setCodeExportModalOpen,
      isPrototypeMode,
      setPrototypeMode,
      isIconPickerOpen,
      setIconPickerOpen,
      isDesignSystemModalOpen,
      setDesignSystemModalOpen,
      isAiPanelOpen,
      setAiPanelOpen,
      isLinterModalOpen,
      setLinterModalOpen,
      lastDuplicateOffset,
      setLastDuplicateOffset
    } = useEditorStore.getState();

    const {
      document: doc,
      undo,
      redo,
      canUndo,
      canRedo,
      deleteNodes,
      duplicateNodes,
      groupNodes,
      ungroupNodes,
      copy,
      cut,
      paste,
      updateNodes,
      updateDocument,
      getNodeById,
      getActivePage
    } = useDocumentStore.getState();

    // 1. Command Palette: Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.altKey) {
      e.preventDefault();
      setCommandPaletteOpen(!isCommandPaletteOpen);
      return;
    }

    // 2. Convert to Component: Ctrl+Alt+K / Cmd+Alt+K
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (selectedIds.length > 0) {
        const node = getNodeById(selectedIds[0]);
        if (node) {
          const { master, updatedNode } = createComponentMaster(node);
          const currentComponents = doc.components || [];
          updateDocument({ components: [...currentComponents, master] });
          updateNodes([{ id: node.id, props: updatedNode }]);
        }
      }
      return;
    }

    // 3. Export Code: Ctrl+Shift+C / Cmd+Shift+C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setCodeExportModalOpen(!isCodeExportModalOpen);
      return;
    }

    // 4. Prototyping Mode: Ctrl+Alt+Enter or F5
    if (((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'Enter') || e.key === 'F5') {
      e.preventDefault();
      setPrototypeMode(!isPrototypeMode);
      return;
    }

    if (isEditingText) return;

    // 5. Quick Insert Component: /
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setQuickInsertOpen(!isQuickInsertOpen);
      return;
    }

    // 6. Open AI Assistant: Shift+A
    if (e.shiftKey && e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setAiPanelOpen(!isAiPanelOpen);
      return;
    }

    // 7. Open Design Health / Linter: Shift+L
    if (e.shiftKey && e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setLinterModalOpen(!isLinterModalOpen);
      return;
    }

    // 8. Open Design System Panel: Shift+D
    if (e.shiftKey && e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setDesignSystemModalOpen(!isDesignSystemModalOpen);
      return;
    }

    // 9. Open Vector Icon Library: Shift+I
    if (e.shiftKey && e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setIconPickerOpen(!isIconPickerOpen);
      return;
    }

    // 10. Arrow Key Nudge (1px normal, 8px with Shift)
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && selectedIds.length > 0) {
      e.preventDefault();
      const step = e.shiftKey ? 8 : 1;
      const page = getActivePage();
      if (!page) return;

      const nodesToNudge = page.children.filter((n) => selectedIds.includes(n.id));
      const updates = nodesToNudge.map((n) => {
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        return {
          id: n.id,
          props: { x: n.x + dx, y: n.y + dy }
        };
      });

      updateNodes(updates, true, `Nudge ${step}px`);
      return;
    }

    // 11. Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        if (canRedo()) redo();
      } else {
        if (canUndo()) undo();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      if (canRedo()) redo();
      return;
    }

    // 12. Clipboard Operations
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      if (selectedIds.length > 0) copy(selectedIds);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      if (selectedIds.length > 0) cut(selectedIds);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      const pastedIds = paste();
      if (pastedIds.length > 0) setSelectedIds(pastedIds);
      return;
    }

    // Smart Duplicate with offset memory
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (selectedIds.length > 0) {
        const offset = lastDuplicateOffset || { x: 20, y: 20 };
        const clonedIds = duplicateNodes(selectedIds);
        if (clonedIds.length > 0) {
          setSelectedIds(clonedIds);
          setLastDuplicateOffset(offset);
        }
      }
      return;
    }

    // 13. Grouping & Ungrouping
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      if (e.shiftKey) {
        // Ungroup
        if (selectedIds.length === 1) {
          const restoredIds = ungroupNodes(selectedIds[0]);
          if (restoredIds.length > 0) setSelectedIds(restoredIds);
        }
      } else {
        // Group
        if (selectedIds.length > 1) {
          const groupId = groupNodes(selectedIds);
          if (groupId) setSelectedIds([groupId]);
        }
      }
      return;
    }

    // 14. Select All
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const page = getActivePage();
      if (page && page.children) {
        setSelectedIds(page.children.filter((n) => n.visible && !n.locked).map((n) => n.id));
      }
      return;
    }

    // 15. Delete
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedIds.length > 0) {
        e.preventDefault();
        deleteNodes(selectedIds);
        deselectAll();
      }
      return;
    }

    // 16. Escape -> Deselect
    if (e.key === 'Escape') {
      deselectAll();
      setActiveTool('select');
      return;
    }

    // 17. Zoom Shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      zoomIn();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
      e.preventDefault();
      zoomOut();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      resetZoom();
      return;
    }

    // 18. Toggle Grid & Rulers
    if ((e.ctrlKey || e.metaKey) && (e.key === "'" || e.key === '"')) {
      e.preventDefault();
      setShowGrid(!showGrid);
      return;
    }

    if (e.shiftKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      setShowRulers(!showRulers);
      return;
    }

    // 19. Tool Switch Shortcuts (Single Key)
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'h':
          setActiveTool('hand');
          break;
        case 'f':
          setActiveTool('frame');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'e':
          setActiveTool('ellipse');
          break;
        case 'l':
          setActiveTool('line');
          break;
        case 'a':
          setActiveTool('arrow');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'p':
          setActiveTool('pencil');
          break;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Alt') {
      useEditorStore.getState().setAltPressed(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}
