import React, { useMemo } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useEditorStore } from '../../store/useEditorStore';
import { auditPageAccessibility } from '../../engine/quality/accessibilityChecker';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, X, ExternalLink } from 'lucide-react';

interface AccessibilityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityAuditModal: React.FC<AccessibilityAuditModalProps> = ({ isOpen, onClose }) => {
  const activePage = useDocumentStore((s) => s.getActivePage());
  const selectNode = useEditorStore((s) => s.selectNode);

  const issues = useMemo(() => {
    return activePage ? auditPageAccessibility(activePage) : [];
  }, [activePage]);

  if (!isOpen) return null;

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const score = Math.max(0, Math.round(100 - (criticalCount * 15 + warningCount * 5)));

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
          width: '640px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#0066FF" />
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#000000' }}>
                Accessibility &amp; Contrast Inspector
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#737373' }}>
                WCAG 2.1 AA/AAA compliance audit for touch targets, contrast, and typography.
              </p>
            </div>
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

        {/* Score Summary Banner */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: score >= 85 ? '#ECFDF5' : score >= 60 ? '#FFFBEB' : '#FEF2F2',
            borderBottom: '1px solid #E6E6E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: score >= 85 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626'
              }}
            >
              {score}%
            </span>
            <div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: score >= 85 ? '#065F46' : score >= 60 ? '#92400E' : '#991B1B'
                }}
              >
                {score >= 85 ? 'Excellent Accessibility' : score >= 60 ? 'Needs Attention' : 'High Risk Issues'}
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>
                {issues.length === 0
                  ? 'All elements meet WCAG touch target and contrast standards.'
                  : `${criticalCount} critical issue(s) and ${warningCount} warning(s) found.`}
              </p>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div
          style={{
            padding: '16px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1
          }}
        >
          {issues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#059669' }}>
              <CheckCircle size={36} style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Zero Accessibility Issues Found</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6B7280' }}>
                Your wireframes and layouts are compliant with touch target and color contrast guidelines.
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: issue.severity === 'critical' ? '#FECACA' : '#FDE68A',
                  backgroundColor: issue.severity === 'critical' ? '#FEF2F2' : '#FFFBEB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {issue.severity === 'critical' ? (
                      <AlertCircle size={15} color="#DC2626" />
                    ) : (
                      <AlertTriangle size={15} color="#D97706" />
                    )}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#18181B' }}>
                      {issue.nodeName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      selectNode(issue.nodeId);
                      onClose();
                    }}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      color: '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ExternalLink size={11} />
                    Inspect on Canvas
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: '12px', color: '#374151' }}>{issue.message}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>
                  💡 Tip: {issue.suggestion}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
