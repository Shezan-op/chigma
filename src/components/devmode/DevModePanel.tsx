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
      <div className="p-6 text-center text-zinc-400 space-y-3">
        <Code className="w-8 h-8 mx-auto opacity-50 text-indigo-400" />
        <h3 className="text-sm font-bold text-zinc-300">Dev Mode / Handoff Inspector</h3>
        <p className="text-xs text-zinc-500">
          Select any element or frame on the canvas to inspect box-model metrics, CSS variables, and copy production React/Tailwind/Next.js code.
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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 text-xs overflow-y-auto">
      {/* Dev Mode Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Dev & Handoff Mode</span>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold">
          {selectedNode.type}
        </span>
      </div>

      {/* Box Model & Layout Specs */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
          Box Model & Geometry
        </span>
        <div className="grid grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <span className="text-zinc-400 block text-[9px]">WIDTH</span>
            <span className="font-bold">{Math.round(selectedNode.width)}px</span>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <span className="text-zinc-400 block text-[9px]">HEIGHT</span>
            <span className="font-bold">{Math.round(selectedNode.height)}px</span>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <span className="text-zinc-400 block text-[9px]">POSITION X, Y</span>
            <span className="font-bold">{Math.round(selectedNode.x)}, {Math.round(selectedNode.y)}</span>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <span className="text-zinc-400 block text-[9px]">BORDER RADIUS</span>
            <span className="font-bold">{cornerRadiusVal}</span>
          </div>
        </div>
      </div>

      {/* Styling & CSS Variables View */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
          CSS Variables & Tokens
        </span>
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between p-1.5 bg-zinc-50 dark:bg-zinc-800/40 rounded">
            <span className="text-zinc-400">background</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded border border-zinc-300 dark:border-zinc-700"
                style={{ backgroundColor: selectedNode.fill || '#FFFFFF' }}
              />
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {selectedNode.fill || '#FFFFFF'}
              </span>
            </div>
          </div>
          {selectedNode.stroke && (
            <div className="flex items-center justify-between p-1.5 bg-zinc-50 dark:bg-zinc-800/40 rounded">
              <span className="text-zinc-400">border-color</span>
              <span className="text-zinc-800 dark:text-zinc-200">{selectedNode.stroke}</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Generation Section */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Export Component Code
          </span>
          {/* Framework Switcher */}
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as ExportFramework)}
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer"
          >
            <option value="react_tailwind">React + Tailwind</option>
            <option value="nextjs">Next.js Component</option>
            <option value="html">CSS Stylesheet</option>
          </select>
        </div>

        {/* Code Snippet Box */}
        <div className="flex-1 min-h-[160px] bg-zinc-950 text-zinc-100 rounded-xl p-3 font-mono text-[11px] overflow-auto relative border border-zinc-800 shadow-inner">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold transition border border-zinc-700"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy Code
              </>
            )}
          </button>
          <pre className="pt-6">{codeOutput}</pre>
        </div>
      </div>
    </div>
  );
};
