import React, { useRef, useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useProjectStore } from '../../store/useProjectStore';
import { importDocumentFromJson } from '../../engine/export/exportJson';
import { readFileAsDataURL, getImageDimensions } from '../../utils/file';
import { createDefaultNode } from '../../models/document';
import { X, Upload, FileCode, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ImportModal: React.FC = () => {
  const setDocument = useDocumentStore((s) => s.setDocument);
  const addNode = useDocumentStore((s) => s.addNode);
  const { isImportModalOpen, setImportModalOpen, saveCurrentProject, loadProjectsList } = useProjectStore();

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isImportModalOpen) return null;

  const handleJsonSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const doc = await importDocumentFromJson(file);
      await saveCurrentProject(doc);
      setDocument(doc);
      await loadProjectsList();
      setImportModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import JSON file.');
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

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
  };

  return (
    <div className="modal-backdrop" onClick={() => setImportModalOpen(false)}>
      <div className="chigma-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Import File</h3>
          <button className="btn-icon sm" onClick={() => setImportModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Import JSON Card */}
          <div className="export-card">
            <div className="card-left">
              <div className="card-badge"><FileCode size={20} /></div>
              <div>
                <h4>Chigma Project (.chigma.json)</h4>
                <p>Import and open an existing project file</p>
              </div>
            </div>
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json,.chigma.json"
              style={{ display: 'none' }}
              onChange={handleJsonSelect}
            />
            <button className="btn-primary" onClick={() => jsonInputRef.current?.click()}>
              <Upload size={14} />
              <span>Select JSON</span>
            </button>
          </div>

          {/* Import Image Card */}
          <div className="export-card">
            <div className="card-left">
              <div className="card-badge"><ImageIcon size={20} /></div>
              <div>
                <h4>Image Asset (PNG, JPG, WEBP, SVG)</h4>
                <p>Insert an image locally onto the active canvas</p>
              </div>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            <button className="btn-secondary" onClick={() => imageInputRef.current?.click()}>
              <Upload size={14} />
              <span>Select Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
