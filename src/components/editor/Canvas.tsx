import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { DocumentRenderer } from '../../engine/renderer/DocumentRenderer';
import { TransformOverlay } from './TransformOverlay';
import { SnappingGuidesOverlay } from './SnappingGuidesOverlay';
import { MarqueeOverlay } from './MarqueeOverlay';
import { TextEditorOverlay } from './TextEditorOverlay';
import { RulersOverlay } from './RulersOverlay';
import { screenToWorld } from '../../engine/geometry/matrix';
import { calculateResize, type HandleType } from '../../engine/geometry/resize';
import { calculateRotation } from '../../engine/geometry/rotation';
import { calculateSnapping } from '../../engine/geometry/snapping';
import { isPointInNode, doesMarqueeIntersectNode } from '../../engine/geometry/bounds';
import { createDefaultNode } from '../../models/document';
import type { ChigmaNode, TextNode, PencilPoint, PencilNode } from '../../models/node';
import { readFileAsDataURL } from '../../utils/file';

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Editor Store
  const {
    viewport,
    pan,
    zoomAroundPoint,
    activeTool,
    setActiveTool,
    selectedIds,
    setSelectedIds,
    selectNode,
    deselectAll,
    setHoveredId,
    editingTextNodeId,
    setEditingTextNodeId,
    showGrid,
    showRulers,
    gridSize,
    snapToGrid,
    snapToObjects,
    activeSnapGuides,
    setActiveSnapGuides,
    marquee,
    setMarquee,
    interaction,
    setInteraction
  } = useEditorStore();

  // Document Store
  const {
    getActivePage,
    addNode,
    updateNodes,
    getNodeById
  } = useDocumentStore();

  const activePage = getActivePage();

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for Spacebar hold for Hand/Pan Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer Down on Canvas / SVG
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current || !activePage) return;
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPoint = screenToWorld({ x: screenX, y: screenY }, viewport);

    // Hand tool, Spacebar hold, Middle Click or Alt Click -> Pan
    if (activeTool === 'hand' || isSpacePressed || e.button === 1 || e.altKey) {
      setInteraction({
        type: 'pan',
        startScreenX: screenX,
        startScreenY: screenY,
        startWorldX: worldPoint.x,
        startWorldY: worldPoint.y
      });
      return;
    }

    // Only handle Primary Left Click
    if (e.button !== 0) return;

    // 1. Drawing Mode
    if (activeTool !== 'select') {
      if (activeTool === 'pencil') {
        const initialPencil: PencilNode = createDefaultNode('pencil', worldPoint.x, worldPoint.y, {
          points: [{ x: 0, y: 0 }]
        }) as PencilNode;

        addNode(initialPencil);
        setSelectedIds([initialPencil.id]);

        setInteraction({
          type: 'pencil',
          startScreenX: screenX,
          startScreenY: screenY,
          startWorldX: worldPoint.x,
          startWorldY: worldPoint.y,
          initialNodes: {
            [initialPencil.id]: {
              x: initialPencil.x,
              y: initialPencil.y,
              width: initialPencil.width,
              height: initialPencil.height,
              rotation: 0
            }
          }
        });
      } else if (activeTool === 'text') {
        const textNode = createDefaultNode('text', worldPoint.x, worldPoint.y, {
          text: 'Type text here...'
        }) as TextNode;
        addNode(textNode);
        setSelectedIds([textNode.id]);
        setActiveTool('select');
        setEditingTextNodeId(textNode.id);
      } else {
        // Shape / Frame creation via drag
        const newNode = createDefaultNode(activeTool, worldPoint.x, worldPoint.y, {
          width: 1,
          height: 1
        });
        addNode(newNode);
        setSelectedIds([newNode.id]);

        setInteraction({
          type: 'draw',
          startScreenX: screenX,
          startScreenY: screenY,
          startWorldX: worldPoint.x,
          startWorldY: worldPoint.y,
          initialNodes: {
            [newNode.id]: {
              x: newNode.x,
              y: newNode.y,
              width: 1,
              height: 1,
              rotation: 0
            }
          }
        });
      }
      return;
    }

    // 2. Select Tool: Check Click Targets
    const target = e.target as HTMLElement | SVGElement;
    const handleEl = target.closest('[data-handle-type]') as HTMLElement | null;

    if (handleEl) {
      const handleType = handleEl.getAttribute('data-handle-type') as HandleType;
      const initialMap: Record<string, any> = {};
      selectedIds.forEach((id) => {
        const n = getNodeById(id);
        if (n) {
          initialMap[id] = {
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            rotation: n.rotation || 0
          };
        }
      });

      if (handleType === 'rotate') {
        setInteraction({
          type: 'rotate',
          handle: 'rotate',
          startScreenX: screenX,
          startScreenY: screenY,
          startWorldX: worldPoint.x,
          startWorldY: worldPoint.y,
          initialNodes: initialMap
        });
      } else {
        setInteraction({
          type: 'resize',
          handle: handleType,
          startScreenX: screenX,
          startScreenY: screenY,
          startWorldX: worldPoint.x,
          startWorldY: worldPoint.y,
          initialNodes: initialMap
        });
      }
      return;
    }

    // Check if clicked directly on an existing node
    const nodeEl = target.closest('[data-node-id]') as HTMLElement | null;
    let clickedNode: ChigmaNode | undefined;

    if (nodeEl) {
      const nodeId = nodeEl.getAttribute('data-node-id');
      if (nodeId) {
        clickedNode = getNodeById(nodeId);
      }
    }

    // Fallback: Geometric Hit-test in reverse order (top to bottom)
    if (!clickedNode && activePage.children) {
      for (let i = activePage.children.length - 1; i >= 0; i--) {
        const n = activePage.children[i];
        if (n.visible && !n.locked && isPointInNode(worldPoint, n)) {
          clickedNode = n;
          break;
        }
      }
    }

    if (clickedNode) {
      if (e.shiftKey) {
        selectNode(clickedNode.id, true);
      } else {
        if (!selectedIds.includes(clickedNode.id)) {
          selectNode(clickedNode.id, false);
        }
      }

      // Prepare Move interaction
      const currentSelected = e.shiftKey
        ? selectedIds.includes(clickedNode.id)
          ? selectedIds
          : [...selectedIds, clickedNode.id]
        : selectedIds.includes(clickedNode.id)
        ? selectedIds
        : [clickedNode.id];

      const initialMap: Record<string, any> = {};
      currentSelected.forEach((id) => {
        const n = getNodeById(id);
        if (n) {
          initialMap[id] = {
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            rotation: n.rotation || 0
          };
        }
      });

      setInteraction({
        type: 'move',
        startScreenX: screenX,
        startScreenY: screenY,
        startWorldX: worldPoint.x,
        startWorldY: worldPoint.y,
        initialNodes: initialMap
      });
    } else {
      // Clicked on empty canvas -> Marquee selection
      if (!e.shiftKey) {
        deselectAll();
      }
      setMarquee({
        startX: worldPoint.x,
        startY: worldPoint.y,
        currentX: worldPoint.x,
        currentY: worldPoint.y
      });
    }
  }, [
    activePage,
    viewport,
    activeTool,
    isSpacePressed,
    selectedIds,
    setActiveTool,
    addNode,
    setSelectedIds,
    selectNode,
    deselectAll,
    getNodeById,
    setInteraction,
    setMarquee,
    setEditingTextNodeId
  ]);

  // RequestAnimationFrame throttled Pointer Move handler
  const rafRef = useRef<number | null>(null);
  const latestMoveEvent = useRef<PointerEvent | null>(null);

  const processPointerMove = useCallback(() => {
    const e = latestMoveEvent.current;
    if (!e || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPoint = screenToWorld({ x: screenX, y: screenY }, viewport);

    // 1. Hover Detection
    if (!interaction && !marquee && activePage?.children) {
      let hovered: string | null = null;
      for (let i = activePage.children.length - 1; i >= 0; i--) {
        const n = activePage.children[i];
        if (n.visible && !n.locked && isPointInNode(worldPoint, n)) {
          hovered = n.id;
          break;
        }
      }
      setHoveredId(hovered);
    }

    // 2. Marquee Selection
    if (marquee) {
      setMarquee({
        ...marquee,
        currentX: worldPoint.x,
        currentY: worldPoint.y
      });

      const mRect = {
        x: Math.min(marquee.startX, worldPoint.x),
        y: Math.min(marquee.startY, worldPoint.y),
        width: Math.abs(worldPoint.x - marquee.startX),
        height: Math.abs(worldPoint.y - marquee.startY)
      };

      if (activePage?.children) {
        const intersected = activePage.children
          .filter((n) => n.visible && !n.locked && doesMarqueeIntersectNode(mRect, n))
          .map((n) => n.id);
        setSelectedIds(intersected);
      }
      return;
    }

    // 3. Active Drag Interactions
    if (!interaction) return;

    if (interaction.type === 'pan') {
      const dx = screenX - interaction.startScreenX;
      const dy = screenY - interaction.startScreenY;
      pan(dx, dy);
      setInteraction({
        ...interaction,
        startScreenX: screenX,
        startScreenY: screenY
      });
      return;
    }

    if (interaction.type === 'pencil') {
      const nodeId = Object.keys(interaction.initialNodes || {})[0];
      if (!nodeId) return;
      const current = getNodeById(nodeId) as PencilNode | undefined;
      if (!current) return;

      const newPoint: PencilPoint = {
        x: Math.round(worldPoint.x - current.x),
        y: Math.round(worldPoint.y - current.y)
      };

      const points = [...(current.points || []), newPoint];
      updateNodes([{ id: nodeId, props: { points } }], false);
      return;
    }

    if (interaction.type === 'draw') {
      const nodeId = Object.keys(interaction.initialNodes || {})[0];
      if (!nodeId) return;

      const startX = interaction.startWorldX;
      const startY = interaction.startWorldY;

      let w = worldPoint.x - startX;
      let h = worldPoint.y - startY;

      let nextX = w < 0 ? worldPoint.x : startX;
      let nextY = h < 0 ? worldPoint.y : startY;
      let nextW = Math.abs(w);
      let nextH = Math.abs(h);

      if (e.shiftKey) {
        const side = Math.max(nextW, nextH);
        nextW = side;
        nextH = side;
      }

      updateNodes(
        [
          {
            id: nodeId,
            props: {
              x: Math.round(nextX),
              y: Math.round(nextY),
              width: Math.max(5, Math.round(nextW)),
              height: Math.max(5, Math.round(nextH))
            }
          }
        ],
        false
      );
      return;
    }

    if (interaction.type === 'move' && interaction.initialNodes) {
      const deltaX = worldPoint.x - interaction.startWorldX;
      const deltaY = worldPoint.y - interaction.startWorldY;

      const otherNodes = activePage
        ? activePage.children.filter((n) => !selectedIds.includes(n.id))
        : [];

      // Calculate candidate bounds
      const firstId = selectedIds[0];
      const initialFirst = interaction.initialNodes[firstId];

      if (initialFirst) {
        const candidateBounds = {
          minX: initialFirst.x + deltaX,
          minY: initialFirst.y + deltaY,
          maxX: initialFirst.x + deltaX + initialFirst.width,
          maxY: initialFirst.y + deltaY + initialFirst.height,
          width: initialFirst.width,
          height: initialFirst.height,
          centerX: initialFirst.x + deltaX + initialFirst.width / 2,
          centerY: initialFirst.y + deltaY + initialFirst.height / 2
        };

        const snapRes = calculateSnapping(candidateBounds, otherNodes, {
          snapToGrid,
          gridSize,
          snapToObjects
        });

        setActiveSnapGuides(snapRes.guides);

        const finalDeltaX = snapRes.x - initialFirst.x;
        const finalDeltaY = snapRes.y - initialFirst.y;

        const updates = selectedIds.map((id) => {
          const init = interaction.initialNodes![id];
          return {
            id,
            props: {
              x: Math.round(init.x + (e.altKey ? deltaX : finalDeltaX)),
              y: Math.round(init.y + (e.altKey ? deltaY : finalDeltaY))
            }
          };
        });

        updateNodes(updates, false);
      }
      return;
    }

    if (interaction.type === 'resize' && interaction.handle && interaction.initialNodes) {
      const firstId = selectedIds[0];
      const initial = interaction.initialNodes[firstId];
      if (!initial) return;

      const nextBox = calculateResize(
        initial,
        interaction.handle as HandleType,
        worldPoint,
        { x: interaction.startWorldX, y: interaction.startWorldY },
        {
          preserveAspectRatio: e.shiftKey,
          resizeFromCenter: e.altKey
        }
      );

      updateNodes(
        [
          {
            id: firstId,
            props: {
              x: nextBox.x,
              y: nextBox.y,
              width: nextBox.width,
              height: nextBox.height
            }
          }
        ],
        false
      );
      return;
    }

    if (interaction.type === 'rotate' && interaction.initialNodes) {
      const firstId = selectedIds[0];
      const initial = interaction.initialNodes[firstId];
      if (!initial) return;

      const center = {
        x: initial.x + initial.width / 2,
        y: initial.y + initial.height / 2
      };

      const newAngle = calculateRotation(center, worldPoint, initial.rotation, e.shiftKey);
      updateNodes([{ id: firstId, props: { rotation: newAngle } }], false);
    }
  }, [
    activePage,
    viewport,
    interaction,
    marquee,
    selectedIds,
    snapToGrid,
    gridSize,
    snapToObjects,
    pan,
    setHoveredId,
    setMarquee,
    setSelectedIds,
    setInteraction,
    setActiveSnapGuides,
    getNodeById,
    updateNodes
  ]);

  // Pointer Move Event with rAF queue
  const handlePointerMove = useCallback((e: PointerEvent) => {
    latestMoveEvent.current = e;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        processPointerMove();
        rafRef.current = null;
      });
    }
  }, [processPointerMove]);

  // Pointer Up / End Drag
  const handlePointerUp = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (interaction) {
      if (interaction.type === 'draw' || interaction.type === 'pencil') {
        setActiveTool('select');
      }

      // Commit final position to history
      if (interaction.initialNodes && ['move', 'resize', 'rotate', 'draw', 'pencil'].includes(interaction.type)) {
        const updates: { id: string; props: Partial<ChigmaNode> }[] = [];
        Object.keys(interaction.initialNodes).forEach((id) => {
          const current = getNodeById(id);
          if (current) {
            updates.push({
              id,
              props: {
                x: current.x,
                y: current.y,
                width: current.width,
                height: current.height,
                rotation: current.rotation,
                points: (current as any).points
              }
            });
          }
        });
        if (updates.length > 0) {
          updateNodes(updates, true, `Commit ${interaction.type}`);
        }
      }

      setInteraction(null);
      setActiveSnapGuides([]);
    }

    if (marquee) {
      setMarquee(null);
    }
  }, [interaction, marquee, setActiveTool, getNodeById, updateNodes, setInteraction, setActiveSnapGuides, setMarquee]);

  // Double click for direct text editing
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !activePage) return;
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPoint = screenToWorld({ x: screenX, y: screenY }, viewport);

    if (activePage.children) {
      for (let i = activePage.children.length - 1; i >= 0; i--) {
        const n = activePage.children[i];
        if (n.type === 'text' && isPointInNode(worldPoint, n)) {
          setEditingTextNodeId(n.id);
          break;
        }
      }
    }
  }, [activePage, viewport, setEditingTextNodeId]);

  // Wheel Zoom / Pan
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const targetZoom = viewport.zoom * zoomFactor;
      zoomAroundPoint(screenX, screenY, targetZoom);
    } else {
      // Pan
      pan(-e.deltaX, -e.deltaY);
    }
  }, [viewport.zoom, zoomAroundPoint, pan]);

  // Drag & Drop Image Files from OS
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPoint = screenToWorld({ x: screenX, y: screenY }, viewport);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const dataUrl = await readFileAsDataURL(file);
      const imgNode = createDefaultNode('image', worldPoint.x, worldPoint.y, {
        src: dataUrl,
        name: file.name.replace(/\.[^/.]+$/, '')
      });
      addNode(imgNode);
      setSelectedIds([imgNode.id]);
    }
  };

  // Attach global pointer up / move listeners
  useEffect(() => {
    const onWinPointerMove = (e: PointerEvent) => {
      handlePointerMove(e);
    };
    const onWinPointerUp = () => {
      handlePointerUp();
    };

    window.addEventListener('pointermove', onWinPointerMove, { passive: false });
    window.addEventListener('pointerup', onWinPointerUp);
    return () => {
      window.removeEventListener('pointermove', onWinPointerMove);
      window.removeEventListener('pointerup', onWinPointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const selectedNodes = selectedIds
    .map((id) => getNodeById(id))
    .filter((n): n is ChigmaNode => Boolean(n));

  const editingTextNode = editingTextNodeId
    ? (getNodeById(editingTextNodeId) as TextNode | undefined)
    : undefined;

  const isHandMode = activeTool === 'hand' || isSpacePressed;

  return (
    <div
      ref={containerRef}
      className={`chigma-canvas-container tool-${activeTool} ${isHandMode ? 'cursor-hand' : ''}`}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Visual Coordinate Rulers */}
      {showRulers && (
        <RulersOverlay
          viewport={viewport}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}

      <svg
        className="chigma-canvas-svg"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: activePage?.background || '#F8FAFC'
        }}
      >
        {/* Subtle Background Grid Pattern */}
        {showGrid && (
          <defs>
            <pattern
              id="canvas_grid_pattern"
              width={gridSize * viewport.zoom}
              height={gridSize * viewport.zoom}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={(gridSize * viewport.zoom) / 2}
                cy={(gridSize * viewport.zoom) / 2}
                r={Math.max(0.6, 0.8 * Math.min(1.5, viewport.zoom))}
                fill="#CBD5E1"
              />
            </pattern>
          </defs>
        )}

        {showGrid && (
          <rect
            width="100%"
            height="100%"
            fill="url(#canvas_grid_pattern)"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Scaled & Panned Document Content */}
        <g
          transform={`translate(${viewport.panX}, ${viewport.panY}) scale(${viewport.zoom})`}
        >
          {activePage && <DocumentRenderer page={activePage} />}

          {/* Interactive Transform Overlay for Selected Nodes */}
          {selectedNodes.length > 0 && !editingTextNode && (
            <TransformOverlay selectedNodes={selectedNodes} viewport={viewport} />
          )}

          {/* Dynamic Snapping Alignment Guides */}
          {activeSnapGuides.length > 0 && (
            <SnappingGuidesOverlay guides={activeSnapGuides} />
          )}

          {/* Drag Marquee Selection Box */}
          {marquee && <MarqueeOverlay marquee={marquee} />}
        </g>
      </svg>

      {/* Inline Textarea Overlay on Double Click */}
      {editingTextNode && (
        <TextEditorOverlay
          node={editingTextNode}
          viewport={viewport}
          onClose={() => setEditingTextNodeId(null)}
        />
      )}
    </div>
  );
};
