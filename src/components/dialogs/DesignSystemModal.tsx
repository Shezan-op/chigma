import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { DesignVariable, VariableCollection, ReusableStyle } from '../../models/document';
import { Palette, Sun, Moon, Plus, Trash2, Copy, Check, X, Code } from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const document = useDocumentStore((s) => s.document);
  const updateDocument = useDocumentStore((s) => s.updateDocument);

  const [activeTab, setActiveTab] = useState<'variables' | 'styles' | 'tokens_export'>('variables');
  const [copiedTokens, setCopiedTokens] = useState(false);

  if (!isOpen) return null;

  const collections: VariableCollection[] = document.variableCollections || [];
  const styles: ReusableStyle[] = document.styles || [];
  const activeMode = document.activeModeId || 'light';

  const handleToggleMode = (mode: 'light' | 'dark') => {
    updateDocument({ activeModeId: mode });
  };

  const handleUpdateVariable = (collectionId: string, varId: string, updates: Partial<DesignVariable>) => {
    const updatedCollections = collections.map((col) => {
      if (col.id !== collectionId) return col;
      return {
        ...col,
        variables: col.variables.map((v) => (v.id === varId ? { ...v, ...updates } : v))
      };
    });
    updateDocument({ variableCollections: updatedCollections });
  };

  const handleAddVariable = (collectionId: string) => {
    const updatedCollections = collections.map((col) => {
      if (col.id !== collectionId) return col;
      const newVar: DesignVariable = {
        id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: 'custom/token',
        type: col.id.includes('spacing') ? 'number' : 'color',
        value: col.id.includes('spacing') ? 16 : '#0066FF',
        valuesByMode: {
          light: col.id.includes('spacing') ? 16 : '#0066FF',
          dark: col.id.includes('spacing') ? 16 : '#3B82F6'
        }
      };
      return {
        ...col,
        variables: [...col.variables, newVar]
      };
    });
    updateDocument({ variableCollections: updatedCollections });
  };

  const handleDeleteVariable = (collectionId: string, varId: string) => {
    const updatedCollections = collections.map((col) => {
      if (col.id !== collectionId) return col;
      return {
        ...col,
        variables: col.variables.filter((v) => v.id !== varId)
      };
    });
    updateDocument({ variableCollections: updatedCollections });
  };

  // Generate CSS Variables
  const generateCssVariables = (): string => {
    let css = ':root {\n';
    collections.forEach((col) => {
      css += `  /* ${col.name} */\n`;
      col.variables.forEach((v) => {
        const varName = `--${v.name.replace(/[\/\s]/g, '-')}`;
        const val = v.type === 'number' ? `${v.value}px` : v.value;
        css += `  ${varName}: ${val};\n`;
      });
    });
    css += '}\n\n[data-theme="dark"] {\n';
    collections.forEach((col) => {
      col.variables.forEach((v) => {
        if (v.valuesByMode?.dark) {
          const varName = `--${v.name.replace(/[\/\s]/g, '-')}`;
          const val = v.type === 'number' ? `${v.valuesByMode.dark}px` : v.valuesByMode.dark;
          css += `  ${varName}: ${val};\n`;
        }
      });
    });
    css += '}';
    return css;
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(generateCssVariables());
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
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
          width: '740px',
          maxHeight: '82vh',
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
            <Palette size={20} color="#000000" />
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#000000' }}>
                Design System & Tokens
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#737373' }}>
                Manage design variables, multi-mode palettes (Light/Dark), and typography styles.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#F7F7F5',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid #E6E6E6'
              }}
            >
              <button
                onClick={() => handleToggleMode('light')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeMode === 'light' ? '#FFFFFF' : 'transparent',
                  color: activeMode === 'light' ? '#000000' : '#737373',
                  fontWeight: activeMode === 'light' ? 600 : 400,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: activeMode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Sun size={12} />
                Light
              </button>
              <button
                onClick={() => handleToggleMode('dark')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeMode === 'dark' ? '#000000' : 'transparent',
                  color: activeMode === 'dark' ? '#FFFFFF' : '#737373',
                  fontWeight: activeMode === 'dark' ? 600 : 400,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: activeMode === 'dark' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <Moon size={12} />
                Dark
              </button>
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
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E6E6E6',
            backgroundColor: '#FCFCFB',
            padding: '0 20px'
          }}
        >
          <button
            onClick={() => setActiveTab('variables')}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: activeTab === 'variables' ? 600 : 500,
              color: activeTab === 'variables' ? '#000000' : '#737373',
              borderBottom: activeTab === 'variables' ? '2px solid #000000' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Design Variables
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: activeTab === 'styles' ? 600 : 500,
              color: activeTab === 'styles' ? '#000000' : '#737373',
              borderBottom: activeTab === 'styles' ? '2px solid #000000' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reusable Styles
          </button>
          <button
            onClick={() => setActiveTab('tokens_export')}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: activeTab === 'tokens_export' ? 600 : 500,
              color: activeTab === 'tokens_export' ? '#000000' : '#737373',
              borderBottom: activeTab === 'tokens_export' ? '2px solid #000000' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Code size={13} />
            Export CSS Tokens
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'variables' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {collections.map((col) => (
                <div
                  key={col.id}
                  style={{
                    border: '1px solid #E6E6E6',
                    borderRadius: '10px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#000000' }}>
                      {col.name}
                    </h3>
                    <button
                      onClick={() => handleAddVariable(col.id)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '4px',
                        border: '1px solid #E6E6E6',
                        backgroundColor: '#F7F7F5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} />
                      Add Token
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {col.variables.map((v) => {
                      const displayVal =
                        v.valuesByMode && v.valuesByMode[activeMode] !== undefined
                          ? v.valuesByMode[activeMode]
                          : v.value;

                      return (
                        <div
                          key={v.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#FCFCFB',
                            border: '1px solid #F0F0F0'
                          }}
                        >
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => handleUpdateVariable(col.id, v.id, { name: e.target.value })}
                            style={{
                              flex: 1,
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              padding: '4px 6px',
                              border: '1px solid #E6E6E6',
                              borderRadius: '4px'
                            }}
                          />

                          {v.type === 'color' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="color"
                                value={displayVal}
                                onChange={(e) => {
                                  const updatedModes = { ...(v.valuesByMode || {}), [activeMode]: e.target.value };
                                  handleUpdateVariable(col.id, v.id, {
                                    value: e.target.value,
                                    valuesByMode: updatedModes
                                  });
                                }}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  padding: 0,
                                  border: '1px solid #D4D4D8',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#525252' }}>
                                {displayVal}
                              </span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="number"
                                value={displayVal}
                                onChange={(e) => {
                                  const num = parseInt(e.target.value, 10) || 0;
                                  const updatedModes = { ...(v.valuesByMode || {}), [activeMode]: num };
                                  handleUpdateVariable(col.id, v.id, {
                                    value: num,
                                    valuesByMode: updatedModes
                                  });
                                }}
                                style={{
                                  width: '64px',
                                  fontSize: '12px',
                                  padding: '4px 6px',
                                  border: '1px solid #E6E6E6',
                                  borderRadius: '4px'
                                }}
                              />
                              <span style={{ fontSize: '11px', color: '#737373' }}>px</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleDeleteVariable(col.id, v.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#EF4444',
                              padding: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'styles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {styles.map((style) => (
                <div
                  key={style.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #E6E6E6',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#000000' }}>
                      {style.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#737373' }}>Type: {style.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#F7F7F5',
                        color: '#525252',
                        fontFamily: 'monospace'
                      }}
                    >
                      {JSON.stringify(style.style)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tokens_export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#525252' }}>
                  Copy standard CSS Custom Properties for your stylesheet:
                </span>
                <button
                  onClick={handleCopyCss}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid #000000',
                    backgroundColor: copiedTokens ? '#10B981' : '#000000',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedTokens ? <Check size={14} /> : <Copy size={14} />}
                  {copiedTokens ? 'Copied!' : 'Copy CSS Tokens'}
                </button>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#18181B',
                  color: '#A1A1AA',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '360px'
                }}
              >
                {generateCssVariables()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
