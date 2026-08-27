import React, { useState, useMemo } from 'react';
import { BUILT_IN_ICONS } from '../../engine/icons/iconRegistry';
import type { IconCategory, IconDefinition } from '../../models/icons';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { createDefaultNode } from '../../models/document';
import { Search, X } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: IconCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Icons' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'actions', label: 'Actions' },
  { id: 'communication', label: 'Communication' },
  { id: 'media', label: 'Media' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'files', label: 'Files' },
  { id: 'users', label: 'Users' },
  { id: 'settings', label: 'Settings' },
  { id: 'status', label: 'Status' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'editor', label: 'Editor' },
  { id: 'social', label: 'Social' }
];

export const IconPickerModal: React.FC<IconPickerModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');

  const addNode = useDocumentStore((s) => s.addNode);
  const viewport = useEditorStore((s) => s.viewport);
  const selectNode = useEditorStore((s) => s.selectNode);

  const filteredIcons = useMemo(() => {
    return BUILT_IN_ICONS.filter((icon) => {
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        icon.name.toLowerCase().includes(query) ||
        icon.tags?.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectIcon = (icon: IconDefinition) => {
    // Position at canvas center in current viewport
    const canvasCenterX = -viewport.panX / viewport.zoom + (window.innerWidth / 2) / viewport.zoom;
    const canvasCenterY = -viewport.panY / viewport.zoom + (window.innerHeight / 2) / viewport.zoom;

    const iconNode = createDefaultNode('icon', Math.round(canvasCenterX - 16), Math.round(canvasCenterY - 16), {
      name: `Icon / ${icon.name}`,
      iconName: icon.name,
      width: 32,
      height: 32,
      color: '#000000',
      strokeWidth: 2
    });

    addNode(iconNode);
    selectNode(iconNode.id);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '680px',
          maxHeight: '80vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px #E6E6E6',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E6E6E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#000000' }}>
              Vector Icon Library
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#737373' }}>
              50+ vector icons ready for instant insertion into wireframes and UI designs.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              color: '#737373'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F7F7F5',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid #E6E6E6'
            }}
          >
            <Search size={16} color="#737373" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search icons (e.g. search, user, arrow, cart, settings)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#000000'
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            borderBottom: '1px solid #F0F0F0',
            backgroundColor: '#FCFCFB'
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '50px',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#000000' : '#E6E6E6',
                backgroundColor: selectedCategory === cat.id ? '#000000' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#525252',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat.id ? 600 : 400,
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: '12px',
            flex: 1
          }}
        >
          {filteredIcons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => handleSelectIcon(icon)}
              title={icon.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 6px',
                borderRadius: '8px',
                border: '1px solid #E6E6E6',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F4ECD6';
                e.currentTarget.style.borderColor = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E6E6E6';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: icon.svgPath }}
                style={{ marginBottom: '6px' }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: '#525252',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '80px'
                }}
              >
                {icon.name}
              </span>
            </button>
          ))}

          {filteredIcons.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#737373' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>No icons found matching "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
