import React from 'react';
import type { ChigmaNode, InteractionLink } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import { Play, Link2, Trash2 } from 'lucide-react';

interface InteractionSectionProps {
  selectedNodes: ChigmaNode[];
}

export const InteractionSection: React.FC<InteractionSectionProps> = ({ selectedNodes }) => {
  const { document: currentDoc, updateNode } = useDocumentStore();

  if (selectedNodes.length !== 1) return null;
  const node = selectedNodes[0];

  const pages = currentDoc.pages || [];
  const interaction = node.interaction;

  const handleSetNavigate = (targetPageId: string) => {
    const newLink: InteractionLink = {
      trigger: 'click',
      action: 'navigate',
      targetPageId
    };
    updateNode(node.id, { interaction: newLink }, true, 'Add prototyping link');
  };

  const handleClearInteraction = () => {
    updateNode(node.id, { interaction: undefined }, true, 'Remove interaction link');
  };

  return (
    <div className="property-group">
      <div className="property-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Play size={12} color="#0066FF" />
          <span>Prototyping &amp; Links</span>
        </div>
        {interaction && (
          <button
            className="btn-icon xs danger"
            onClick={handleClearInteraction}
            title="Remove interaction"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="property-field full">
        <label>On Click (Navigate To)</label>
        <select
          value={interaction?.targetPageId || ''}
          onChange={(e) => {
            if (e.target.value) {
              handleSetNavigate(e.target.value);
            } else {
              handleClearInteraction();
            }
          }}
          style={{ width: '100%' }}
        >
          <option value="">No action (Static)</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              → Navigate to {p.name}
            </option>
          ))}
        </select>
      </div>

      {interaction && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            backgroundColor: 'rgba(0, 102, 255, 0.08)',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#0066FF'
          }}
        >
          <Link2 size={12} />
          <span>
            Linked to: <strong>{pages.find((p) => p.id === interaction.targetPageId)?.name || 'Page'}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
