import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useDocumentStore } from '../store/useDocumentStore';
import { type ChigmaDocument, type ProjectMetadata, createDefaultPage } from '../models/document';
import { createDefaultNode } from '../models/document';
import { ConfirmModal } from '../components/dialogs/ConfirmModal';
import { ImportModal } from '../components/dialogs/ImportModal';
import {
  Plus,
  Upload,
  Clock,
  Layers,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Search,
  Download,
  Home,
  LayoutTemplate,
  Component,
  Cloud,
  Sun,
  Moon,
  ChevronRight,
  LayoutGrid,
  List,
  Layout
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
  const [activeNav, setActiveNav] = useState<'home' | 'recent' | 'templates' | 'components' | 'trash'>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: '2.4 MB', total: '1 GB', percent: 0.24 });

  useEffect(() => {
    loadProjectsList();
    // Storage estimation
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const usedMB = ((est.usage || 2400000) / (1024 * 1024)).toFixed(1);
        setStorageUsage({
          used: `${usedMB} MB`,
          total: '1 GB',
          percent: Math.min(100, Number(usedMB) / 10)
        });
      });
    }
  }, [loadProjectsList]);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    if (newDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleCreateNew = async () => {
    try {
      const newDoc = await createProject('Untitled Design');
      setDocument(newDoc);
      onOpenEditor();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleCreateFromTemplate = async (templateType: 'saas' | 'mobile' | 'dashboard' | 'blank') => {
    if (templateType === 'blank') {
      return handleCreateNew();
    }

    try {
      let docName = 'SaaS Landing Page';
      if (templateType === 'mobile') docName = 'Mobile App Wireframe';
      if (templateType === 'dashboard') docName = 'Analytics Dashboard';

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
          createDefaultNode('sidebar', 80, 40, { width: 220, height: 760, title: 'Analytics Cloud', fill: '#F7F7F5' }),
          createDefaultNode('navbar', 320, 40, { width: 900, height: 60, brandName: 'Performance Overview', showAvatar: true, showSearch: true }),
          createDefaultNode('card', 320, 120, { width: 280, height: 120, title: 'Gross Revenue', subtitle: '+18.4% from previous cycle', content: '$148,290.00', cornerRadius: 10 }),
          createDefaultNode('card', 630, 120, { width: 280, height: 120, title: 'Active Subscribers', subtitle: '+1,420 net new accounts', content: '52,840 users', cornerRadius: 10 }),
          createDefaultNode('card', 940, 120, { width: 280, height: 120, title: 'Conversion Rate', subtitle: 'Target goal: 4.50%', content: '5.12%', cornerRadius: 10 }),
          createDefaultNode('line-chart', 320, 260, { width: 590, height: 270, title: 'Annual Revenue & Growth Velocity', curved: true }),
          createDefaultNode('donut-chart', 940, 260, { width: 280, height: 270, title: 'Device & Platform Share' }),
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

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortBy === 'updated' ? b.updatedAt - a.updatedAt : a.name.localeCompare(b.name)));

  return (
    <div className="chigma-pm-root">
      {/* 1. Left Sidebar */}
      <aside className="pm-sidebar">
        {/* Brand Header */}
        <div className="pm-brand">
          <div className="pm-logo-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#000000" />
              <path d="M7 8C7 6.89543 7.89543 6 9 6H15C16.1046 6 17 6.89543 17 8V9C17 10.1046 16.1046 11 15 11H9C7.89543 11 7 10.1046 7 9V8Z" fill="#FFFFFF" />
              <path d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V16C17 17.1046 16.1046 18 15 18H9C7.89543 18 7 17.1046 7 16V15Z" fill="#FFFFFF" />
              <circle cx="9.5" cy="8.5" r="1.5" fill="#4F46E5" />
            </svg>
          </div>
          <div className="pm-brand-text">
            <span className="pm-brand-title">Chigma</span>
            <span className="pm-brand-sub">Offline Visual Design &amp; Wireframing</span>
          </div>
        </div>

        {/* New File Primary CTA Button */}
        <div className="pm-new-btn-wrapper">
          <button className="pm-new-file-btn" onClick={handleCreateNew}>
            <div className="pm-new-btn-content">
              <Plus size={16} strokeWidth={2.5} />
              <span>New File</span>
            </div>
            <span className="pm-btn-shortcut">Ctrl + N</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="pm-nav-list">
          <button
            className={`pm-nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => setActiveNav('home')}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <button
            className={`pm-nav-item ${activeNav === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveNav('recent')}
          >
            <Clock size={16} />
            <span>Recent</span>
          </button>
          <button
            className={`pm-nav-item ${activeNav === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveNav('templates')}
          >
            <LayoutTemplate size={16} />
            <span>Templates</span>
          </button>
          <button
            className={`pm-nav-item ${activeNav === 'components' ? 'active' : ''}`}
            onClick={() => setActiveNav('components')}
          >
            <Component size={16} />
            <span>Components</span>
          </button>
          <button
            className={`pm-nav-item ${activeNav === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveNav('trash')}
          >
            <Trash2 size={16} />
            <span>Trash</span>
          </button>
        </nav>

        {/* Workspaces Section */}
        <div className="pm-workspaces-section">
          <div className="pm-section-label-row">
            <span className="pm-section-label">WORKSPACES</span>
            <button className="pm-icon-btn xs" title="New Workspace">
              <Plus size={13} />
            </button>
          </div>
          <div className="pm-workspace-item active">
            <div className="pm-ws-badge">M</div>
            <span className="pm-ws-name">My Workspace</span>
            <button className="pm-ws-more-btn">
              <MoreVertical size={13} />
            </button>
          </div>
        </div>

        {/* Footer Area with Storage indicator & Theme toggle */}
        <div className="pm-sidebar-footer">
          <div className="pm-storage-card">
            <div className="pm-storage-header">
              <div className="pm-storage-title">
                <Cloud size={13} />
                <span>Local Storage</span>
              </div>
              <span className="pm-storage-val">{storageUsage.used} / {storageUsage.total} used</span>
            </div>
            <div className="pm-storage-bar-track">
              <div className="pm-storage-bar-fill" style={{ width: `${Math.max(4, storageUsage.percent)}%` }} />
            </div>
          </div>

          <button className="pm-theme-toggle-btn" onClick={toggleTheme}>
            <div className="pm-theme-left">
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>

      {/* 2. Main Body Content */}
      <main className="pm-main-content">
        {/* Top Header Bar */}
        <header className="pm-top-bar">
          <div className="pm-search-container">
            <Search size={15} className="pm-search-icon" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pm-search-input"
            />
            <span className="pm-search-kbd">Ctrl + K</span>
          </div>

          <div className="pm-top-actions">
            <button
              className="pm-action-btn secondary"
              onClick={() => setImportModalOpen(true)}
              title="Import .chigma.json file"
            >
              <Upload size={14} />
              <span>Import .chigma.json</span>
            </button>

            <button
              className="pm-action-btn secondary"
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
              title="Backup entire workspace to JSON"
            >
              <Download size={14} />
              <span>Backup</span>
            </button>

            <div className="pm-view-mode-toggle">
              <button
                className={`pm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`pm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>

            <div className="pm-user-avatar" title="Shezan">
              <span>S</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="pm-scroll-area">
          {/* Welcome Hero Banner */}
          <div className="pm-hero-banner">
            <div className="pm-hero-left">
              <h1 className="pm-hero-title">Welcome back, Shezan 👋</h1>
              <p className="pm-hero-sub">What will you design today?</p>
              <div className="pm-hero-btn-row">
                <button className="pm-hero-btn primary" onClick={handleCreateNew}>
                  <Plus size={15} strokeWidth={2.5} />
                  <span>New Blank Canvas</span>
                </button>
                <button
                  className="pm-hero-btn outline"
                  onClick={() => setActiveNav('templates')}
                >
                  <LayoutTemplate size={15} />
                  <span>Browse Templates</span>
                </button>
              </div>
            </div>

            <div className="pm-hero-illustration">
              <svg width="260" height="130" viewBox="0 0 260 130" fill="none">
                {/* Background soft cloud */}
                <ellipse cx="170" cy="65" rx="80" ry="50" fill="#EEF2FF" />
                {/* Vector Artboard Mockup */}
                <rect x="70" y="20" width="130" height="85" rx="8" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
                {/* Inner mockup card */}
                <rect x="85" y="32" width="60" height="42" rx="4" fill="#F3F4F6" />
                <path d="M92 56L102 44L114 58L124 48L138 64H92V56Z" fill="#E5E7EB" />
                {/* Resize Selection handles */}
                <rect x="66" y="16" width="8" height="8" rx="2" fill="#4F46E5" />
                <rect x="196" y="16" width="8" height="8" rx="2" fill="#4F46E5" />
                <rect x="66" y="101" width="8" height="8" rx="2" fill="#4F46E5" />
                <rect x="196" y="101" width="8" height="8" rx="2" fill="#4F46E5" />
                {/* 'T' text chip */}
                <rect x="180" y="36" width="28" height="28" rx="6" fill="#FFFFFF" stroke="#E5E7EB" />
                <text x="188" y="55" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#4F46E5">T</text>
                {/* Add '+' node */}
                <circle cx="160" cy="90" r="10" fill="#4F46E5" />
                <path d="M160 85V95M155 90H165" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                {/* Cursor pointer */}
                <path d="M45 42L58 52L52 54L55 60L52 61L49 55L45 58V42Z" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Start with a template Section */}
          <section className="pm-section">
            <div className="pm-section-head">
              <h2 className="pm-section-title">Start with a template</h2>
              <button
                className="pm-view-all-link"
                onClick={() => setActiveNav('templates')}
              >
                <span>View all templates</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="pm-templates-grid">
              {/* 1. Blank Canvas */}
              <div
                className="pm-template-card"
                onClick={() => handleCreateFromTemplate('blank')}
              >
                <div className="pm-tmpl-preview blank-preview">
                  <div className="pm-tmpl-plus-circle">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="pm-tmpl-meta">
                  <div className="pm-tmpl-title">Blank Canvas</div>
                  <div className="pm-tmpl-desc">Start from scratch</div>
                </div>
                <div className="pm-tmpl-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>

              {/* 2. SaaS Landing Page */}
              <div
                className="pm-template-card"
                onClick={() => handleCreateFromTemplate('saas')}
              >
                <div className="pm-tmpl-preview saas-preview">
                  <div className="pm-tmpl-mockup">
                    <div className="pm-mockup-bar" />
                    <div className="pm-mockup-hero" />
                    <div className="pm-mockup-row">
                      <div className="pm-mockup-box" />
                      <div className="pm-mockup-box" />
                    </div>
                  </div>
                </div>
                <div className="pm-tmpl-meta">
                  <div className="pm-tmpl-title">SaaS Landing Page</div>
                  <div className="pm-tmpl-desc">Hero, features, pricing &amp; more</div>
                </div>
                <div className="pm-tmpl-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>

              {/* 3. Mobile App Wireframe */}
              <div
                className="pm-template-card"
                onClick={() => handleCreateFromTemplate('mobile')}
              >
                <div className="pm-tmpl-preview mobile-preview">
                  <div className="pm-mockup-phone">
                    <div className="pm-phone-notch" />
                    <div className="pm-phone-row" />
                    <div className="pm-phone-card" />
                    <div className="pm-phone-tabs" />
                  </div>
                </div>
                <div className="pm-tmpl-meta">
                  <div className="pm-tmpl-title">Mobile App Wireframe</div>
                  <div className="pm-tmpl-desc">iOS &amp; Android layouts</div>
                </div>
                <div className="pm-tmpl-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>

              {/* 4. Analytics Dashboard */}
              <div
                className="pm-template-card"
                onClick={() => handleCreateFromTemplate('dashboard')}
              >
                <div className="pm-tmpl-preview dashboard-preview">
                  <div className="pm-mockup-dash">
                    <div className="pm-dash-chart">
                      <div className="pm-dash-bar b1" />
                      <div className="pm-dash-bar b2" />
                      <div className="pm-dash-bar b3" />
                      <div className="pm-dash-bar b4" />
                    </div>
                    <div className="pm-dash-donut" />
                  </div>
                </div>
                <div className="pm-tmpl-meta">
                  <div className="pm-tmpl-title">Analytics Dashboard</div>
                  <div className="pm-tmpl-desc">KPIs, charts &amp; tables</div>
                </div>
                <div className="pm-tmpl-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </section>

          {/* Recent Projects Section */}
          <section className="pm-section">
            <div className="pm-section-head">
              <h2 className="pm-section-title">Recent Projects</h2>
              <div className="pm-sort-dropdown-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pm-sort-select"
                >
                  <option value="updated">Last edited</option>
                  <option value="name">Project name</option>
                </select>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="pm-empty-projects">
                <div className="pm-empty-icon-box">
                  <Layers size={32} strokeWidth={1.5} />
                </div>
                <h3 className="pm-empty-title">
                  {searchQuery ? 'No matching projects found' : 'No projects created yet'}
                </h3>
                <p className="pm-empty-sub">
                  {searchQuery
                    ? 'Try searching with a different keyword'
                    : 'Create a new blank canvas or start with a template to begin wireframing.'}
                </p>
                {!searchQuery && (
                  <button className="pm-hero-btn primary" onClick={handleCreateNew}>
                    <Plus size={15} />
                    <span>Create New Project</span>
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="pm-projects-grid">
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
                      className="pm-project-card"
                      onClick={() => handleOpenProject(p)}
                    >
                      {/* Thumbnail Wireframe Preview */}
                      <div className="pm-proj-thumbnail">
                        <div className="pm-wireframe-mockup-bg">
                          <div className="pm-wf-header" />
                          <div className="pm-wf-grid">
                            <div className="pm-wf-box" />
                            <div className="pm-wf-box" />
                            <div className="pm-wf-box" />
                          </div>
                          <div className="pm-wf-chart" />
                        </div>
                        <div className="pm-proj-tag">
                          <span>{p.nodeCount || 0} Elements</span>
                        </div>
                      </div>

                      {/* Info & Menu Row */}
                      <div className="pm-proj-info-row">
                        <div className="pm-proj-text">
                          {isRenaming ? (
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={() => handleFinishRename(p.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFinishRename(p.id);
                                if (e.key === 'Escape') setRenamingId(null);
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              className="pm-rename-input"
                            />
                          ) : (
                            <div
                              className="pm-proj-name"
                              onDoubleClick={(e) => handleStartRename(p, e)}
                              title="Double-click to rename"
                            >
                              {p.name}
                            </div>
                          )}
                          <div className="pm-proj-time">
                            <Clock size={11} />
                            <span>Edited {dateStr}</span>
                          </div>
                        </div>

                        <div className="pm-proj-menu-container" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="pm-proj-menu-btn"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                          >
                            <MoreVertical size={15} />
                          </button>

                          {isMenuOpen && (
                            <div className="pm-card-dropdown">
                              <button
                                className="pm-dd-item"
                                onClick={(e) => handleStartRename(p, e)}
                              >
                                <Edit2 size={13} />
                                <span>Rename</span>
                              </button>
                              <button
                                className="pm-dd-item"
                                onClick={(e) => handleDuplicate(p.id, e)}
                              >
                                <Copy size={13} />
                                <span>Duplicate</span>
                              </button>
                              <div className="pm-dd-divider" />
                              <button
                                className="pm-dd-item danger"
                                onClick={(e) => handleDelete(p, e)}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pm-projects-list">
                {filteredProjects.map((p) => {
                  const dateStr = new Date(p.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={p.id}
                      className="pm-list-row"
                      onClick={() => handleOpenProject(p)}
                    >
                      <div className="pm-list-icon">
                        <Layout size={18} />
                      </div>
                      <div className="pm-list-title">{p.name}</div>
                      <div className="pm-list-pages">{p.pageCount || 1} Page(s)</div>
                      <div className="pm-list-nodes">{p.nodeCount || 0} Elements</div>
                      <div className="pm-list-time">Edited {dateStr}</div>
                      <div className="pm-list-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="pm-icon-btn xs"
                          onClick={(e) => handleDuplicate(p.id, e)}
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          className="pm-icon-btn xs danger"
                          onClick={(e) => handleDelete(p, e)}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Global Modals */}
      <ConfirmModal />
      <ImportModal />
    </div>
  );
};
