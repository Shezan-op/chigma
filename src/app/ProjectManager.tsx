import React, { useEffect, useState, useRef } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useDocumentStore } from '../store/useDocumentStore';
import { exportDocumentToJson } from '../engine/export/exportJson';
import { getProjectById } from '../persistence/projectStorage';
import {
  Plus,
  Upload,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Download,
  FolderKanban,
  FileCode,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';

interface ProjectManagerProps {
  onOpenProject: (doc: any) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onOpenProject }) => {
  const {
    projects,
    loadProjectsList,
    createProject,
    openProject,
    cloneProject,
    renameProjectItem,
    deleteProjectItem,
    showConfirmModal,
    setImportModalOpen
  } = useProjectStore();

  const setDocument = useDocumentStore((s) => s.setDocument);

  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjectsList();
  }, [loadProjectsList]);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleCreateNew = async () => {
    const newDoc = await createProject();
    setDocument(newDoc);
    onOpenProject(newDoc);
  };

  const handleOpen = async (id: string) => {
    const doc = await openProject(id);
    if (doc) {
      setDocument(doc);
      onOpenProject(doc);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    await cloneProject(id);
  };

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveRename = async (id: string) => {
    if (editName.trim()) {
      await renameProjectItem(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    showConfirmModal(
      'Delete Project',
      `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      async () => {
        await deleteProjectItem(id);
      },
      'Delete Project'
    );
  };

  const handleExport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const doc = await getProjectById(id);
    if (doc) {
      exportDocumentToJson(doc);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chigma-project-manager">
      {/* Home Navigation Header */}
      <header className="manager-header">
        <div className="manager-header-inner">
          <div className="brand-section">
            <div className="brand-icon lg">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
              <span className="dot dot-4" />
            </div>
            <div>
              <h1 className="brand-title">Chigma</h1>
              <p className="brand-subtitle">Offline Wireframing &amp; Visual Design</p>
            </div>
          </div>

          <div className="manager-actions">
            <button className="btn-secondary" onClick={() => setImportModalOpen(true)}>
              <Upload size={15} />
              <span>Import (.chigma.json)</span>
            </button>
            <button className="btn-primary" onClick={handleCreateNew}>
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="manager-main-content">
        {/* Search & Stats Bar */}
        <div className="manager-toolbar">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search your projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="projects-count">
            <span>{projects.length} {projects.length === 1 ? 'Project' : 'Projects'}</span>
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="empty-projects-view">
            <div className="empty-icon-card">
              <FolderKanban size={36} />
            </div>
            <h3>{search ? 'No projects matched your search' : 'No projects yet'}</h3>
            <p>
              {search
                ? 'Try a different search query or clear the filter.'
                : 'Create your first offline wireframing project to get started.'}
            </p>
            {!search && (
              <button className="btn-primary lg" onClick={handleCreateNew}>
                <Sparkles size={16} />
                <span>Create New Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {/* New Project Quick Card */}
            <div className="project-card new-card" onClick={handleCreateNew}>
              <div className="new-card-icon">
                <Plus size={28} />
              </div>
              <span className="new-card-label">Create New Project</span>
            </div>

            {/* Existing Projects */}
            {filteredProjects.map((p) => {
              const isEditing = editingId === p.id;
              const isMenuOpen = activeMenuId === p.id;

              return (
                <div
                  key={p.id}
                  className="project-card"
                  onClick={() => handleOpen(p.id)}
                >
                  {/* Thumbnail / Document Preview Banner */}
                  <div className="project-card-preview">
                    <FileCode size={36} className="preview-placeholder-icon" />
                  </div>

                  {/* Card Footer Info */}
                  <div className="project-card-info" onClick={(e) => isEditing && e.stopPropagation()}>
                    <div className="info-top">
                      {isEditing ? (
                        <input
                          type="text"
                          className="project-rename-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleSaveRename(p.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(p.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h4
                          className="project-card-name"
                          onDoubleClick={(e) => handleStartRename(p.id, p.name, e)}
                          title="Double click to rename"
                        >
                          {p.name}
                        </h4>
                      )}

                      {/* Action Menu Trigger */}
                      <div className="card-menu-container">
                        <button
                          className="btn-icon xs card-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : p.id);
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div ref={menuRef} className="card-dropdown-menu">
                            <button onClick={(e) => handleStartRename(p.id, p.name, e)}>
                              <Edit2 size={13} />
                              <span>Rename</span>
                            </button>
                            <button onClick={(e) => handleDuplicate(p.id, e)}>
                              <Copy size={13} />
                              <span>Duplicate</span>
                            </button>
                            <button onClick={(e) => handleExport(p.id, e)}>
                              <Download size={13} />
                              <span>Export JSON</span>
                            </button>
                            <div className="menu-divider" />
                            <button
                              className="danger"
                              onClick={(e) => handleDelete(p.id, p.name, e)}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="info-meta">
                      <span className="meta-item">
                        <Clock size={12} />
                        {formatDate(p.updatedAt)}
                      </span>
                      <span className="meta-item">
                        <Layers size={12} />
                        {p.pageCount} {p.pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
