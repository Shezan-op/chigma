import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { ToolStrip } from '../toolbar/ToolStrip';
import { PagesBar } from '../layers/PagesBar';
import { LayersPanel } from '../layers/LayersPanel';
import { ComponentLibraryPanel } from './ComponentLibraryPanel';
import { Layers, Component } from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { leftSidebarTab, setLeftSidebarTab } = useEditorStore();

  return (
    <aside className="chigma-left-sidebar">
      {/* 1. Main Tool Strip (Select, Shapes, Pencil, Text) */}
      <ToolStrip />

      {/* 2. Side Panel Container */}
      <div className="sidebar-content-area">
        {/* Tab switcher: Layers vs Components */}
        <div className="sidebar-tabs-header">
          <button
            className={`sidebar-tab ${leftSidebarTab === 'layers' ? 'active' : ''}`}
            onClick={() => setLeftSidebarTab('layers')}
          >
            <Layers size={14} />
            <span>Layers</span>
          </button>
          <button
            className={`sidebar-tab ${leftSidebarTab === 'components' ? 'active' : ''}`}
            onClick={() => setLeftSidebarTab('components')}
          >
            <Component size={14} />
            <span>Components</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="sidebar-tab-body">
          {leftSidebarTab === 'layers' ? (
            <>
              <PagesBar />
              <LayersPanel />
            </>
          ) : (
            <ComponentLibraryPanel />
          )}
        </div>
      </div>
    </aside>
  );
};
