import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import {
  Plus,
  FileText,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Copy,
  FolderPlus,
  Trash2
} from 'lucide-react';

export const PagesBar: React.FC = () => {
  const document = useDocumentStore((s) => s.document);
  const activePageId = useDocumentStore((s) => s.activePageId);
  const setActivePageId = useDocumentStore((s) => s.setActivePageId);
  const addPage = useDocumentStore((s) => s.addPage);
  const renamePage = useDocumentStore((s) => s.renamePage);
  const deletePage = useDocumentStore((s) => s.deletePage);

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [activeMenuPageId, setActiveMenuPageId] = useState<string | null>(null);

  const pages = document?.pages || [];

  const handleStartRename = (pageId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(pageId);
    setEditName(currentName);
    setActiveMenuPageId(null);
  };

  const handleSaveRename = (pageId: string) => {
    if (editName.trim()) {
      renamePage(pageId, editName.trim());
    }
    setEditingPageId(null);
  };

  return (
    <div className="chigma-pages-section">
      {/* Header */}
      <div className="pages-section-header">
        <span className="pages-section-label">PAGES</span>
        <button
          className="pages-add-btn"
          onClick={() => addPage()}
          title="Add New Page"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Pages List */}
      <div className="pages-list-container">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          const isEditing = p.id === editingPageId;
          const isMenuOpen = activeMenuPageId === p.id;

          return (
            <div
              key={p.id}
              className={`page-row-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePageId(p.id)}
            >
              <div className="page-row-left">
                <FileText size={14} className="page-icon" />
                {isEditing ? (
                  <input
                    type="text"
                    className="page-rename-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveRename(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(p.id);
                      if (e.key === 'Escape') setEditingPageId(null);
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="page-name-text"
                    onDoubleClick={(e) => handleStartRename(p.id, p.name, e)}
                    title="Double-click to rename"
                  >
                    {p.name}
                  </span>
                )}
              </div>

              <div className="page-row-right" onClick={(e) => e.stopPropagation()}>
                <button
                  className="page-more-btn"
                  onClick={() => setActiveMenuPageId(isMenuOpen ? null : p.id)}
                >
                  <MoreHorizontal size={13} />
                </button>

                {isMenuOpen && (
                  <div className="page-context-dropdown">
                    <button
                      className="page-dropdown-item"
                      onClick={(e) => handleStartRename(p.id, p.name, e)}
                    >
                      Rename
                    </button>
                    <button
                      className="page-dropdown-item"
                      onClick={() => {
                        addPage(`${p.name} Copy`);
                        setActiveMenuPageId(null);
                      }}
                    >
                      Duplicate
                    </button>
                    {pages.length > 1 && (
                      <>
                        <div className="page-dropdown-divider" />
                        <button
                          className="page-dropdown-item danger"
                          onClick={() => {
                            deletePage(p.id);
                            setActiveMenuPageId(null);
                          }}
                        >
                          Delete Page
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Actions Toolbar below active page */}
      <div className="page-actions-toolstrip">
        <button className="page-tool-btn" title="Move Up" onClick={() => {}}>
          <ArrowUp size={13} />
        </button>
        <button className="page-tool-btn" title="Move Down" onClick={() => {}}>
          <ArrowDown size={13} />
        </button>
        <button
          className="page-tool-btn"
          title="Duplicate Page"
          onClick={() => {
            const cur = pages.find((p) => p.id === activePageId);
            if (cur) addPage(`${cur.name} Copy`);
          }}
        >
          <Copy size={13} />
        </button>
        <button className="page-tool-btn" title="Add Page" onClick={() => addPage()}>
          <Plus size={13} />
        </button>
        <button className="page-tool-btn" title="New Folder / Section">
          <FolderPlus size={13} />
        </button>
        <button
          className="page-tool-btn danger"
          title="Delete Page"
          disabled={pages.length <= 1}
          onClick={() => {
            if (activePageId && pages.length > 1) deletePage(activePageId);
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
