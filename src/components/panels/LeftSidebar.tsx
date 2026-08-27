import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { ToolStrip } from '../toolbar/ToolStrip';
import { PagesBar } from '../layers/PagesBar';
import { LayersPanel } from '../layers/LayersPanel';
import { ComponentLibraryPanel } from './ComponentLibraryPanel';

export const LeftSidebar: React.FC = () => {
  const { leftSidebarTab, setLeftSidebarTab } = useEditorStore();

  return (
    <aside className="chigma-left-sidebar-wrapper">
      {/* 1. Vertical Toolstrip Bar (Far Left) */}
      <ToolStrip />

      {/* 2. Drawer Panel (Layers / Components) */}
      <div className="chigma-left-drawer">
        {/* Segmented Top Tab Pill Switcher */}
        <div className="drawer-tab-switcher">
          <button
            className={`drawer-tab-btn ${leftSidebarTab === 'layers' ? 'active' : ''}`}
            onClick={() => setLeftSidebarTab('layers')}
          >
            Layers
          </button>
          <button
            className={`drawer-tab-btn ${leftSidebarTab === 'components' ? 'active' : ''}`}
            onClick={() => setLeftSidebarTab('components')}
          >
            Components
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="drawer-body">
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
