import { useEffect, useRef } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import { useProjectStore } from '../store/useProjectStore';
import { saveCrashRecoverySnapshot } from './storageManager';

export function useAutosave(debounceMs = 600) {
  const document = useDocumentStore((s) => s.document);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDirty || !document) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(async () => {
      try {
        await saveCurrentProject(document);
        saveCrashRecoverySnapshot(document);
        // Clean dirty flag without changing history stack
        useDocumentStore.setState({ isDirty: false });
      } catch (err) {
        console.error('Autosave failed:', err);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [document, isDirty, saveCurrentProject, debounceMs]);
}
