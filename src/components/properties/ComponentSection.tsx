import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import {
  createComponentMaster,
  detachInstance,
  createInstanceFromMaster
} from '../../engine/components/componentEngine';
import { Component, Unlink, ExternalLink, ArrowLeftRight } from 'lucide-react';

interface ComponentSectionProps {
  node: ChigmaNode;
  onUpdate: (props: Partial<ChigmaNode>) => void;
}

export const ComponentSection: React.FC<ComponentSectionProps> = ({ node, onUpdate }) => {
  const document = useDocumentStore((s) => s.document);
  const updateDocument = useDocumentStore((s) => s.updateDocument);
  const activePage = useDocumentStore((s) => s.getActivePage());
  const selectNode = useEditorStore((s) => s.selectNode);

  const components = document.components || [];

  // 1. If it is already a Master Component
  if (node.isComponent) {
    const compMaster = components.find((c) => c.id === node.componentId);

    return (
      <div
        style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#F5F3FF',
          border: '1px solid #DDD6FE',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', color: '#7C3AED' }}>❖</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#5B21B6' }}>Main Component</span>
          </div>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '50px',
              backgroundColor: '#EDE9FE',
              color: '#6D28D9',
              fontWeight: 600
            }}
          >
            Master
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>
          Changes made here will automatically propagate to all instances across your pages.
        </p>

        <button
          onClick={() => {
            if (!compMaster) return;
            const newInstance = createInstanceFromMaster(compMaster, node, node.x + 40, node.y + 40);
            useDocumentStore.getState().addNode(newInstance);
            selectNode(newInstance.id);
          }}
          style={{
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid #7C3AED',
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Component size={13} />
          Create Instance
        </button>
      </div>
    );
  }

  // 2. If it is an Instance
  if (node.instanceOf) {
    const compMaster = components.find((c) => c.id === node.instanceOf);
    const overridesCount = node.overrides ? Object.keys(node.overrides).length : 0;

    return (
      <div
        style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', color: '#059669' }}>◇</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#065F46' }}>
              {compMaster?.name || 'Component Instance'}
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '50px',
              backgroundColor: '#D1FAE5',
              color: '#047857',
              fontWeight: 600
            }}
          >
            Instance
          </span>
        </div>

        {overridesCount > 0 && (
          <span style={{ fontSize: '11px', color: '#047857' }}>
            {overridesCount} property override{overridesCount > 1 ? 's' : ''} applied
          </span>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            onClick={() => {
              if (compMaster?.mainNodeId) {
                selectNode(compMaster.mainNodeId);
              }
            }}
            title="Go to main component definition"
            style={{
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <ExternalLink size={12} />
            Go to Main
          </button>

          <button
            onClick={() => {
              const detached = detachInstance(node);
              onUpdate(detached);
            }}
            title="Detach from master component"
            style={{
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#DC2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Unlink size={12} />
            Detach
          </button>
        </div>

        {/* Swap Component Dropdown */}
        {components.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <ArrowLeftRight size={12} color="#047857" />
            <select
              value={node.instanceOf}
              onChange={(e) => {
                const targetMaster = components.find((c) => c.id === e.target.value);
                if (targetMaster && activePage && activePage.children) {
                  const masterNode = activePage.children.find((n) => n.id === targetMaster.mainNodeId);
                  if (masterNode) {
                    const swapped = createInstanceFromMaster(targetMaster, masterNode, node.x, node.y);
                    swapped.id = node.id;
                    onUpdate(swapped);
                  }
                }
              }}
              style={{
                flex: 1,
                fontSize: '11px',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #A7F3D0',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  Swap: {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  // 3. Regular Node: Offer "Create Component"
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#525252' }}>Component</span>
      </div>

      <button
        onClick={() => {
          const { master, updatedNode } = createComponentMaster(node);
          const currentComponents = document.components || [];
          updateDocument({
            components: [...currentComponents, master]
          });
          onUpdate(updatedNode);
        }}
        title="Convert selection into a reusable Master Component (Ctrl+Alt+K)"
        style={{
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '6px',
          border: '1px solid #E6E6E6',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F5F3FF';
          e.currentTarget.style.borderColor = '#7C3AED';
          e.currentTarget.style.color = '#7C3AED';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E6E6E6';
          e.currentTarget.style.color = '#000000';
        }}
      >
        <Component size={14} />
        Create Component
      </button>
    </div>
  );
};
