import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { LayerTreeItem } from './LayerTreeItem';
import {
  Search,
  SlidersHorizontal
} from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const activePage = useDocumentStore((s) => s.getActivePage());

  const [searchQuery, setSearchQuery] = useState('');

  const nodes = activePage?.children || [];
  // Render in reverse so top layers visually appear at top of list
  const filteredNodes = nodes
    .filter((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .reverse();

  return (
    <div className="chigma-layers-panel-container">
      {/* Search Layers Input */}
      <div className="layers-search-box">
        <Search size={13} className="layers-search-icon" />
        <input
          type="text"
          placeholder="Search layers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="layers-search-input"
        />
        <button className="layers-filter-btn" title="Filter options">
          <SlidersHorizontal size={13} />
        </button>
      </div>

      {/* Layers Tree Content or Empty State */}
      <div className="layers-tree-scroll-area">
        {filteredNodes.length === 0 ? (
          <div className="layers-empty-state">
            {/* Isometric Stacked Layers Illustration */}
            <div className="empty-layers-icon-container">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 10L38 18L24 26L10 18L24 10Z" stroke="#818CF8" strokeWidth="2" strokeLinejoin="round" fill="#EEF2FF" />
                <path d="M10 24L24 32L38 24" stroke="#818CF8" strokeWidth="2" strokeLinejoin="round" />
                <path d="M10 30L24 38L38 30" stroke="#818CF8" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="empty-layers-headline">No layers on this page</span>
            <p className="empty-layers-sub">Start drawing or add components to build your design.</p>
          </div>
        ) : (
          <div className="layers-tree-list">
            {filteredNodes.map((node) => (
              <LayerTreeItem key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
