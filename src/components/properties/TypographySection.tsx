import React from 'react';
import type { TextNode } from '../../models/node';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { FontWeight } from '../../models/styles';
import { AlignLeft, AlignCenter, AlignRight, Italic, Bold } from 'lucide-react';

interface TypographySectionProps {
  node: TextNode;
}

export const TypographySection: React.FC<TypographySectionProps> = ({ node }) => {
  const updateNode = useDocumentStore((s) => s.updateNode);

  const handleUpdate = (props: Partial<TextNode>) => {
    updateNode(node.id, props, true, 'Change typography');
  };

  return (
    <div className="property-group">
      <div className="property-group-title">Typography</div>

      {/* Font Family (Inter locked) */}
      <div className="property-field full">
        <label>Font Family</label>
        <input type="text" value="Inter (Default)" disabled style={{ opacity: 0.7 }} />
      </div>

      {/* Text Content */}
      <div className="property-field full">
        <label>Text Content</label>
        <textarea
          className="property-textarea"
          value={node.text || ''}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          rows={2}
        />
      </div>

      {/* Font Size & Weight */}
      <div className="property-grid-2">
        <div className="property-field">
          <label>Size (px)</label>
          <input
            type="number"
            min={8}
            max={144}
            value={node.fontSize || 16}
            onChange={(e) => handleUpdate({ fontSize: Math.max(8, parseFloat(e.target.value) || 16) })}
          />
        </div>
        <div className="property-field">
          <label>Weight</label>
          <select
            value={node.fontWeight || 400}
            onChange={(e) => handleUpdate({ fontWeight: parseInt(e.target.value, 10) as FontWeight })}
          >
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>Semi-Bold (600)</option>
            <option value={700}>Bold (700)</option>
          </select>
        </div>
      </div>

      {/* Formatting & Alignment */}
      <div className="property-field full">
        <label>Alignment &amp; Style</label>
        <div className="btn-row">
          <div className="btn-group">
            <button
              className={`btn-icon sm ${(node.textAlign || 'left') === 'left' ? 'active' : ''}`}
              onClick={() => handleUpdate({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              className={`btn-icon sm ${node.textAlign === 'center' ? 'active' : ''}`}
              onClick={() => handleUpdate({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              className={`btn-icon sm ${node.textAlign === 'right' ? 'active' : ''}`}
              onClick={() => handleUpdate({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
          </div>

          <div className="btn-group">
            <button
              className={`btn-icon sm ${node.fontWeight === 700 ? 'active' : ''}`}
              onClick={() => handleUpdate({ fontWeight: node.fontWeight === 700 ? 400 : 700 })}
              title="Toggle Bold"
            >
              <Bold size={14} />
            </button>
            <button
              className={`btn-icon sm ${node.fontStyle === 'italic' ? 'active' : ''}`}
              onClick={() => handleUpdate({ fontStyle: node.fontStyle === 'italic' ? 'normal' : 'italic' })}
              title="Toggle Italic"
            >
              <Italic size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="property-grid-2">
        <div className="property-field">
          <label>Line Height</label>
          <input
            type="number"
            step={0.1}
            min={0.8}
            max={3}
            value={node.lineHeight || 1.2}
            onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) || 1.2 })}
          />
        </div>
        <div className="property-field">
          <label>Spacing (px)</label>
          <input
            type="number"
            step={0.5}
            min={-5}
            max={20}
            value={node.letterSpacing || 0}
            onChange={(e) => handleUpdate({ letterSpacing: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Color */}
      <div className="property-field full">
        <label>Text Color</label>
        <div className="color-picker-row">
          <input
            type="color"
            className="color-swatch-input"
            value={node.fill || '#18181B'}
            onChange={(e) => handleUpdate({ fill: e.target.value })}
          />
          <input
            type="text"
            className="color-hex-input"
            value={node.fill || '#18181B'}
            onChange={(e) => handleUpdate({ fill: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
