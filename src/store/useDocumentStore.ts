import { create } from 'zustand';
import { type ChigmaDocument, type Page, createDefaultDocument, createDefaultPage } from '../models/document';
import type { ChigmaNode, GroupNode } from '../models/node';
import { CommandHistory } from '../engine/commands/CommandHistory';
import {
  AddNodesCommand,
  DeleteNodesCommand,
  UpdateNodesPropsCommand,
  GroupNodesCommand,
  UngroupNodesCommand,
  ReorderNodesCommand
} from '../engine/commands/DocumentCommands';
import { generateId } from '../utils/id';
import { getNodesCompositeBounds } from '../engine/geometry/bounds';

export type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
export type DistributionType = 'horizontal' | 'vertical';
export type ReorderAction = 'front' | 'forward' | 'backward' | 'back';

export interface DocumentState {
  document: ChigmaDocument;
  activePageId: string;
  commandHistory: CommandHistory;
  clipboard: ChigmaNode[];
  isDirty: boolean;

  // History status triggers for reactive UI
  historyVersion: number;

  // Document actions
  setDocument: (doc: ChigmaDocument) => void;
  renameDocument: (name: string) => void;
  setActivePageId: (pageId: string) => void;
  addPage: (name?: string) => string;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;
  setPageBackground: (pageId: string, background: string) => void;

  // Node operations
  getActivePage: () => Page | undefined;
  getNodeById: (id: string) => ChigmaNode | undefined;
  addNode: (node: ChigmaNode) => void;
  addNodes: (nodes: ChigmaNode[]) => void;
  updateNode: (id: string, props: Partial<ChigmaNode>, commitHistory?: boolean, description?: string) => void;
  updateNodes: (updates: { id: string; props: Partial<ChigmaNode> }[], commitHistory?: boolean, description?: string) => void;
  deleteNodes: (ids: string[]) => void;
  duplicateNodes: (ids: string[]) => string[];
  reorderNodes: (action: ReorderAction, ids: string[]) => void;
  groupNodes: (ids: string[]) => string | null;
  ungroupNodes: (groupId: string) => string[];
  alignNodes: (type: AlignmentType, ids: string[]) => void;
  distributeNodes: (type: DistributionType, ids: string[]) => void;

