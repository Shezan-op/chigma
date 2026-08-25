import React from 'react';
import type { ChigmaNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { ButtonVariant, BadgeVariant } from '../../models/wireframes';

interface WireframeSectionProps {
  node: ChigmaNode;
}

export const WireframeSection: React.FC<WireframeSectionProps> = ({ node }) => {
  const updateNode = useDocumentStore((s) => s.updateNode);

  const handleUpdate = (props: any) => {
    updateNode(node.id, props, true, 'Update component');
  };

  switch (node.type) {
    case 'button':
      return (
        <div className="property-group">
          <div className="property-group-title">Button Options</div>
          <div className="property-field full">
            <label>Label</label>
            <input
              type="text"
              value={node.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Variant</label>
            <select
              value={node.variant || 'primary'}
              onChange={(e) => handleUpdate({ variant: e.target.value as ButtonVariant })}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="danger">Danger</option>
            </select>
          </div>
        </div>
      );

    case 'input':
    case 'textarea':
      return (
        <div className="property-group">
          <div className="property-group-title">Field Options</div>
          <div className="property-field full">
            <label>Label</label>
            <input
              type="text"
              value={node.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Placeholder</label>
            <input
              type="text"
              value={node.placeholder || ''}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Value</label>
            <input
              type="text"
              value={node.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
            />
          </div>
        </div>
      );

    case 'checkbox':
    case 'radio':
    case 'toggle':
      return (
        <div className="property-group">
          <div className="property-group-title">Toggle Options</div>
          <div className="property-field full">
            <label>Label</label>
            <input
              type="text"
              value={node.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />
          </div>
          <div className="property-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={node.checked}
                onChange={(e) => handleUpdate({ checked: e.target.checked })}
              />
              Checked / Active
            </label>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="property-group">
          <div className="property-group-title">Card Options</div>
          <div className="property-field full">
            <label>Title</label>
            <input
              type="text"
              value={node.title || ''}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Subtitle</label>
            <input
              type="text"
              value={node.subtitle || ''}
              onChange={(e) => handleUpdate({ subtitle: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Content</label>
            <textarea
              className="property-textarea"
              value={node.content || ''}
              onChange={(e) => handleUpdate({ content: e.target.value })}
              rows={2}
            />
          </div>
          <div className="property-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={node.hasImage}
                onChange={(e) => handleUpdate({ hasImage: e.target.checked })}
              />
              Image Header
            </label>
          </div>
          <div className="property-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={node.showFooter}
                onChange={(e) => handleUpdate({ showFooter: e.target.checked })}
              />
              Footer Link
            </label>
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className="property-group">
          <div className="property-group-title">Badge Options</div>
          <div className="property-field full">
            <label>Label</label>
            <input
              type="text"
              value={node.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Variant</label>
            <select
              value={node.variant || 'default'}
              onChange={(e) => handleUpdate({ variant: e.target.value as BadgeVariant })}
            >
              <option value="default">Default</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      );

    case 'progress':
    case 'slider':
      return (
        <div className="property-group">
          <div className="property-group-title">Value Options</div>
          <div className="property-field full">
            <label>Value (0 - 100)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={node.value || 0}
              onChange={(e) => handleUpdate({ value: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })}
            />
          </div>
        </div>
      );

    case 'navbar':
      return (
        <div className="property-group">
          <div className="property-group-title">Navbar Options</div>
          <div className="property-field full">
            <label>Brand Name</label>
            <input
              type="text"
              value={node.brandName || ''}
              onChange={(e) => handleUpdate({ brandName: e.target.value })}
            />
          </div>
        </div>
      );

    case 'modal':
      return (
        <div className="property-group">
          <div className="property-group-title">Dialog Options</div>
          <div className="property-field full">
            <label>Title</label>
            <input
              type="text"
              value={node.title || ''}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div className="property-field full">
            <label>Message</label>
            <textarea
              className="property-textarea"
              value={node.message || ''}
              onChange={(e) => handleUpdate({ message: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
