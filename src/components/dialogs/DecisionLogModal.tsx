import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { DecisionLogEntry } from '../../models/document';
import { FileText, Plus, Trash2, Calendar, User, Tag, X, Sparkles } from 'lucide-react';

interface DecisionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionLogModal: React.FC<DecisionLogModalProps> = ({ isOpen, onClose }) => {
  const document = useDocumentStore((s) => s.document);
  const updateDocument = useDocumentStore((s) => s.updateDocument);

  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [affectedAreas, setAffectedAreas] = useState('');
  const [author] = useState('Designer');

  if (!isOpen || !document) return null;

  const entries: DecisionLogEntry[] = document.decisionLog || [];

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    const newEntry: DecisionLogEntry = {
      id: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: Date.now(),
      decision: decision.trim(),
      reason: reason.trim() || 'Design refinement & consistency',
      affectedAreas: affectedAreas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      author: author.trim() || 'Designer'
    };

    updateDocument({
      decisionLog: [newEntry, ...entries]
    });

    setDecision('');
    setReason('');
    setAffectedAreas('');
  };

  const handleDelete = (id: string) => {
    updateDocument({
      decisionLog: entries.filter((e) => e.id !== id)
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Project Design Decision Log</h2>
              <p className="text-xs text-zinc-500">
                Track architectural rationales, design decisions, and AI context notes
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

        {/* Add Decision Form */}
        <form onSubmit={handleAddEntry} className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Design Decision
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile navigation collapses to bottom navigation bar"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Rationale / Context
              </label>
              <input
                type="text"
                placeholder="e.g. Primary actions must remain reachable with one thumb"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Affected Areas (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Navbar, Mobile Viewport, Sidebar"
                value={affectedAreas}
                onChange={(e) => setAffectedAreas(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Record Decision
            </button>
          </div>
        </form>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {entries.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-60 text-purple-400" />
              <p className="text-xs font-medium">No design decisions recorded yet.</p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Document your design intentions so human collaborators and AI understand the context.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{entry.decision}</div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{entry.reason}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    {entry.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {entry.author}
                      </span>
                    )}
                    {entry.affectedAreas && entry.affectedAreas.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="w-3 h-3 text-purple-400" />
                        {entry.affectedAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded text-[10px]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
