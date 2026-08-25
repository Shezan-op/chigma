import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useProjectStore } from '../../store/useProjectStore';
import { exportDocumentToJson } from '../../engine/export/exportJson';
import { exportPageToSvg } from '../../engine/export/exportSvg';
import { exportPageToPng } from '../../engine/export/exportPng';
import { X, FileCode, FileImage, Download } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const document = useDocumentStore((s) => s.document);
  const activePage = useDocumentStore((s) => s.getActivePage());
  const { isExportModalOpen, setExportModalOpen } = useProjectStore();
  const [pngScale, setPngScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExportJson = () => {
    if (document) {
      exportDocumentToJson(document);
      setExportModalOpen(false);
    }
  };

  const handleExportSvg = () => {
    if (activePage && document) {
      exportPageToSvg(activePage, document.name);
      setExportModalOpen(false);
    }
  };

  const handleExportPng = async () => {
    if (activePage && document) {
      setIsExporting(true);
      try {
        await exportPageToPng(activePage, document.name, pngScale);
        setExportModalOpen(false);
      } catch (err) {
        console.error('PNG export failed:', err);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setExportModalOpen(false)}>
      <div className="chigma-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Export Document</h3>
          <button className="btn-icon sm" onClick={() => setExportModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* JSON Option */}
          <div className="export-card">
            <div className="card-left">
              <div className="card-badge"><FileCode size={20} /></div>
              <div>
                <h4>Chigma Project (.chigma.json)</h4>
                <p>Complete multi-page offline editable design project</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={handleExportJson}>
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>

          {/* SVG Option */}
          <div className="export-card">
            <div className="card-left">
              <div className="card-badge"><FileCode size={20} /></div>
              <div>
                <h4>Vector SVG (.svg)</h4>
                <p>Clean scalable vector document for web, icons, and diagrams</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={handleExportSvg}>
              <Download size={14} />
              <span>Export SVG</span>
            </button>
          </div>

          {/* PNG Option */}
          <div className="export-card">
            <div className="card-left">
              <div className="card-badge"><FileImage size={20} /></div>
              <div>
                <h4>Raster Image (.png)</h4>
                <div className="scale-selector">
                  <span>Scale:</span>
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      className={`scale-btn ${pngScale === s ? 'active' : ''}`}
                      onClick={() => setPngScale(s)}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn-primary" onClick={handleExportPng} disabled={isExporting}>
              <Download size={14} />
              <span>{isExporting ? 'Rendering...' : 'Export PNG'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
