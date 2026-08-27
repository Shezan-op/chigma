import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { runDesignLinter, type LintIssue } from '../../engine/quality/designLinter';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Sparkles,
  Wand2,
  ExternalLink
} from 'lucide-react';

interface DesignLinterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignLinterModal: React.FC<DesignLinterModalProps> = ({ isOpen, onClose }) => {
  const document = useDocumentStore((s) => s.document);
  const activePageId = useDocumentStore((s) => s.activePageId);
  const updateNode = useDocumentStore((s) => s.updateNode);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);

  const [activeCategory, setActiveCategory] = useState<'all' | 'spacing' | 'tokens' | 'accessibility' | 'consistency'>('all');

  const activePage = document?.pages.find((p) => p.id === activePageId) || document?.pages[0];
  const report = document && activePage ? runDesignLinter(document, activePage) : null;

  if (!isOpen || !report) return null;

  const filteredIssues = report.issues.filter((issue) =>
    activeCategory === 'all' ? true : issue.category === activeCategory
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500';
    if (score >= 70) return 'text-amber-500 border-amber-500';
    return 'text-rose-600 dark:text-rose-400 border-rose-500';
  };

  const handleFix = (issue: LintIssue) => {
    if (!issue.nodeId) return;

    if (issue.actionType === 'normalize_spacing') {
      const node = activePage?.children.find((n) => n.id === issue.nodeId);
      if (node) {
        updateNode(node.id, {
          x: Math.round(node.x / 8) * 8,
          y: Math.round(node.y / 8) * 8
        });
      }
    } else if (issue.actionType === 'resize_target') {
      const node = activePage?.children.find((n) => n.id === issue.nodeId);
      if (node) {
        updateNode(node.id, {
          width: Math.max(44, node.width),
          height: Math.max(44, node.height)
        });
      }
    }
  };

  const handleFixAllSpacing = () => {
    if (!activePage) return;
    activePage.children.forEach((node) => {
      updateNode(node.id, {
        x: Math.round(node.x / 8) * 8,
        y: Math.round(node.y / 8) * 8
      });
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Design Health & Quality Inspector
              </h2>
              <p className="text-xs text-zinc-500">
                Automated audits for spacing, design tokens, accessibility, and consistency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Score Overview Cards */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-6">
          {/* Main Score Circle */}
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(
                report.score
              )}`}
            >
              <span className="text-xl font-black">{report.score}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Score</span>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {report.score >= 90
                  ? 'Excellent Design Health'
                  : report.score >= 70
                  ? 'Good — Needs Minor Refinements'
                  : 'Needs Attention'}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {report.totalIssues} total issues detected ({report.errorCount} critical, {report.warningCount} warnings)
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="flex-1 grid grid-cols-4 gap-2 text-center pl-6 border-l border-zinc-200 dark:border-zinc-800">
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Spacing</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                {report.categoryScores.spacing}%
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tokens</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                {report.categoryScores.tokens}%
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">A11y</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                {report.categoryScores.accessibility}%
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Consistency</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                {report.categoryScores.consistency}%
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Quick Action */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex gap-1">
            {(['all', 'spacing', 'tokens', 'accessibility', 'consistency'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleFixAllSpacing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto-Align Spacing (8px)
          </button>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredIssues.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">All checks passed!</h3>
              <p className="text-xs text-zinc-400 mt-1">No issues detected in this category.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm"
              >
                <div className="mt-0.5">
                  {issue.severity === 'error' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{issue.title}</span>
                    {issue.nodeName && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded">
                        {issue.nodeName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{issue.message}</p>
                  {issue.suggestedFix && (
                    <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Suggested: {issue.suggestedFix}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {issue.nodeId && (
                    <button
                      onClick={() => {
                        setSelectedIds([issue.nodeId!]);
                        onClose();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="Select on canvas"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  {issue.actionType && (
                    <button
                      onClick={() => handleFix(issue)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition"
                    >
                      Fix
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Active Page: {activePage.name}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
