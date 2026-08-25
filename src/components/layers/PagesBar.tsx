import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { Plus, Trash2 } from 'lucide-react';

export const PagesBar: React.FC = () => {
  const document = useDocumentStore((s) => s.document);
  const activePageId = useDocumentStore((s) => s.activePageId);
  const setActivePageId = useDocumentStore((s) => s.setActivePageId);
  const addPage = useDocumentStore((s) => s.addPage);
  const renamePage = useDocumentStore((s) => s.renamePage);
  const deletePage = useDocumentStore((s) => s.deletePage);

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const pages = document?.pages || [];

  const handleStartRename = (pageId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(pageId);
    setEditName(currentName);
  };

  const handleSaveRename = (pageId: string) => {
    if (editName.trim()) {
      renamePage(pageId, editName.trim());
    }
    setEditingPageId(null);
  };

  return (
    <div className="chigma-pages-bar">
      <div className="pages-header">
        <span className="section-title">Pages</span>
        <button
          className="btn-icon sm"
          onClick={() => addPage()}
          title="Add new page"
          aria-label="Add new page"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="pages-list">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          const isEditing = p.id === editingPageId;

          return (
            <div
              key={p.id}
              className={`page-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePageId(p.id)}
            >
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
                />
              ) : (
                <span
                  className="page-name"
                  onDoubleClick={(e) => handleStartRename(p.id, p.name, e)}
                  title="Double click to rename page"
                >
                  {p.name}
                </span>
              )}

              {pages.length > 1 && (
                <button
                  className="btn-icon xs delete-page-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(p.id);
                  }}
                  title="Delete page"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
