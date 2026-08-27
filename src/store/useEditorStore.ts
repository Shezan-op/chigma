import { create } from 'zustand';
import { type Viewport, calculateZoomAroundPoint } from '../engine/geometry/matrix';
import type { SnapGuide } from '../engine/geometry/snapping';
import type { NodeType } from '../models/node';
import { getPreference, setPreference } from '../persistence/preferencesStorage';

export type ToolType = 'select' | 'hand' | 'frame' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polygon' | 'pencil' | 'text';

export interface MarqueeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface DragInteractionState {
  type: 'move' | 'resize' | 'rotate' | 'draw' | 'pan' | 'pencil';
  handle?: string;
  startWorldX: number;
  startWorldY: number;
  startScreenX: number;
  startScreenY: number;
  initialNodes?: Record<string, { x: number; y: number; width: number; height: number; rotation: number }>;
}

export interface EditorState {
  // Viewport
  viewport: Viewport;
  setViewport: (viewport: Partial<Viewport>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  zoomAroundPoint: (screenX: number, screenY: number, newZoom: number) => void;
  pan: (dx: number, dy: number) => void;

  // Active Tool
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;

  // Selection
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  selectNode: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;

  // Measurement & Alt Key
  altPressed: boolean;
  setAltPressed: (pressed: boolean) => void;

  // Inline Text Editing
  editingTextNodeId: string | null;
  setEditingTextNodeId: (id: string | null) => void;

  // Grid, Rulers & Snapping
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  snapToObjects: boolean;
  setSnapToObjects: (snap: boolean) => void;

  // Visual Overlays & Temporary Guides
  activeSnapGuides: SnapGuide[];
  setActiveSnapGuides: (guides: SnapGuide[]) => void;
  marquee: MarqueeState | null;
  setMarquee: (marquee: MarqueeState | null) => void;

  // Transient Drag Interaction
  interaction: DragInteractionState | null;
  setInteraction: (interaction: DragInteractionState | null) => void;

  // Duplicate Memory (Offset tracking)
  lastDuplicateOffset: { x: number; y: number } | null;
  setLastDuplicateOffset: (offset: { x: number; y: number } | null) => void;

  // UI Panels
  leftSidebarTab: 'layers' | 'components';
  setLeftSidebarTab: (tab: 'layers' | 'components') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  propertiesCollapsed: boolean;
  setPropertiesCollapsed: (collapsed: boolean) => void;

  // Modals, Palettes & Tools
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isCodeExportModalOpen: boolean;
  setCodeExportModalOpen: (open: boolean) => void;
  isPrototypeMode: boolean;
  setPrototypeMode: (open: boolean) => void;
  isIconPickerOpen: boolean;
  setIconPickerOpen: (open: boolean) => void;
  isDesignSystemModalOpen: boolean;
  setDesignSystemModalOpen: (open: boolean) => void;
  isAccessibilityModalOpen: boolean;
  setAccessibilityModalOpen: (open: boolean) => void;
  isResponsivePreviewOpen: boolean;
  setResponsivePreviewOpen: (open: boolean) => void;

  // Active Drawing Shape preview
  drawingShapeType: NodeType | null;
  setDrawingShapeType: (type: NodeType | null) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  viewport: {
    zoom: 1,
    panX: 200,
    panY: 100
  },
  setViewport: (partial) =>
    set((state) => ({ viewport: { ...state.viewport, ...partial } })),

  zoomIn: () => {
    const current = get().viewport.zoom;
    const next = Math.min(32, Math.round(current * 1.25 * 100) / 100);
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  zoomOut: () => {
    const current = get().viewport.zoom;
    const next = Math.max(0.05, Math.round((current / 1.25) * 100) / 100);
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  setZoom: (zoom) => {
    const next = Math.min(32, Math.max(0.05, zoom));
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  resetZoom: () => {
    set((state) => ({ viewport: { ...state.viewport, zoom: 1 } }));
  },

  zoomAroundPoint: (screenX, screenY, newZoom) => {
    const { viewport } = get();
    const nextVp = calculateZoomAroundPoint(viewport, { x: screenX, y: screenY }, newZoom);
    set({ viewport: nextVp });
  },

  pan: (dx, dy) => {
    set((state) => ({
      viewport: {
        ...state.viewport,
        panX: state.viewport.panX + dx,
        panY: state.viewport.panY + dy
      }
    }));
  },

  activeTool: 'select',
  setActiveTool: (tool) => {
    set({ activeTool: tool });
    if (tool !== 'select' && tool !== 'hand') {
      get().deselectAll();
    }
  },

  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  selectNode: (id, multi = false) => {
    const { selectedIds } = get();
    if (multi) {
      if (selectedIds.includes(id)) {
        set({ selectedIds: selectedIds.filter((item) => item !== id) });
      } else {
        set({ selectedIds: [...selectedIds, id] });
      }
    } else {
      set({ selectedIds: [id] });
    }
  },
  deselectAll: () => set({ selectedIds: [] }),
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),

  altPressed: false,
  setAltPressed: (pressed) => set({ altPressed: pressed }),

  editingTextNodeId: null,
  setEditingTextNodeId: (id) => set({ editingTextNodeId: id }),

  showGrid: getPreference('showGrid', true),
  setShowGrid: (show) => {
    set({ showGrid: show });
    setPreference('showGrid', show);
  },

  showRulers: getPreference('showRulers', true),
  setShowRulers: (show) => {
    set({ showRulers: show });
    setPreference('showRulers', show);
  },

  gridSize: getPreference('gridSize', 8),
  setGridSize: (size) => {
    set({ gridSize: size });
    setPreference('gridSize', size);
  },

  snapToGrid: getPreference('snapToGrid', true),
  setSnapToGrid: (snap) => {
    set({ snapToGrid: snap });
    setPreference('snapToGrid', snap);
  },

  snapToObjects: getPreference('snapToObjects', true),
  setSnapToObjects: (snap) => {
    set({ snapToObjects: snap });
    setPreference('snapToObjects', snap);
  },

  activeSnapGuides: [],
  setActiveSnapGuides: (guides) => set({ activeSnapGuides: guides }),
  marquee: null,
  setMarquee: (marquee) => set({ marquee }),

  interaction: null,
  setInteraction: (interaction) => set({ interaction }),

  lastDuplicateOffset: null,
  setLastDuplicateOffset: (offset) => set({ lastDuplicateOffset: offset }),

  leftSidebarTab: getPreference('leftSidebarTab', 'layers'),
  setLeftSidebarTab: (tab) => {
    set({ leftSidebarTab: tab });
    setPreference('leftSidebarTab', tab);
  },

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  propertiesCollapsed: false,
  setPropertiesCollapsed: (collapsed) => set({ propertiesCollapsed: collapsed }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  isCodeExportModalOpen: false,
  setCodeExportModalOpen: (open) => set({ isCodeExportModalOpen: open }),

  isPrototypeMode: false,
  setPrototypeMode: (open) => set({ isPrototypeMode: open }),

  isIconPickerOpen: false,
  setIconPickerOpen: (open) => set({ isIconPickerOpen: open }),

  isDesignSystemModalOpen: false,
  setDesignSystemModalOpen: (open) => set({ isDesignSystemModalOpen: open }),

  isAccessibilityModalOpen: false,
  setAccessibilityModalOpen: (open) => set({ isAccessibilityModalOpen: open }),

  isResponsivePreviewOpen: false,
  setResponsivePreviewOpen: (open) => set({ isResponsivePreviewOpen: open }),

  drawingShapeType: null,
  setDrawingShapeType: (type) => set({ drawingShapeType: type })
}));