  // Clipboard
  copy: (ids: string[]) => void;
  cut: (ids: string[]) => void;
  paste: (offset?: { x: number; y: number }) => string[];

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useDocumentStore = create<DocumentState>((set, get) => {
  const initialDoc = createDefaultDocument();
  const initialPageId = initialDoc.pages[0].id;
  const history = new CommandHistory();

  const markDirty = () => {
    set((state) => ({
      isDirty: true,
      historyVersion: state.historyVersion + 1,
      document: {
        ...state.document,
        updatedAt: Date.now()
      }
    }));
  };

  return {
    document: initialDoc,
    activePageId: initialPageId,
    commandHistory: history,
    clipboard: [],
    isDirty: false,
    historyVersion: 0,

    setDocument: (doc) => {
      history.clear();
      set({
        document: doc,
        activePageId: doc.pages[0]?.id || '',
        isDirty: false,
        historyVersion: 0
      });
    },

    renameDocument: (name) => {
      set((state) => ({
        document: { ...state.document, name, updatedAt: Date.now() },
        isDirty: true
      }));
    },

    setActivePageId: (pageId) => set({ activePageId: pageId }),

    addPage: (name) => {
      const newPage = createDefaultPage(name || `Page ${get().document.pages.length + 1}`);
      set((state) => ({
        document: {
          ...state.document,
          pages: [...state.document.pages, newPage],
          updatedAt: Date.now()
        },
        activePageId: newPage.id,
        isDirty: true
      }));
      return newPage.id;
    },

    renamePage: (pageId, name) => {
      set((state) => ({
        document: {
          ...state.document,
          pages: state.document.pages.map((p) => (p.id === pageId ? { ...p, name } : p)),
          updatedAt: Date.now()
        },
        isDirty: true
      }));
    },

    deletePage: (pageId) => {
      const state = get();
      if (state.document.pages.length <= 1) return;
      const nextPages = state.document.pages.filter((p) => p.id !== pageId);
      const nextActive = state.activePageId === pageId ? nextPages[0].id : state.activePageId;
      set({
        document: { ...state.document, pages: nextPages, updatedAt: Date.now() },
        activePageId: nextActive,
        isDirty: true
      });
    },

    setPageBackground: (pageId, background) => {
      set((state) => ({
        document: {
          ...state.document,
          pages: state.document.pages.map((p) => (p.id === pageId ? { ...p, background } : p)),
          updatedAt: Date.now()
        },
        isDirty: true
      }));
    },

    getActivePage: () => {
      const { document, activePageId } = get();
      return document.pages.find((p) => p.id === activePageId) || document.pages[0];
    },

    getNodeById: (id) => {
      const page = get().getActivePage();
      if (!page) return undefined;
      const findRecursively = (nodes: ChigmaNode[]): ChigmaNode | undefined => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if ('children' in n && Array.isArray((n as GroupNode).children)) {
            const found = findRecursively((n as GroupNode).children);
            if (found) return found;
          }
        }
        return undefined;
      };
      return findRecursively(page.children);
    },

    addNode: (node) => {
      get().addNodes([node]);
    },

    addNodes: (nodes) => {
      const { activePageId, commandHistory } = get();
      const rawAdd = (pId: string, toAdd: ChigmaNode[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) =>
              p.id === pId ? { ...p, children: [...p.children, ...toAdd] } : p
            )
          }
        }));
        markDirty();
      };

      const rawRemove = (pId: string, nodeIds: string[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) =>
              p.id === pId ? { ...p, children: p.children.filter((n) => !nodeIds.includes(n.id)) } : p
            )
          }
        }));
        markDirty();
      };

      const cmd = new AddNodesCommand(nodes, activePageId, rawAdd, rawRemove);
      commandHistory.execute(cmd);
    },

    updateNode: (id, props, commitHistory = true, description = 'Update element') => {
      get().updateNodes([{ id, props }], commitHistory, description);
    },

    updateNodes: (updates, commitHistory = true, description = 'Update elements') => {
      const { activePageId, commandHistory } = get();
      const page = get().getActivePage();
      if (!page) return;

      const diffs = updates.map((u) => {
        const current = get().getNodeById(u.id);
        const before: Partial<ChigmaNode> = {};
        if (current) {
          for (const k of Object.keys(u.props) as (keyof ChigmaNode)[]) {
            (before as any)[k] = current[k];
          }
        }
        return { id: u.id, before, after: u.props };
      });

      const applyUpdates = (pId: string, upList: { id: string; props: Partial<ChigmaNode> }[]) => {
        const updateRecursive = (nodes: ChigmaNode[]): ChigmaNode[] => {
          return nodes.map((node) => {
            const match = upList.find((u) => u.id === node.id);
            let updated = match ? ({ ...node, ...match.props } as ChigmaNode) : node;
            if ('children' in updated && Array.isArray((updated as GroupNode).children)) {
              updated = {
                ...updated,
                children: updateRecursive((updated as GroupNode).children)
              } as GroupNode;
            }
            return updated;
          });
        };

        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) =>
              p.id === pId ? { ...p, children: updateRecursive(p.children) } : p
            )
          }
        }));
        markDirty();
      };

      if (commitHistory) {
        const cmd = new UpdateNodesPropsCommand(activePageId, diffs, applyUpdates, description);
        commandHistory.execute(cmd);
      } else {
        applyUpdates(activePageId, updates);
      }
    },

    deleteNodes: (ids) => {
      const { activePageId, commandHistory } = get();
      const page = get().getActivePage();
      if (!page || ids.length === 0) return;

      const nodesWithIndex: { node: ChigmaNode; index: number }[] = [];
      page.children.forEach((node, idx) => {
        if (ids.includes(node.id)) {
          nodesWithIndex.push({ node, index: idx });
        }
      });

      if (nodesWithIndex.length === 0) return;

      const restoreFn = (pId: string, items: { node: ChigmaNode; index: number }[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => {
              if (p.id !== pId) return p;
              const next = [...p.children];
              items.forEach((item) => {
                next.splice(Math.min(item.index, next.length), 0, item.node);
              });
              return { ...p, children: next };
            })
          }
        }));
        markDirty();
      };

      const removeFn = (pId: string, nodeIds: string[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) =>
              p.id === pId ? { ...p, children: p.children.filter((n) => !nodeIds.includes(n.id)) } : p
            )
          }
        }));
        markDirty();
      };

      const cmd = new DeleteNodesCommand(nodesWithIndex, activePageId, restoreFn, removeFn);
      commandHistory.execute(cmd);
    },

    duplicateNodes: (ids) => {
      const page = get().getActivePage();
      if (!page) return [];

      const clones: ChigmaNode[] = [];
      const cloneNode = (n: ChigmaNode, offsetX = 20, offsetY = 20): ChigmaNode => {
        const newId = generateId('node');
        const cloned: ChigmaNode = {
          ...JSON.parse(JSON.stringify(n)),
          id: newId,
          x: n.x + offsetX,
          y: n.y + offsetY,
          name: `${n.name} Copy`
        };
        if ('children' in cloned && Array.isArray((cloned as GroupNode).children)) {
          (cloned as GroupNode).children = (cloned as GroupNode).children.map((c) => cloneNode(c, 0, 0));
        }
        return cloned;
      };

      page.children.forEach((n) => {
        if (ids.includes(n.id)) {
          clones.push(cloneNode(n));
        }
      });

      if (clones.length > 0) {
        get().addNodes(clones);
        return clones.map((c) => c.id);
      }
      return [];
    },

    reorderNodes: (action, ids) => {
      const page = get().getActivePage();
      if (!page || ids.length === 0) return;

      const beforeNodes = [...page.children];
      let afterNodes = [...page.children];

      if (action === 'front') {
        const selected = afterNodes.filter((n) => ids.includes(n.id));
        const remaining = afterNodes.filter((n) => !ids.includes(n.id));
        afterNodes = [...remaining, ...selected];
      } else if (action === 'back') {
        const selected = afterNodes.filter((n) => ids.includes(n.id));
        const remaining = afterNodes.filter((n) => !ids.includes(n.id));
        afterNodes = [...selected, ...remaining];
      } else if (action === 'forward') {
        for (let i = afterNodes.length - 2; i >= 0; i--) {
          if (ids.includes(afterNodes[i].id) && !ids.includes(afterNodes[i + 1].id)) {
            const temp = afterNodes[i];
            afterNodes[i] = afterNodes[i + 1];
            afterNodes[i + 1] = temp;
          }
        }
      } else if (action === 'backward') {
        for (let i = 1; i < afterNodes.length; i++) {
          if (ids.includes(afterNodes[i].id) && !ids.includes(afterNodes[i - 1].id)) {
            const temp = afterNodes[i];
            afterNodes[i] = afterNodes[i - 1];
            afterNodes[i - 1] = temp;
          }
        }
      }

      const setNodesFn = (pId: string, nodes: ChigmaNode[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => (p.id === pId ? { ...p, children: nodes } : p))
          }
        }));
        markDirty();
      };

      const cmd = new ReorderNodesCommand(page.id, beforeNodes, afterNodes, setNodesFn);
      get().commandHistory.execute(cmd);
    },

    groupNodes: (ids) => {
      const page = get().getActivePage();
      if (!page || ids.length < 2) return null;

      const selected = page.children.filter((n) => ids.includes(n.id));
      if (selected.length < 2) return null;

      const bounds = getNodesCompositeBounds(selected);
      if (!bounds) return null;

      const groupId = generateId('group');
      const groupNode: GroupNode = {
        id: groupId,
        type: 'group',
        name: 'Group',
        x: bounds.minX,
        y: bounds.minY,
        width: bounds.width,
        height: bounds.height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        children: selected.map((n) => ({
          ...n,
          parentId: groupId,
          x: n.x - bounds.minX,
          y: n.y - bounds.minY
        }))
      };

      const groupFn = (pId: string, gNode: ChigmaNode, memberIds: string[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => {
              if (p.id !== pId) return p;
              const remaining = p.children.filter((n) => !memberIds.includes(n.id));
              return { ...p, children: [...remaining, gNode] };
            })
          }
        }));
        markDirty();
      };

      const ungroupFn = (pId: string, gId: string) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => {
              if (p.id !== pId) return p;
              const g = p.children.find((n) => n.id === gId) as GroupNode | undefined;
              if (!g) return p;
              const unGrouped = g.children.map((c) => ({
                ...c,
                parentId: undefined,
                x: c.x + g.x,
                y: c.y + g.y
              }));
              const remaining = p.children.filter((n) => n.id !== gId);
              return { ...p, children: [...remaining, ...unGrouped] };
            })
          }
        }));
        markDirty();
      };

      const cmd = new GroupNodesCommand(page.id, groupNode, ids, groupFn, ungroupFn);
      get().commandHistory.execute(cmd);
      return groupId;
    },

    ungroupNodes: (groupId) => {
      const page = get().getActivePage();
      if (!page) return [];

      const group = page.children.find((n) => n.id === groupId) as GroupNode | undefined;
      if (!group || group.type !== 'group' || !group.children) return [];

      const restored = group.children.map((c) => ({
        ...c,
        parentId: undefined,
        x: c.x + group.x,
        y: c.y + group.y
      }));

      const ungroupFn = (pId: string, gId: string) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => {
              if (p.id !== pId) return p;
              const g = p.children.find((n) => n.id === gId) as GroupNode | undefined;
              if (!g) return p;
              const unGrouped = g.children.map((c) => ({
                ...c,
                parentId: undefined,
                x: c.x + g.x,
                y: c.y + g.y
              }));
              const remaining = p.children.filter((n) => n.id !== gId);
              return { ...p, children: [...remaining, ...unGrouped] };
            })
          }
        }));
        markDirty();
      };

      const regroupFn = (pId: string, gNode: ChigmaNode, children: ChigmaNode[]) => {
        set((state) => ({
          document: {
            ...state.document,
            pages: state.document.pages.map((p) => {
              if (p.id !== pId) return p;
              const childIds = children.map((c) => c.id);
              const remaining = p.children.filter((n) => !childIds.includes(n.id));
              return { ...p, children: [...remaining, gNode] };
            })
          }
        }));
        markDirty();
      };

      const cmd = new UngroupNodesCommand(page.id, group, restored, ungroupFn, regroupFn);
      get().commandHistory.execute(cmd);
      return restored.map((r) => r.id);
    },

    alignNodes: (type, ids) => {
      const page = get().getActivePage();
      if (!page || ids.length < 2) return;

      const nodes = page.children.filter((n) => ids.includes(n.id));
      if (nodes.length < 2) return;

      const bounds = getNodesCompositeBounds(nodes);
      if (!bounds) return;

      const updates: { id: string; props: Partial<ChigmaNode> }[] = [];

      nodes.forEach((n) => {
        switch (type) {
          case 'left':
            updates.push({ id: n.id, props: { x: bounds.minX } });
            break;
          case 'center':
            updates.push({ id: n.id, props: { x: bounds.minX + (bounds.width - n.width) / 2 } });
            break;
          case 'right':
            updates.push({ id: n.id, props: { x: bounds.maxX - n.width } });
            break;
          case 'top':
            updates.push({ id: n.id, props: { y: bounds.minY } });
            break;
          case 'middle':
            updates.push({ id: n.id, props: { y: bounds.minY + (bounds.height - n.height) / 2 } });
            break;
          case 'bottom':
            updates.push({ id: n.id, props: { y: bounds.maxY - n.height } });
            break;
        }
      });

      get().updateNodes(updates, true, `Align ${type}`);
    },

    distributeNodes: (type, ids) => {
      const page = get().getActivePage();
      if (!page || ids.length < 3) return;

      const nodes = page.children.filter((n) => ids.includes(n.id));
      if (nodes.length < 3) return;

      const updates: { id: string; props: Partial<ChigmaNode> }[] = [];

      if (type === 'horizontal') {
        const sorted = [...nodes].sort((a, b) => a.x - b.x);
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalSpan = last.x + last.width - first.x;
        const totalNodeWidth = sorted.reduce((acc, n) => acc + n.width, 0);
        const gap = (totalSpan - totalNodeWidth) / (sorted.length - 1);

        let currentX = first.x;
        sorted.forEach((n) => {
          updates.push({ id: n.id, props: { x: Math.round(currentX) } });
          currentX += n.width + gap;
        });
      } else {
        const sorted = [...nodes].sort((a, b) => a.y - b.y);
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalSpan = last.y + last.height - first.y;
        const totalNodeHeight = sorted.reduce((acc, n) => acc + n.height, 0);
        const gap = (totalSpan - totalNodeHeight) / (sorted.length - 1);

        let currentY = first.y;
        sorted.forEach((n) => {
          updates.push({ id: n.id, props: { y: Math.round(currentY) } });
          currentY += n.height + gap;
        });
      }

      get().updateNodes(updates, true, `Distribute ${type}`);
    },

    copy: (ids) => {
      const page = get().getActivePage();
      if (!page) return;
      const toCopy = page.children.filter((n) => ids.includes(n.id));
      set({ clipboard: JSON.parse(JSON.stringify(toCopy)) });
    },

    cut: (ids) => {
      get().copy(ids);
      get().deleteNodes(ids);
    },

    paste: (offset = { x: 24, y: 24 }) => {
      const { clipboard } = get();
      if (clipboard.length === 0) return [];

      const clones: ChigmaNode[] = [];
      const cloneRecursive = (n: ChigmaNode, offX: number, offY: number): ChigmaNode => {
        const newId = generateId('node');
        const cloned: ChigmaNode = {
          ...JSON.parse(JSON.stringify(n)),
          id: newId,
          x: n.x + offX,
          y: n.y + offY
        };
        if ('children' in cloned && Array.isArray((cloned as GroupNode).children)) {
          (cloned as GroupNode).children = (cloned as GroupNode).children.map((c) => cloneRecursive(c, 0, 0));
        }
        return cloned;
      };

      clipboard.forEach((item) => {
        clones.push(cloneRecursive(item, offset.x, offset.y));
      });

      get().addNodes(clones);
      return clones.map((c) => c.id);
    },

    undo: () => {
      get().commandHistory.undo();
      set((state) => ({ historyVersion: state.historyVersion + 1, isDirty: true }));
    },

    redo: () => {
      get().commandHistory.redo();
      set((state) => ({ historyVersion: state.historyVersion + 1, isDirty: true }));
    },

    canUndo: () => get().commandHistory.canUndo(),
    canRedo: () => get().commandHistory.canRedo()
  };
});
