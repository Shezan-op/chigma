import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { useProjectStore } from '../../store/useProjectStore';

export function handleGlobalKeyDown(e: KeyboardEvent): void {
  // Ignore shortcuts if typing in an input/textarea
  const activeElement = document.activeElement as HTMLElement | null;
  const isInput =
    activeElement &&
    (activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable);

  if (isInput) return;

  const isMetaOrCtrl = e.metaKey || e.ctrlKey;
  const isShift = e.shiftKey;
  const key = e.key.toLowerCase();

  const docStore = useDocumentStore.getState();
  const editStore = useEditorStore.getState();
  const projStore = useProjectStore.getState();

  const activePage = docStore.getActivePage();
  const selectedIds = editStore.selectedIds;

  // 1. Tool Selection (V, F, R, E, L, A, T, P)
  if (!isMetaOrCtrl && !isShift) {
    if (key === 'v') {
      e.preventDefault();
      editStore.setActiveTool('select');
      return;
    }
    if (key === 'f') {
      e.preventDefault();
      editStore.setActiveTool('frame');
      return;
    }
    if (key === 'r') {
      e.preventDefault();
      editStore.setActiveTool('rectangle');
      return;
    }
    if (key === 'e') {
      e.preventDefault();
      editStore.setActiveTool('ellipse');
      return;
    }
    if (key === 'l') {
      e.preventDefault();
      editStore.setActiveTool('line');
      return;
    }
    if (key === 'a') {
      e.preventDefault();
      editStore.setActiveTool('arrow');
      return;
    }
    if (key === 't') {
      e.preventDefault();
      editStore.setActiveTool('text');
      return;
    }
    if (key === 'p') {
      e.preventDefault();
      editStore.setActiveTool('pencil');
      return;
    }
  }

  // 2. Undo / Redo
  if (isMetaOrCtrl && key === 'z') {
    e.preventDefault();
    if (isShift) {
      docStore.redo();
    } else {
      docStore.undo();
    }
    return;
  }

  // 3. Select All (Ctrl/Cmd + A)
  if (isMetaOrCtrl && key === 'a') {
    e.preventDefault();
    if (activePage) {
      editStore.setSelectedIds(activePage.children.map((c) => c.id));
    }
    return;
  }

  // 4. Clipboard: Copy, Cut, Paste, Duplicate
  if (isMetaOrCtrl && key === 'c') {
    if (selectedIds.length > 0) {
      e.preventDefault();
      docStore.copy(selectedIds);
    }
    return;
  }

  if (isMetaOrCtrl && key === 'x') {
    if (selectedIds.length > 0) {
      e.preventDefault();
      docStore.cut(selectedIds);
      editStore.deselectAll();
    }
    return;
  }

  if (isMetaOrCtrl && key === 'v') {
    e.preventDefault();
    const pastedIds = docStore.paste();
    if (pastedIds.length > 0) {
      editStore.setSelectedIds(pastedIds);
    }
    return;
  }

  if (isMetaOrCtrl && key === 'd') {
    if (selectedIds.length > 0) {
      e.preventDefault();
      const dupedIds = docStore.duplicateNodes(selectedIds);
      if (dupedIds.length > 0) {
        editStore.setSelectedIds(dupedIds);
      }
    }
    return;
  }

  // 5. Grouping (Ctrl+G, Ctrl+Shift+G)
  if (isMetaOrCtrl && key === 'g') {
    e.preventDefault();
    if (isShift) {
      // Ungroup
      if (selectedIds.length === 1) {
        const restoredIds = docStore.ungroupNodes(selectedIds[0]);
        if (restoredIds.length > 0) {
          editStore.setSelectedIds(restoredIds);
        }
      }
    } else {
      // Group
      if (selectedIds.length >= 2) {
        const newGroupId = docStore.groupNodes(selectedIds);
        if (newGroupId) {
          editStore.setSelectedIds([newGroupId]);
        }
      }
    }
    return;
  }

  // 6. Layer Ordering (Ctrl+[, Ctrl+], Ctrl+Shift+[, Ctrl+Shift+])
  if (isMetaOrCtrl && (e.key === '[' || e.key === ']')) {
    e.preventDefault();
    if (selectedIds.length > 0) {
      if (e.key === ']') {
        docStore.reorderNodes(isShift ? 'front' : 'forward', selectedIds);
      } else {
        docStore.reorderNodes(isShift ? 'back' : 'backward', selectedIds);
      }
    }
    return;
  }

  // 7. Deletion (Delete or Backspace)
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedIds.length > 0) {
      e.preventDefault();
      docStore.deleteNodes(selectedIds);
      editStore.deselectAll();
    }
    return;
  }

  // 8. Escape: Deselect
  if (e.key === 'Escape') {
    e.preventDefault();
    editStore.deselectAll();
    editStore.setActiveTool('select');
    return;
  }

  // 9. Nudge with Arrow Keys (1px or 10px on Shift)
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    if (selectedIds.length > 0) {
      e.preventDefault();
      const step = isShift ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      if (e.key === 'ArrowRight') dx = step;
      if (e.key === 'ArrowUp') dy = -step;
      if (e.key === 'ArrowDown') dy = step;

      const updates = selectedIds.map((id) => {
        const node = docStore.getNodeById(id);
        return {
          id,
          props: {
            x: (node?.x || 0) + dx,
            y: (node?.y || 0) + dy
          }
        };
      });

      docStore.updateNodes(updates, true, 'Nudge elements');
    }
    return;
  }

  // 10. Help modal (?)
  if (e.key === '?' || (isShift && e.key === '/')) {
    e.preventDefault();
    projStore.setShortcutsModalOpen(true);
  }
}
