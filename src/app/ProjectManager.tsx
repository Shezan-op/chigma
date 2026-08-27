import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useDocumentStore } from '../store/useDocumentStore';
import { type ChigmaDocument, type ProjectMetadata, createDefaultPage } from '../models/document';
import { createDefaultNode } from '../models/document';
import { ConfirmModal } from '../components/dialogs/ConfirmModal';
import { ImportModal } from '../components/dialogs/ImportModal';
import {
  Plus,
  Layout,
  Upload,
  Clock,
  Layers,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Sparkles,
  Smartphone,
  BarChart3,
  Search,
  Download
} from 'lucide-react';

interface ProjectManagerProps {
  onOpenEditor: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onOpenEditor }) => {
  const {
    projects,
    loadProjectsList,
    openProject,
    createProject,
    cloneProject,
    renameProjectItem,
    deleteProjectItem,
    showConfirmModal,
    setImportModalOpen
  } = useProjectStore();

  const setDocument = useDocumentStore((s) => s.setDocument);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjectsList();
  }, [loadProjectsList]);

  const handleCreateNew = async () => {
    try {
      const newDoc = await createProject('Untitled Design');
      setDocument(newDoc);
      onOpenEditor();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleCreateFromTemplate = async (templateType: 'saas' | 'mobile' | 'dashboard') => {
    try {
      let docName = 'SaaS Landing Page';
      if (templateType === 'mobile') docName = 'Mobile App Wireframe';
      if (templateType === 'dashboard') docName = 'Modern SaaS Analytics Dashboard';

      const newDoc = await createProject(docName);
      const page = createDefaultPage('Page 1');

      if (templateType === 'saas') {
        page.children = [
          createDefaultNode('navbar', 100, 40, { width: 1000, height: 64, brandName: 'Acme SaaS' }),
          createDefaultNode('badge', 500, 140, { width: 140, height: 28, label: '✨ Introducing v2.0', variant: 'info' }),
          createDefaultNode('text', 260, 190, {
            width: 680,
            height: 90,
            text: 'Build High-Impact Wireframes in Seconds',
            fontSize: 34,
            fontWeight: 700,
            textAlign: 'center'
          }),
          createDefaultNode('text', 280, 290, {
            width: 640,
            height: 48,
            text: 'Fast, offline-first visual design software for modern product teams and creators.',
            fontSize: 16,
            fontWeight: 400,
            fill: '#52525B',
            textAlign: 'center'
          }),
          createDefaultNode('button', 460, 360, { width: 140, height: 44, label: 'Get Started Free', variant: 'primary', cornerRadius: 50 }),
          createDefaultNode('button', 610, 360, { width: 130, height: 44, label: 'Live Demo →', variant: 'secondary', cornerRadius: 50 }),
          createDefaultNode('bar-chart', 100, 440, { width: 480, height: 260, title: 'Quarterly Growth' }),
          createDefaultNode('card', 610, 440, { width: 490, height: 260, title: 'Interactive Prototype Feature', content: 'Turn concepts into responsive code with clean vector layout rendering.' })
        ];
      } else if (templateType === 'mobile') {
        page.children = [
          createDefaultNode('frame', 380, 40, { width: 375, height: 740, cornerRadius: 36, fill: '#FFFFFF' }),
          createDefaultNode('navbar', 380, 40, { width: 375, height: 54, brandName: 'Mobile Feed', links: [] }),
          createDefaultNode('avatar', 400, 110, { width: 50, height: 50, name: 'Sarah Jenkins', fill: '#6366F1' }),
          createDefaultNode('text', 460, 115, { width: 220, height: 22, text: 'Sarah Jenkins', fontSize: 15, fontWeight: 600 }),
          createDefaultNode('text', 460, 137, { width: 220, height: 18, text: 'Product Designer', fontSize: 12, fill: '#71717A' }),
          createDefaultNode('card', 400, 180, { width: 335, height: 220, title: 'Design System Guidelines', content: 'Explore unified color tokens, grid alignment, and interaction physics.' }),
          createDefaultNode('card', 400, 420, { width: 335, height: 200, title: 'Weekly Sprint Metrics', content: 'Design handoff velocity increased by 42% this quarter.' }),
          createDefaultNode('tabs', 380, 720, { width: 375, height: 50, tabs: ['Feed', 'Explore', 'Saved', 'Profile'] })
        ];
      } else if (templateType === 'dashboard') {
        page.children = [
          createDefaultNode('sidebar', 80, 40, {
            width: 220,
            height: 760,
            title: 'Analytics Cloud',
            fill: '#F7F7F5'
          }),
          createDefaultNode('navbar', 320, 40, {
            width: 900,
            height: 60,
            brandName: 'Performance Overview',
            showAvatar: true,
            showSearch: true
          }),
          // 3 KPI Metric Cards with Shadow & pastel tokens
          createDefaultNode('card', 320, 120, {
            width: 280,
            height: 120,
            title: 'Gross Revenue',
            subtitle: '+18.4% from previous cycle',
            content: '$148,290.00',
            cornerRadius: 10,
            effects: [{ id: 'e1', type: 'drop-shadow', visible: true, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.06 }]
          }),
          createDefaultNode('card', 630, 120, {
            width: 280,
            height: 120,
            title: 'Active Subscribers',
            subtitle: '+1,420 net new accounts',
            content: '52,840 users',
            cornerRadius: 10,
            effects: [{ id: 'e2', type: 'drop-shadow', visible: true, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.06 }]
          }),
          createDefaultNode('card', 940, 120, {
            width: 280,
            height: 120,
            title: 'Conversion Rate',
            subtitle: 'Target goal: 4.50%',
            content: '5.12%',
            cornerRadius: 10,
            effects: [{ id: 'e3', type: 'drop-shadow', visible: true, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.06 }]
          }),
          // Charts
          createDefaultNode('line-chart', 320, 260, {
            width: 590,
            height: 270,
            title: 'Annual Revenue & Growth Velocity',
            curved: true
          }),
          createDefaultNode('donut-chart', 940, 260, {
            width: 280,
            height: 270,
            title: 'Device & Platform Share'
          }),
          // Recent Transactions Table
          createDefaultNode('table', 320, 550, {
            width: 900,
            height: 250,
            headers: ['Customer', 'Plan Tier', 'Status', 'MRR Value', 'Date'],
            rows: [
              ['Stripe Inc.', 'Enterprise Pro', 'Active', '$2,400/mo', 'Aug 26'],
              ['Vercel Labs', 'Scale Tier', 'Active', '$1,200/mo', 'Aug 25'],
              ['Linear App', 'Growth Tier', 'Active', '$850/mo', 'Aug 24'],
              ['Raycast Org', 'Starter Tier', 'Pending', '$350/mo', 'Aug 22']
            ]
          })
        ];
      }

      newDoc.pages = [page];
      useProjectStore.getState().saveCurrentProject(newDoc);
      setDocument(newDoc);
      onOpenEditor();
    } catch (err) {
      console.error('Failed to create project from template:', err);
    }
  };

  const handleOpenProject = async (p: ProjectMetadata) => {
    try {
      const doc: ChigmaDocument | null = await openProject(p.id);
      if (doc) {
        setDocument(doc);
        onOpenEditor();
      }
    } catch (err) {
      console.error('Failed to open project:', err);
    }
  };

  const handleDuplicate = async (pId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    await cloneProject(pId);
  };

  const handleDelete = (p: ProjectMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    showConfirmModal(
      'Delete Project',
      `Are you sure you want to delete "${p.name}"? This action is permanent and cannot be undone.`,
      async () => {
        await deleteProjectItem(p.id);
      },
      'Delete Project'
    );
  };

  const handleStartRename = (p: ProjectMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setRenamingId(p.id);
    setRenameValue(p.name);
  };

  const handleFinishRename = async (pId: string) => {
    if (renameValue.trim()) {
      await renameProjectItem(pId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chigma-project-manager-root">
      {/* Top Header */}
      <header className="manager-header">
        <div className="manager-header-inner">
          <div className="manager-brand">
            <div className="brand-logo-badge">
              <span className="brand-dot" />
            </div>
            <div className="brand-titles">
              <span className="brand-title">Chigma</span>
              <span className="brand-subtitle">Offline Visual Design &amp; Wireframing</span>
            </div>
          </div>

          <div className="manager-header-actions">
            <button
              className="btn btn-secondary"
              onClick={async () => {
                const { exportWorkspaceBackup } = await import('../persistence/workspaceBackup');
                const json = await exportWorkspaceBackup();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chigma-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              title="Download full workspace backup (.json)"
            >
              <Download size={14} />
              <span>Backup Workspace</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setImportModalOpen(true)}
            >
              <Upload size={14} />
              <span>Import Project</span>
            </button>
            <button className="btn btn-primary" onClick={handleCreateNew}>
              <Plus size={15} />
              <span>New Blank Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="manager-content">
        {/* Starter Templates Section */}
        <section className="manager-templates-section">
          <div className="section-header">
            <div className="section-title">
              <Sparkles size={16} color="#0066FF" />
              <span>Quick Wireframe Starters</span>
            </div>
            <span className="section-desc">Instantly scaffold wireframes with pre-built layouts</span>
          </div>

          <div className="templates-grid">
            {/* Blank Canvas */}
            <div className="template-card template-blank" onClick={handleCreateNew}>
              <div className="template-icon-box">
                <Plus size={24} />
              </div>
              <div className="template-info">
                <div className="template-name">Blank Canvas</div>
                <div className="template-sub">Start with an empty vector artboard</div>
              </div>
            </div>

            {/* SaaS Landing Page */}
            <div
              className="template-card template-saas"
              onClick={() => handleCreateFromTemplate('saas')}
            >
              <div className="template-icon-box" style={{ background: 'var(--chigma-block-lime)', color: '#000000' }}>
                <Layout size={20} />
              </div>
              <div className="template-info">
                <div className="template-name">SaaS Landing Page</div>
                <div className="template-sub">Hero, CTA pills, metric bar charts &amp; feature cards</div>
              </div>
            </div>

            {/* Mobile App Wireframe */}
            <div
              className="template-card template-mobile"
              onClick={() => handleCreateFromTemplate('mobile')}
            >
              <div className="template-icon-box" style={{ background: 'var(--chigma-block-lilac)', color: '#000000' }}>
                <Smartphone size={20} />
              </div>
              <div className="template-info">
                <div className="template-name">Mobile App Wireframe</div>
                <div className="template-sub">Phone container, avatar feed &amp; tab navigation</div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div
              className="template-card template-dashboard"
              onClick={() => handleCreateFromTemplate('dashboard')}
            >
              <div className="template-icon-box" style={{ background: 'var(--chigma-block-mint)', color: '#000000' }}>
                <BarChart3 size={20} />
              </div>
              <div className="template-info">
                <div className="template-name">Modern SaaS Dashboard</div>
                <div className="template-sub">Sidebar, KPI summary widgets, line chart &amp; table</div>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Projects Section */}
        <section className="manager-projects-section">
          <div className="section-header-row">
            <div className="section-title">
              <span>Your Offline Projects</span>
              <span className="projects-count-pill">{projects.length}</span>
            </div>

            {/* Search filter */}
            {projects.length > 0 && (
              <div className="manager-search-box">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="empty-projects-state">
              <div className="empty-icon-circle">
                <Layers size={28} />
              </div>
              <div className="empty-title">
                {searchQuery ? 'No matching projects' : 'No projects created yet'}
              </div>
              <div className="empty-desc">
                {searchQuery
                  ? 'Try a different search query'
                  : 'Create a new project or select one of the quick wireframe templates above to begin designing.'}
              </div>
              {!searchQuery && (
                <button className="btn btn-primary" onClick={handleCreateNew}>
                  <Plus size={14} />
                  <span>Create Project</span>
                </button>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((p) => {
                const dateStr = new Date(p.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                const isMenuOpen = activeMenuId === p.id;
                const isRenaming = renamingId === p.id;

                return (
                  <div
                    key={p.id}
                    className="project-card"
                    onClick={() => handleOpenProject(p)}
                  >
                    {/* Thumbnail Preview Area */}
                    <div className="project-thumbnail">
                      <div className="thumbnail-canvas-placeholder">
                        <Layout size={32} strokeWidth={1} />
                      </div>
                      <div className="thumbnail-meta">
                        <span>{p.pageCount || 1} Page{p.pageCount > 1 ? 's' : ''}</span>
                        <span>{p.nodeCount || 0} Elements</span>
                      </div>
                    </div>

                    {/* Project Information */}
                    <div className="project-info-row">
                      <div className="project-details">
                        {isRenaming ? (
                          <input
                            type="text"
                            className="project-rename-input"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => handleFinishRename(p.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleFinishRename(p.id);
                              if (e.key === 'Escape') setRenamingId(null);
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div
                            className="project-name"
                            onDoubleClick={(e) => handleStartRename(p, e)}
                            title="Double click to rename"
                          >
                            {p.name}
                          </div>
                        )}
                        <div className="project-timestamp">
                          <Clock size={11} />
                          <span>Edited {dateStr}</span>
                        </div>
                      </div>

                      {/* Card Action Menu & Direct Delete */}
                      <div className="project-card-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-icon xs danger delete-quick-btn"
                          onClick={(e) => handleDelete(p, e)}
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          className={`btn-icon sm ${isMenuOpen ? 'active' : ''}`}
                          onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                          title="More Actions"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {isMenuOpen && (
                          <div className="card-menu-dropdown">
                            <button
                              className="menu-item"
                              onClick={(e) => handleStartRename(p, e)}
                            >
                              <Edit2 size={13} />
                              <span>Rename</span>
                            </button>
                            <button
                              className="menu-item"
                              onClick={(e) => handleDuplicate(p.id, e)}
                            >
                              <Copy size={13} />
                              <span>Duplicate</span>
                            </button>
                            <div className="menu-divider" />
                            <button
                              className="menu-item danger"
                              onClick={(e) => handleDelete(p, e)}
                            >
                              <Trash2 size={13} />
                              <span>Delete Project</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Global Modals */}
      <ConfirmModal />
      <ImportModal />
    </div>
  );
};
