import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDocumentStore } from '../../store/useDocumentStore';
import { globalAiOrchestrator } from '../../engine/ai/aiOrchestrator';
import type { AIPlanStep, AIExecutionResult } from '../../engine/ai/aiProvider';
import {
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  X,
  Zap,
  Layout,
  Wand2,
  ShieldCheck
} from 'lucide-react';

export const AiAgentPanel: React.FC = () => {
  const isOpen = useEditorStore((s) => s.isAiPanelOpen);
  const setOpen = useEditorStore((s) => s.setAiPanelOpen);
  const document = useDocumentStore((s) => s.document);
  const activePageId = useDocumentStore((s) => s.activePageId);
  const addNode = useDocumentStore((s) => s.addNode);
  const setDocument = useDocumentStore((s) => s.setDocument);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);

  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<AIPlanStep[]>([]);
  const [lastResult, setLastResult] = useState<AIExecutionResult | null>(null);

  if (!isOpen) return null;

  const activePage = document?.pages.find((p) => p.id === activePageId) || document?.pages[0];

  const handleRunAi = async (promptText: string) => {
    if (!promptText.trim() || !document || !activePage) return;

    setIsProcessing(true);
    setCurrentPlan([]);
    setLastResult(null);

    try {
      const result = await globalAiOrchestrator.executeTask(promptText, document, activePage);
      setCurrentPlan(result.plan);
      setLastResult(result);

      // Auto-insert generated nodes if any
      if (result.createdNodes && result.createdNodes.length > 0) {
        result.createdNodes.forEach((node) => addNode(node));
        setSelectedIds(result.createdNodes.map((n) => n.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = () => {
    const prevSnapshot = globalAiOrchestrator.getLastTaskSnapshot();
    if (prevSnapshot) {
      setDocument(prevSnapshot);
      setLastResult(null);
      setCurrentPlan([]);
    }
  };

  const quickPrompts = [
    { label: 'SaaS Dashboard', icon: Layout, text: 'Create a modern SaaS analytics dashboard with sidebar, KPIs, charts, and table' },
    { label: 'Landing Page', icon: Sparkles, text: 'Create a high-converting landing page hero section with CTAs and feature cards' },
    { label: 'Align to 8px Grid', icon: Wand2, text: 'Normalize all element positions and spacing to 8px design tokens' },
    { label: 'Audit Accessibility', icon: ShieldCheck, text: 'Audit page for WCAG AA contrast and touch target sizing' }
  ];

  return (
    <aside className="w-84 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full z-20 animate-slideLeft shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Chigma AI Co-Designer</h3>
            <p className="text-[10px] text-zinc-400">Offline-first UI intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2">
          Quick Actions
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(qp.text);
                  handleRunAi(qp.text);
                }}
                disabled={isProcessing}
                className="p-2 text-left bg-white dark:bg-zinc-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl border border-zinc-200 dark:border-zinc-700/60 transition group text-[11px]"
              >
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <Icon className="w-3 h-3 text-zinc-400 group-hover:text-indigo-500" />
                  <span className="truncate">{qp.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan Execution & Results View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {isProcessing && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center space-y-2">
            <Zap className="w-5 h-5 text-indigo-500 animate-bounce mx-auto" />
            <p className="font-semibold text-indigo-950 dark:text-indigo-200">
              Planning & composing UI...
            </p>
          </div>
        )}

        {currentPlan.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
              Execution Plan
            </span>
            <div className="space-y-1.5">
              {currentPlan.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-2 p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {lastResult && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                Task Completed
              </span>
              <button
                onClick={handleRollback}
                className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Rollback
              </button>
            </div>
            <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-snug">
              {lastResult.message}
            </p>
            {lastResult.diffSummary && (
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                +{lastResult.diffSummary.createdCount} nodes created
              </div>
            )}
          </div>
        )}

        {!isProcessing && currentPlan.length === 0 && (
          <div className="py-12 text-center text-zinc-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
            <p className="font-medium text-xs">How can I assist your design?</p>
            <p className="text-[11px] text-zinc-400 max-w-[200px] mx-auto">
              Type an instruction or choose a quick action above to start.
            </p>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1.5 border border-zinc-200 dark:border-zinc-700 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Ask AI to design or refactor..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isProcessing) {
                handleRunAi(prompt);
              }
            }}
            className="flex-1 bg-transparent px-2 py-1 text-xs outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
          />
          <button
            onClick={() => handleRunAi(prompt)}
            disabled={isProcessing || !prompt.trim()}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
