import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { NodeRenderer } from '../../engine/renderer/NodeRenderer';
import {
  X,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type DeviceFrame = 'fluid' | 'desktop' | 'iphone' | 'ipad';

export const PrototypePlayerModal: React.FC = () => {
  const { isPrototypeMode, setPrototypeMode } = useEditorStore();
  const { document: currentDoc } = useDocumentStore();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');
  const [showHotspotFlash, setShowHotspotFlash] = useState(false);

  if (!isPrototypeMode) return null;

  const pages = currentDoc.pages || [];
  const currentPage = pages[activePageIndex] || pages[0];

  const handleNodeClick = (nodeId: string) => {
    if (!currentPage) return;
    const node = currentPage.children.find((n) => n.id === nodeId);
    if (!node || !node.interaction) {
      // Trigger hotspot flash to hint clickable areas
      setShowHotspotFlash(true);
      setTimeout(() => setShowHotspotFlash(false), 400);
      return;
    }

    const { action, targetPageId, targetUrl } = node.interaction;
    if (action === 'navigate' && targetPageId) {
      const targetIdx = pages.findIndex((p) => p.id === targetPageId);
      if (targetIdx !== -1) {
        setActivePageIndex(targetIdx);
      }
    } else if (action === 'back') {
      setActivePageIndex((prev) => Math.max(0, prev - 1));
    } else if (action === 'url' && targetUrl) {
      window.open(targetUrl, '_blank');
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
      className="chigma-prototype-player-root"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0F0F11',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none'
      }}
    >
      {/* Top Floating Control Bar */}
      <header
        style={{
          height: 52,
          backgroundColor: '#18181B',
          borderBottom: '1px solid #27272A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          color: '#FFFFFF'
        }}
      >
        {/* Left: Project title & Page indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>{currentDoc.name}</span>
          </div>

          <div style={{ height: 14, width: 1, backgroundColor: '#3F3F46' }} />

          {/* Page Dropdown / Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              className="btn-icon xs"
              onClick={() => setActivePageIndex((p) => Math.max(0, p - 1))}
              disabled={activePageIndex === 0}
              style={{ color: '#A1A1AA' }}
            >
              <ChevronLeft size={14} />
            </button>
            <select
              value={activePageIndex}
              onChange={(e) => setActivePageIndex(parseInt(e.target.value))}
              style={{
                backgroundColor: '#27272A',
                color: '#FFFFFF',
                border: '1px solid #3F3F46',
                borderRadius: '50px',
                padding: '3px 12px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              {pages.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {p.name} ({idx + 1}/{pages.length})
                </option>
              ))}
            </select>
            <button
              className="btn-icon xs"
              onClick={() => setActivePageIndex((p) => Math.min(pages.length - 1, p + 1))}
              disabled={activePageIndex === pages.length - 1}
              style={{ color: '#A1A1AA' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Center: Device Frame Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#27272A', padding: 3, borderRadius: '50px' }}>
          <button
            onClick={() => setDeviceFrame('desktop')}
            style={{
              background: deviceFrame === 'desktop' ? '#000000' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer'
            }}
          >
            <Laptop size={13} /> Desktop
          </button>
          <button
            onClick={() => setDeviceFrame('ipad')}
            style={{
              background: deviceFrame === 'ipad' ? '#000000' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer'
            }}
          >
            <Tablet size={13} /> Tablet
          </button>
          <button
            onClick={() => setDeviceFrame('iphone')}
            style={{
              background: deviceFrame === 'iphone' ? '#000000' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer'
            }}
          >
            <Smartphone size={13} /> Mobile
          </button>
          <button
            onClick={() => setDeviceFrame('fluid')}
            style={{
              background: deviceFrame === 'fluid' ? '#000000' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer'
            }}
          >
            <Monitor size={13} /> Fullscreen
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setActivePageIndex(0)}
            title="Restart Prototype"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A1A1AA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '12px'
            }}
          >
            <RotateCcw size={14} /> Restart
          </button>
          <button
            onClick={() => setPrototypeMode(false)}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: 'none',
              borderRadius: '50px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <X size={14} /> Exit (ESC)
          </button>
        </div>
      </header>

      {/* Main Presentation Viewport */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '24px',
          background: 'radial-gradient(circle at center, #1E1E24 0%, #0F0F11 100%)'
        }}
        onClick={() => {
          setShowHotspotFlash(true);
          setTimeout(() => setShowHotspotFlash(false), 400);
        }}
      >
        <div
          style={{
            width: dims.width,
            height: dims.height,
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundColor: currentPage?.background || '#FFFFFF',
            borderRadius: dims.radius,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* SVG Vector Render of Page */}
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
                      onClick={() => handleNodeClick(node.id)}
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
                          style={{ pointerEvents: 'none', animation: 'pulse 0.4s ease' }}
                        />
                      )}
                    </g>
                  );
                })}
          </svg>
        </div>
      </main>
    </div>
  );
};
