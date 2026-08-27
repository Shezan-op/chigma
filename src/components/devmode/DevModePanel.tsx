import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import {
  generateReactTailwindCode,
  generateNextJsCode,
  generateCssCode,
  type ExportFramework
} from '../../engine/export/exportMultiFramework';
import {
  Code,
  Copy,
  Check,
  Cpu
} from 'lucide-react';

export const DevModePanel: React.FC = () => {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const activePageId = useDocumentStore((s) => s.activePageId);
  const document = useDocumentStore((s) => s.document);

  const [framework, setFramework] = useState<ExportFramework>('react_tailwind');
  const [copied, setCopied] = useState(false);

  const activePage = document?.pages.find((p) => p.id === activePageId) || document?.pages[0];
  const selectedNode = activePage?.children.find((n) => n.id === selectedIds[0]);

  if (!selectedNode) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--chigma-text-tertiary)' }}>
        <Code size={32} style={{ margin: '0 auto 12px auto', color: 'var(--chigma-accent)', opacity: 0.7 }} />
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--chigma-text-primary)', marginBottom: 4 }}>
          Dev Mode &amp; Code Handoff
        </h3>
        <p style={{ fontSize: 11, lineHeight: 1.4, maxWidth: 220, margin: '0 auto' }}>
          Select any element or wireframe component on the canvas to inspect box-model metrics, design tokens, and copy production React / Tailwind / Next.js code.
        </p>
      </div>
    );
  }

  let codeOutput = '';
  if (framework === 'react_tailwind') {
    codeOutput = generateReactTailwindCode(selectedNode);
  } else if (framework === 'nextjs') {
    codeOutput = generateNextJsCode(selectedNode);
  } else {
    codeOutput = generateCssCode(selectedNode);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const cornerRadiusVal =
    typeof selectedNode.cornerRadius === 'object' && selectedNode.cornerRadius !== null
      ? `${selectedNode.cornerRadius.topLeft}px ${selectedNode.cornerRadius.topRight}px ${selectedNode.cornerRadius.bottomRight}px ${selectedNode.cornerRadius.bottomLeft}px`
      : `${selectedNode.cornerRadius || 0}px`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
      {/* Dev Mode Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--chigma-hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Cpu size={15} color="var(--chigma-accent)" />
          <span style={{ fontWeight: 700, color: 'var(--chigma-text-primary)' }}>Dev &amp; Handoff</span>
        </div>
        <span style={{ fontSize: 10, fontFamily: 'var(--chigma-font-mono)', padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--chigma-accent-subtle)', color: 'var(--chigma-accent)', fontWeight: 600 }}>
          {selectedNode.type}
        </span>
      </div>

      {/* Box Model & Layout Specs */}
      <div className="inspector-section">
        <span className="section-label">BOX MODEL &amp; GEOMETRY</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ padding: '6px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
            <span style={{ fontSize: 9, color: 'var(--chigma-text-tertiary)', display: 'block', fontWeight: 600 }}>WIDTH</span>
            <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 700 }}>{Math.round(selectedNode.width)}px</span>
          </div>
          <div style={{ padding: '6px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
            <span style={{ fontSize: 9, color: 'var(--chigma-text-tertiary)', display: 'block', fontWeight: 600 }}>HEIGHT</span>
            <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 700 }}>{Math.round(selectedNode.height)}px</span>
          </div>
          <div style={{ padding: '6px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
            <span style={{ fontSize: 9, color: 'var(--chigma-text-tertiary)', display: 'block', fontWeight: 600 }}>POSITION</span>
            <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 700 }}>X:{Math.round(selectedNode.x)} Y:{Math.round(selectedNode.y)}</span>
          </div>
          <div style={{ padding: '6px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
            <span style={{ fontSize: 9, color: 'var(--chigma-text-tertiary)', display: 'block', fontWeight: 600 }}>RADIUS</span>
            <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 700 }}>{cornerRadiusVal}</span>
          </div>
        </div>
      </div>

      {/* Styling & CSS Variables View */}
      <div className="inspector-section">
        <span className="section-label">CSS TOKENS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
            <span style={{ color: 'var(--chigma-text-tertiary)', fontFamily: 'var(--chigma-font-mono)', fontSize: 11 }}>background</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, border: '1px solid var(--chigma-hairline)', backgroundColor: selectedNode.fill || '#FFFFFF' }} />
              <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 600, color: 'var(--chigma-accent)' }}>
                {selectedNode.fill || '#FFFFFF'}
              </span>
            </div>
          </div>
          {selectedNode.stroke && selectedNode.stroke !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', backgroundColor: 'var(--chigma-surface-soft)', border: '1px solid var(--chigma-hairline)', borderRadius: 6 }}>
              <span style={{ color: 'var(--chigma-text-tertiary)', fontFamily: 'var(--chigma-font-mono)', fontSize: 11 }}>border-color</span>
              <span style={{ fontFamily: 'var(--chigma-font-mono)', fontWeight: 600 }}>{selectedNode.stroke}</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Generation Section */}
      <div className="inspector-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="section-label">CODE EXPORT</span>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as ExportFramework)}
            className="prop-select"
            style={{ fontSize: 11, padding: '2px 6px' }}
          >
            <option value="react_tailwind">React + Tailwind</option>
            <option value="nextjs">Next.js Component</option>
            <option value="html">CSS Stylesheet</option>
          </select>
        </div>

        {/* Code Snippet Box */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          borderRadius: 8,
          padding: 10,
          fontFamily: 'var(--chigma-font-mono)',
          fontSize: 10.5,
          position: 'relative',
          border: '1px solid #1E293B',
          maxHeight: 220,
          overflow: 'auto'
        }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copied ? (
              <>
                <Check size={11} color="#34D399" /> <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={11} /> <span>Copy</span>
              </>
            )}
          </button>
          <pre style={{ paddingTop: 20, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{codeOutput}</pre>
        </div>
      </div>
    </div>
  );
};
