import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useProjectStore } from '../../store/useProjectStore';
import { exportDocumentToJson } from '../../engine/export/exportJson';
import { exportPageToSvg } from '../../engine/export/exportSvg';
import { exportPageToPng } from '../../engine/export/exportPng';
import { X, Download } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const document = useDocumentStore((s) => s.document);
  const activePage = useDocumentStore((s) => s.getActivePage());
  const { isExportModalOpen, setExportModalOpen } = useProjectStore();

  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg' | 'pdf' | 'json'>('png');
  const [scale, setScale] = useState<number>(1);
  const [includeBg, setIncludeBg] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExecuteExport = async () => {
    if (!document || !activePage) return;
    setIsExporting(true);

    try {
      if (selectedFormat === 'png') {
        await exportPageToPng(activePage, document.name, scale);
      } else if (selectedFormat === 'svg') {
        exportPageToSvg(activePage, document.name);
      } else if (selectedFormat === 'json') {
        exportDocumentToJson(document);
      } else if (selectedFormat === 'pdf') {
        // SVG/PNG export as PDF fallback or browser print
        await exportPageToPng(activePage, document.name, 2);
      }
      setExportModalOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="chigma-modal-backdrop" onClick={() => setExportModalOpen(false)}>
      <div className="chigma-confirm-modal-card" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 className="confirm-modal-title" style={{ margin: 0 }}>Export Options</h3>
          <button className="confirm-modal-close-btn" style={{ position: 'static' }} onClick={() => setExportModalOpen(false)}>
            <X size={15} />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--chigma-text-tertiary)', display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>
            FORMAT
          </label>
          <div className="drawer-tab-switcher" style={{ margin: 0 }}>
            <button
              className={`drawer-tab-btn ${selectedFormat === 'png' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('png')}
            >
              PNG
            </button>
            <button
              className={`drawer-tab-btn ${selectedFormat === 'svg' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('svg')}
            >
              SVG
            </button>
            <button
              className={`drawer-tab-btn ${selectedFormat === 'pdf' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('pdf')}
            >
              PDF
            </button>
            <button
              className={`drawer-tab-btn ${selectedFormat === 'json' ? 'active' : ''}`}
              onClick={() => setSelectedFormat('json')}
            >
              .chigma.json
            </button>
          </div>
        </div>

        {/* Scale Selector (for PNG/Raster) */}
        {selectedFormat === 'png' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--chigma-text-tertiary)', display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>
              SCALE RESOLUTION
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${scale === s ? 'var(--chigma-accent)' : 'var(--chigma-hairline)'}`,
                    backgroundColor: scale === s ? 'var(--chigma-accent-subtle)' : '#FFFFFF',
                    color: scale === s ? 'var(--chigma-accent)' : 'var(--chigma-text-primary)'
                  }}
                >
                  {s}x {s === 1 ? '(@1440×1024)' : s === 2 ? '(Retina @2x)' : '(Ultra @3x)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Include Background Toggle */}
        <div className="prop-row align-between" style={{ padding: '10px 0', borderTop: '1px solid var(--chigma-hairline)', borderBottom: '1px solid var(--chigma-hairline)', marginBottom: 20 }}>
          <span className="prop-label" style={{ fontWeight: 600 }}>Include Background</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={includeBg}
              onChange={(e) => setIncludeBg(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="confirm-modal-footer">
          <button className="confirm-btn cancel" onClick={() => setExportModalOpen(false)}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            style={{ backgroundColor: 'var(--chigma-accent)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={handleExecuteExport}
            disabled={isExporting}
          >
            <Download size={14} />
            <span>{isExporting ? 'Exporting...' : `Export ${selectedFormat.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
