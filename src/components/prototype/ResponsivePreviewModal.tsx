import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { DocumentRenderer } from '../../engine/renderer/DocumentRenderer';
import { Smartphone, Tablet, Laptop, Monitor, X, MoveHorizontal } from 'lucide-react';

interface ResponsivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_VIEWPORTS = [
  { id: 'mobile', name: 'Mobile (iPhone 15)', width: 390, height: 844, icon: Smartphone },
  { id: 'tablet', name: 'Tablet (iPad Air)', width: 768, height: 1024, icon: Tablet },
  { id: 'laptop', name: 'Laptop (MacBook)', width: 1280, height: 800, icon: Laptop },
  { id: 'desktop', name: 'Desktop (1440p)', width: 1440, height: 900, icon: Monitor }
];

export const ResponsivePreviewModal: React.FC<ResponsivePreviewModalProps> = ({ isOpen, onClose }) => {
  const activePage = useDocumentStore((s) => s.getActivePage());
  const [selectedWidth, setSelectedWidth] = useState(1280);
  const [selectedHeight, setSelectedHeight] = useState(800);

  if (!isOpen || !activePage) return null;

  const handleSelectPreset = (w: number, h: number) => {
    setSelectedWidth(w);
    setSelectedHeight(h);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#18181B',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          height: '56px',
          backgroundColor: '#09090B',
          borderBottom: '1px solid #27272A',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>
            Responsive Breakpoint Preview
          </span>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#18181B', padding: '3px', borderRadius: '8px' }}>
            {PRESET_VIEWPORTS.map((preset) => {
              const IconComp = preset.icon;
              const isActive = selectedWidth === preset.width;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.width, preset.height)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 400,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#3B82F6' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#A1A1AA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <IconComp size={13} />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Width Drag Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A1A1AA', fontSize: '12px' }}>
            <MoveHorizontal size={14} />
            <span>Width: {selectedWidth}px</span>
            <input
              type="range"
              min="320"
              max="1600"
              value={selectedWidth}
              onChange={(e) => setSelectedWidth(parseInt(e.target.value, 10))}
              style={{ width: '120px', cursor: 'ew-resize' }}
            />
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#27272A',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={14} />
            Close Preview
          </button>
        </div>
      </div>

      {/* Responsive Viewport Frame Canvas */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'auto',
          backgroundColor: '#121214'
        }}
      >
        <div
          style={{
            width: `${selectedWidth}px`,
            height: `${selectedHeight}px`,
            backgroundColor: activePage.background || '#FFFFFF',
            borderRadius: selectedWidth <= 420 ? '36px' : '12px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px #3F3F46',
            overflow: 'hidden',
            transition: 'width 0.15s ease',
            position: 'relative'
          }}
        >
          <svg
            width={selectedWidth}
            height={selectedHeight}
            viewBox={`0 0 ${selectedWidth} ${selectedHeight}`}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <DocumentRenderer page={activePage} />
          </svg>
        </div>
      </div>
    </div>
  );
};
