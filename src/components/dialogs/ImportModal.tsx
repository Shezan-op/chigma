import React, { useRef, useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useProjectStore } from '../../store/useProjectStore';
import { importDocumentFromJson } from '../../engine/export/exportJson';
import { readFileAsDataURL, getImageDimensions } from '../../utils/file';
import { createDefaultNode } from '../../models/document';
import { X, Upload, FileCode, AlertCircle, CloudUpload } from 'lucide-react';

export const ImportModal: React.FC = () => {
  const setDocument = useDocumentStore((s) => s.setDocument);
  const addNode = useDocumentStore((s) => s.addNode);
  const { isImportModalOpen, setImportModalOpen, saveCurrentProject, loadProjectsList } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isImportModalOpen) return null;

  const processFile = async (file: File) => {
    setErrorMsg(null);
    if (file.name.endsWith('.json') || file.name.endsWith('.chigma.json')) {
      try {
        const doc = await importDocumentFromJson(file);
        await saveCurrentProject(doc);
        setDocument(doc);
        await loadProjectsList();
        setImportModalOpen(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to import JSON file.');
      }
    } else if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        const dims = await getImageDimensions(dataUrl);
        const maxDim = 400;
        let w = dims.width;
        let h = dims.height;
        if (w > maxDim || h > maxDim) {
          const aspect = w / h;
          if (w > h) {
            w = maxDim;
            h = maxDim / aspect;
          } else {
            h = maxDim;
            w = maxDim * aspect;
          }
        }
        const imgNode = createDefaultNode('image', 150, 150, {
          name: file.name.replace(/\.[^/.]+$/, ''),
          src: dataUrl,
          width: Math.round(w),
          height: Math.round(h)
        });
        addNode(imgNode);
        setImportModalOpen(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to import image.');
      }
    } else {
      setErrorMsg('Unsupported file format. Please upload .chigma.json or an image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="chigma-modal-backdrop" onClick={() => setImportModalOpen(false)}>
      <div className="chigma-confirm-modal-card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCode size={18} color="var(--chigma-accent)" />
            <h3 className="confirm-modal-title" style={{ margin: 0 }}>Import Project</h3>
          </div>
          <button className="confirm-modal-close-btn" style={{ position: 'static' }} onClick={() => setImportModalOpen(false)}>
            <X size={15} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag and drop upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--chigma-accent)' : 'var(--chigma-hairline)'}`,
            borderRadius: 12,
            padding: '36px 20px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'var(--chigma-accent-subtle)' : 'var(--chigma-surface-soft)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            marginBottom: 20
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.chigma.json,image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />
          <div style={{ width: 44, height: 44, borderRadius: 50, backgroundColor: '#FFFFFF', border: '1px solid var(--chigma-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--chigma-accent)' }}>
            <CloudUpload size={22} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--chigma-text-primary)', marginBottom: 4 }}>
            Click to upload or drag &amp; drop
          </div>
          <div style={{ fontSize: 11, color: 'var(--chigma-text-tertiary)' }}>
            Supports .chigma.json project files and raster image assets (PNG, JPG, SVG)
          </div>
        </div>

        {/* Footer */}
        <div className="confirm-modal-footer">
          <button className="confirm-btn cancel" onClick={() => setImportModalOpen(false)}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            style={{ backgroundColor: 'var(--chigma-accent)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            <span>Browse Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};
