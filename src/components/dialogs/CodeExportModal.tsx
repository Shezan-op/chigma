import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { generateWireframeCode } from '../../engine/export/exportCode';
import { downloadFile } from '../../utils/file';
import { X, Copy, Check, Download, Code, FileText, Globe } from 'lucide-react';

export const CodeExportModal: React.FC = () => {
  const { isCodeExportModalOpen, setCodeExportModalOpen } = useEditorStore();
  const { document: currentDoc, getActivePage } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<'bundle' | 'html' | 'css' | 'js'>('bundle');
  const [copied, setCopied] = useState(false);

  if (!isCodeExportModalOpen) return null;

  const page = getActivePage();
  if (!page) return null;

  const generated = generateWireframeCode(page, currentDoc.name);

  const getActiveCode = () => {
    switch (activeTab) {
      case 'bundle':
        return generated.fullDocument;
      case 'html':
        return generated.html;
      case 'css':
        return generated.css;
      case 'js':
        return generated.js;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const cleanName = (currentDoc.name || 'wireframe').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (activeTab === 'bundle') {
      downloadFile(generated.fullDocument, `${cleanName}.html`, 'text/html;charset=utf-8');
    } else if (activeTab === 'html') {
      downloadFile(generated.html, `${cleanName}-snippet.html`, 'text/html;charset=utf-8');
    } else if (activeTab === 'css') {
      downloadFile(generated.css, `${cleanName}.css`, 'text/css;charset=utf-8');
    } else if (activeTab === 'js') {
      downloadFile(generated.js, `${cleanName}.js`, 'application/javascript;charset=utf-8');
    }
  };

  return (
    <div className="chigma-modal-overlay" onClick={() => setCodeExportModalOpen(false)}>
      <div
        className="chigma-modal-container code-export-modal"
        style={{ width: '820px', maxWidth: '90vw', height: '620px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code size={18} color="#0066FF" />
            Export Wireframe to Code
          </div>
          <button className="btn-icon" onClick={() => setCodeExportModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="modal-tabs" style={{ display: 'flex', gap: 8, padding: '12px 20px', borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
          <button
            className={`tab-btn ${activeTab === 'bundle' ? 'active' : ''}`}
            onClick={() => setActiveTab('bundle')}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: activeTab === 'bundle' ? '#000000' : '#E6E6E6',
              background: activeTab === 'bundle' ? '#000000' : '#FFFFFF',
              color: activeTab === 'bundle' ? '#FFFFFF' : '#18181B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Globe size={14} /> Full HTML Bundle
          </button>
          <button
            className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: activeTab === 'html' ? '#000000' : '#E6E6E6',
              background: activeTab === 'html' ? '#000000' : '#FFFFFF',
              color: activeTab === 'html' ? '#FFFFFF' : '#18181B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileText size={14} /> HTML Snippet
          </button>
          <button
            className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: activeTab === 'css' ? '#000000' : '#E6E6E6',
              background: activeTab === 'css' ? '#000000' : '#FFFFFF',
              color: activeTab === 'css' ? '#FFFFFF' : '#18181B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Code size={14} /> CSS Stylesheet
          </button>
          <button
            className={`tab-btn ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => setActiveTab('js')}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: activeTab === 'js' ? '#000000' : '#E6E6E6',
              background: activeTab === 'js' ? '#000000' : '#FFFFFF',
              color: activeTab === 'js' ? '#FFFFFF' : '#18181B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Code size={14} /> JavaScript
          </button>
        </div>

        {/* Code Preview Box */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '16px 20px' }}>
          <pre
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#18181B',
              color: '#F4F4F5',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: '12px',
              lineHeight: '1.5'
            }}
          >
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #E6E6E6' }}>
          <div style={{ fontSize: '12px', color: '#71717A' }}>
            Generates semantic HTML5 &amp; CSS adhering to Figma design tokens.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={handleCopy}
              style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: '50px', padding: '8px 18px' }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Code'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: '50px', padding: '8px 18px' }}
            >
              <Download size={14} />
              Download {activeTab.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
