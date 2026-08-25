import { create } from 'zustand';
import { type Viewport, calculateZoomAroundPoint } from '../engine/geometry/matrix';
import type { SnapGuide } from '../engine/geometry/snapping';
import type { NodeType } from '../models/node';
import { getPreference, setPreference } from '../persistence/preferencesStorage';

export type ToolType = 'select' | 'frame' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polygon' | 'pencil' | 'text';

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

  // Inline Text Editing
  editingTextNodeId: string | null;
  setEditingTextNodeId: (id: string | null) => void;

  // Grid & Snapping
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
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

  // UI Panels
  leftSidebarTab: 'layers' | 'components';
  setLeftSidebarTab: (tab: 'layers' | 'components') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  propertiesCollapsed: boolean;
  setPropertiesCollapsed: (collapsed: boolean) => void;

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
    const next = Math.min(32, Math.round((current * 1.2) * 100) / 100);
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  zoomOut: () => {
    const current = get().viewport.zoom;
    const next = Math.max(0.05, Math.round((current / 1.2) * 100) / 100);
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  setZoom: (zoom) => {
    const next = Math.min(32, Math.max(0.05, zoom));
    set((state) => ({ viewport: { ...state.viewport, zoom: next } }));
  },

  resetZoom: () => {
    set((state) => ({ viewport: { ...state.viewport, zoom: 1 } }));
  },

  zoomAroundPoint: (screenX, screenY, nextZoom) => {
    const next = calculateZoomAroundPoint(get().viewport, { x: screenX, y: screenY }, nextZoom);
    set({ viewport: next });
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
    set({ activeTool: tool, drawingShapeType: tool === 'select' ? null : (tool as NodeType) });
  },

  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  selectNode: (id, multi = false) => {
    const current = get().selectedIds;
    if (multi) {
      if (current.includes(id)) {
        set({ selectedIds: current.filter((x) => x !== id) });
      } else {
        set({ selectedIds: [...current, id] });
      }
    } else {
      set({ selectedIds: [id] });
    }
  },
  deselectAll: () => set({ selectedIds: [], editingTextNodeId: null }),
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),

  editingTextNodeId: null,
  setEditingTextNodeId: (id) => set({ editingTextNodeId: id }),

  showGrid: getPreference('showGrid', true),
  setShowGrid: (show) => {
    setPreference('showGrid', show);
    set({ showGrid: show });
  },

  gridSize: getPreference('gridSize', 8),
  setGridSize: (size) => {
    setPreference('gridSize', size);
    set({ gridSize: size });
  },

  snapToGrid: getPreference('snapToGrid', true),
  setSnapToGrid: (snap) => {
    setPreference('snapToGrid', snap);
    set({ snapToGrid: snap });
  },

  snapToObjects: getPreference('snapToObjects', true),
  setSnapToObjects: (snap) => {
    setPreference('snapToObjects', snap);
    set({ snapToObjects: snap });
  },

  activeSnapGuides: [],
  setActiveSnapGuides: (guides) => set({ activeSnapGuides: guides }),
  marquee: null,
  setMarquee: (marquee) => set({ marquee }),

  interaction: null,
  setInteraction: (interaction) => set({ interaction }),

  leftSidebarTab: getPreference('leftSidebarTab', 'layers'),
  setLeftSidebarTab: (tab) => {
    setPreference('leftSidebarTab', tab);
    set({ leftSidebarTab: tab });
  },

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  propertiesCollapsed: false,
  setPropertiesCollapsed: (collapsed) => set({ propertiesCollapsed: collapsed }),

  drawingShapeType: null,
  setDrawingShapeType: (type) => set({ drawingShapeType: type })
}));
