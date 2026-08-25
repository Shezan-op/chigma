import { create } from 'zustand';
import type { ProjectMetadata, ChigmaDocument } from '../models/document';
import {
  getAllProjects,
  getProjectById,
  saveProject,
  createNewProject,
  duplicateProject,
  renameProject,
  deleteProject
} from '../persistence/projectStorage';
import { getPreference, setPreference } from '../persistence/preferencesStorage';

export interface ProjectState {
  projects: ProjectMetadata[];
  activeProjectId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;

  // Dialogs / Modals
  isExportModalOpen: boolean;
  isImportModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null;

  // Actions
  loadProjectsList: () => Promise<void>;
  openProject: (id: string) => Promise<ChigmaDocument | null>;
  createProject: (name?: string) => Promise<ChigmaDocument>;
  saveCurrentProject: (doc: ChigmaDocument, thumbnail?: string) => Promise<void>;
  cloneProject: (id: string) => Promise<ChigmaDocument | null>;
  renameProjectItem: (id: string, name: string) => Promise<void>;
  deleteProjectItem: (id: string) => Promise<void>;

  setExportModalOpen: (open: boolean) => void;
  setImportModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  showConfirmModal: (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => void;
  closeConfirmModal: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProjectId: getPreference('lastOpenedProjectId', undefined) || null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,

  isExportModalOpen: false,
  isImportModalOpen: false,
  isShortcutsModalOpen: false,
  confirmModal: null,

  loadProjectsList: async () => {
    set({ isLoading: true });
    try {
      const list = await getAllProjects();
      set({ projects: list, isLoading: false });
    } catch (err) {
      console.error('Failed to load project list:', err);
      set({ isLoading: false });
    }
  },

  openProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const doc = await getProjectById(id);
      if (doc) {
        setPreference('lastOpenedProjectId', id);
        set({ activeProjectId: id, isLoading: false });
        return doc;
      }
      set({ isLoading: false });
      return null;
    } catch (err) {
      console.error('Failed to open project:', err);
      set({ isLoading: false });
      return null;
    }
  },

  createProject: async (name = 'Untitled Design') => {
    set({ isLoading: true });
    try {
      const newDoc = await createNewProject(name);
      setPreference('lastOpenedProjectId', newDoc.id);
      set((state) => ({
        activeProjectId: newDoc.id,
        isLoading: false,
        projects: [
          {
            id: newDoc.id,
            name: newDoc.name,
            createdAt: newDoc.createdAt,
            updatedAt: newDoc.updatedAt,
            pageCount: newDoc.pages.length,
            nodeCount: 0
          },
          ...state.projects
        ]
      }));
      return newDoc;
    } catch (err) {
      console.error('Failed to create project:', err);
      set({ isLoading: false });
      throw err;
    }
  },

  saveCurrentProject: async (doc: ChigmaDocument, thumbnail?: string) => {
    set({ isSaving: true });
    try {
      await saveProject(doc, thumbnail);
      set({
        isSaving: false,
        lastSavedAt: Date.now()
      });
      // Refresh list metadata silently
      const list = await getAllProjects();
      set({ projects: list });
    } catch (err) {
      console.error('Failed to save project:', err);
      set({ isSaving: false });
    }
  },

  cloneProject: async (id: string) => {
    const cloned = await duplicateProject(id);
    if (cloned) {
      await get().loadProjectsList();
    }
    return cloned;
  },

  renameProjectItem: async (id: string, name: string) => {
    await renameProject(id, name);
    await get().loadProjectsList();
  },

  deleteProjectItem: async (id: string) => {
    await deleteProject(id);
    if (get().activeProjectId === id) {
      setPreference('lastOpenedProjectId', undefined as any);
      set({ activeProjectId: null });
    }
    await get().loadProjectsList();
  },

  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setImportModalOpen: (open) => set({ isImportModalOpen: open }),
  setShortcutsModalOpen: (open) => set({ isShortcutsModalOpen: open }),

  showConfirmModal: (title, message, onConfirm, confirmLabel = 'Delete') => {
    set({
      confirmModal: {
        isOpen: true,
        title,
        message,
        confirmLabel,
        onConfirm: () => {
          onConfirm();
          get().closeConfirmModal();
        }
      }
    });
  },

  closeConfirmModal: () => set({ confirmModal: null })
}));
