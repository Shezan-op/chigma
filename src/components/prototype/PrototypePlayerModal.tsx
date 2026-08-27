import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { usePrototypeSessionStore } from '../../store/usePrototypeSessionStore';
import { NodeRenderer } from '../../engine/renderer/NodeRenderer';
import {
  X,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Bug,
  Activity
} from 'lucide-react';

type DeviceFrame = 'fluid' | 'desktop' | 'iphone' | 'ipad';

export const PrototypePlayerModal: React.FC = () => {
  const { isPrototypeMode, setPrototypeMode } = useEditorStore();
  const { document: currentDoc } = useDocumentStore();

  const {
    activeScreenId,
    variables,
    activeOverlays,
    interactionLogs,
    isDebuggerOpen,
    initSession,
    executeInteraction,
    setVariableValue,
    navigateBack,
    navigateToScreen,
    closeOverlay,
    resetSession,
    setDebuggerOpen
  } = usePrototypeSessionStore();

  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');
  const [showHotspotFlash, setShowHotspotFlash] = useState(false);

  const pages = currentDoc.pages || [];

  // Initialize session with the first page if not initialized
  useEffect(() => {
    if (isPrototypeMode && pages.length > 0) {
      const startId = activeScreenId || pages[0].id;
      initSession(startId);
    }
  }, [isPrototypeMode]);

  if (!isPrototypeMode) return null;

  const currentPage = pages.find((p) => p.id === activeScreenId) || pages[0];
  const currentPageIndex = pages.findIndex((p) => p.id === currentPage?.id);

  const handleNodeInteraction = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentPage) return;
    const node = currentPage.children.find((n) => n.id === nodeId);

    if (node?.interaction) {
      executeInteraction(node.interaction, nodeId);
    } else {
      setShowHotspotFlash(true);
      setTimeout(() => setShowHotspotFlash(false), 400);
    }
  };

  const getDeviceDimensions = () => {
    switch (deviceFrame) {
      case 'iphone':
        return { width: 393, height: 852, radius: 44, label: 'iPhone 15 Pro' };
      case 'ipad':
        return { width: 820, height: 1180, radius: 24, label: 'iPad Air' };
      case 'desktop':
        return { width: 1280, height: 800, radius: 12, label: 'MacBook Pro' };
      case 'fluid':
      default:
        return { width: '100%', height: '100%', radius: 0, label: 'Fullscreen Canvas' };
    }
  };

  const dims = getDeviceDimensions();

  return (
    <div
      className="chigma-prototype-player-root fixed inset-0 z-50 flex flex-col bg-[#0F0F11] text-white select-none animate-fadeIn"
    >
      {/* Top Floating Control Bar */}
      <header className="h-13 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-5">
        {/* Left: Project title & Page indicator */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold">{currentDoc.name}</span>
          </div>

          <div className="h-3.5 w-px bg-zinc-700" />

          {/* Page Dropdown / Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={navigateBack}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={currentPage?.id || ''}
              onChange={(e) => navigateToScreen(e.target.value)}
              className="bg-zinc-800 text-white border border-zinc-700 rounded-full px-3 py-1 text-xs outline-none cursor-pointer"
            >
              {pages.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({idx + 1}/{pages.length})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const nextIdx = Math.min(pages.length - 1, currentPageIndex + 1);
                navigateToScreen(pages[nextIdx].id);
              }}
              disabled={currentPageIndex === pages.length - 1}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition disabled:opacity-30"
              title="Next Screen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Device Frame Switcher */}
        <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-full border border-zinc-700">
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              deviceFrame === 'desktop' ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceFrame('ipad')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              deviceFrame === 'ipad' ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDeviceFrame('iphone')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              deviceFrame === 'iphone' ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setDeviceFrame('fluid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              deviceFrame === 'fluid' ? 'bg-black text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Fullscreen
          </button>
        </div>

        {/* Right: Debugger, Restart, Exit */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDebuggerOpen(!isDebuggerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
              isDebuggerOpen
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Toggle Prototype Debugger HUD"
          >
            <Bug className="w-3.5 h-3.5" /> Debugger
          </button>

          <button
            onClick={() => resetSession(pages[0]?.id || '')}
            title="Restart Prototype"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>

          <button
            onClick={() => setPrototypeMode(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-black hover:opacity-90 transition shadow-sm"
          >
            <X className="w-3.5 h-3.5" /> Exit (ESC)
          </button>
        </div>
      </header>

      {/* Main Presentation Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <main
          className="flex-1 flex items-center justify-center p-6 overflow-auto bg-[radial-gradient(circle_at_center,#1E1E24_0%,#0F0F11_100%)]"
          onClick={() => {
            setShowHotspotFlash(true);
            setTimeout(() => setShowHotspotFlash(false), 400);
          }}
        >
          <div
            style={{
              width: dims.width,
              height: dims.height,
              backgroundColor: currentPage?.background || '#FFFFFF',
              borderRadius: dims.radius
            }}
            className="max-w-full max-h-full shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SVG Canvas Render */}
            <svg
              width="100%"
              height="100%"
              style={{ minWidth: 1200, minHeight: 900, display: 'block' }}
            >
              {currentPage &&
                currentPage.children
                  .filter((n) => n.visible)
                  .map((node) => {
                    const hasLink = Boolean(node.interaction);
                    return (
                      <g
                        key={node.id}
                        onClick={(e) => handleNodeInteraction(node.id, e)}
                        style={{ cursor: hasLink ? 'pointer' : 'default' }}
                      >
                        <NodeRenderer node={node} />

                        {/* Hotspot Flash Ring */}
                        {hasLink && showHotspotFlash && (
                          <rect
                            x={node.x - 2}
                            y={node.y - 2}
                            width={node.width + 4}
                            height={node.height + 4}
                            fill="rgba(0, 102, 255, 0.15)"
                            stroke="#0066FF"
                            strokeWidth={2}
                            rx={4}
                            style={{ pointerEvents: 'none' }}
                          />
                        )}
                      </g>
                    );
                  })}
            </svg>

            {/* Overlays Render (Modals, Drawers, Dropdowns) */}
            {activeOverlays.map((overlay) => {
              const targetP = pages.find((p) => p.id === overlay.targetPageId);
              return (
                <div
                  key={overlay.id}
                  className={`absolute inset-0 z-40 flex items-center justify-center ${
                    overlay.config.backdrop !== false ? 'bg-black/50 backdrop-blur-sm' : ''
                  }`}
                  onClick={() => {
                    if (overlay.config.closeOnBackdropClick !== false) {
                      closeOverlay(overlay.id);
                    }
                  }}
                >
                  <div
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 max-w-lg animate-scaleUp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {targetP?.name || 'Overlay Dialog'}
                      </h3>
                      <button
                        onClick={() => closeOverlay(overlay.id)}
                        className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {targetP ? (
                      <svg width={400} height={300}>
                        {targetP.children.map((n) => (
                          <NodeRenderer key={n.id} node={n} />
                        ))}
                      </svg>
                    ) : (
                      <div className="text-xs text-zinc-500">Overlay content slot</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Prototype Debugger HUD Sidebar */}
        {isDebuggerOpen && (
          <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full animate-slideLeft">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Prototype State Debugger</span>
              </div>
              <button
                onClick={() => setDebuggerOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current State & Variables */}
            <div className="p-4 border-b border-zinc-800 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Active Screen</span>
                <span className="text-xs font-mono text-emerald-400">{currentPage?.name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Session Variables</span>
                {Object.keys(variables).length === 0 ? (
                  <span className="text-xs text-zinc-500 italic">No variables set</span>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(variables).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between text-xs font-mono bg-zinc-800/80 px-2 py-1 rounded"
                      >
                        <span className="text-purple-300">{k}</span>
                        <input
                          type="text"
                          value={String(v)}
                          onChange={(e) => setVariableValue(k, e.target.value)}
                          className="w-20 bg-zinc-950 px-1 text-right text-white rounded border border-zinc-700 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Event Stream */}
            <div className="flex-1 overflow-y-auto p-4">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Event Activity Log
              </span>
              <div className="space-y-2">
                {interactionLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="p-2 bg-zinc-800/50 rounded-lg text-[11px] border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="font-semibold text-white">{log.trigger}</span>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-zinc-400 mt-0.5 font-mono text-[10px]">
                      action: <span className="text-emerald-400">{log.action}</span>
                    </div>
                    {log.details && <div className="text-zinc-500 text-[10px] mt-0.5">{log.details}</div>}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
