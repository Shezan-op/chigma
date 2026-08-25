import React, { useEffect, useRef } from 'react';
import type { TextNode } from '../../models/node';
import type { Viewport } from '../../engine/geometry/matrix';
import { useDocumentStore } from '../../store/useDocumentStore';
import { worldToScreen } from '../../engine/geometry/matrix';

interface TextEditorOverlayProps {
  node: TextNode;
  viewport: Viewport;
  onClose: () => void;
}

export const TextEditorOverlay: React.FC<TextEditorOverlayProps> = ({ node, viewport, onClose }) => {
  const updateNode = useDocumentStore((s) => s.updateNode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const screenPos = worldToScreen({ x: node.x, y: node.y }, viewport);
  const screenWidth = node.width * viewport.zoom;
  const screenHeight = node.height * viewport.zoom;
  const screenFontSize = (node.fontSize || 16) * viewport.zoom;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { text: e.target.value }, false);
  };

  const handleBlur = () => {
    updateNode(node.id, { text: node.text }, true, 'Edit text');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="chigma-text-editor-overlay"
      style={{
        position: 'absolute',
        left: screenPos.x,
        top: screenPos.y,
        width: Math.max(120, screenWidth),
        minHeight: screenHeight,
        zIndex: 50
      }}
    >
      <textarea
        ref={textareaRef}
        value={node.text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          height: '100%',
          fontSize: `${screenFontSize}px`,
          fontWeight: node.fontWeight || 400,
          fontStyle: node.fontStyle || 'normal',
          color: node.fill || '#18181B',
          textAlign: node.textAlign || 'left',
          lineHeight: node.lineHeight || 1.2,
          fontFamily: 'Inter, sans-serif',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #3B82F6',
          borderRadius: '4px',
          outline: 'none',
          resize: 'both',
          padding: '2px 4px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
};
