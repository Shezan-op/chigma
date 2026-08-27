import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { ProjectSnapshot } from '../../models/document';
import { History, Plus, RotateCcw, Trash2, Calendar, Layers, X, Sparkles } from 'lucide-react';

interface SnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnapshotsModal: React.FC<SnapshotsModalProps> = ({ isOpen, onClose }) => {
  const document = useDocumentStore((s) => s.document);
  const setDocument = useDocumentStore((s) => s.setDocument);
  const updateDocument = useDocumentStore((s) => s.updateDocument);

  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen || !document) return null;

  const snapshots: ProjectSnapshot[] = document.snapshots || [];

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;

    // Deep clone current document state without snapshots to avoid circular bloat
    const { snapshots: _s, ...stateToSave } = document;

    const newSnapshot: ProjectSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: snapshotName.trim(),
      timestamp: Date.now(),
      description: description.trim() || 'Manual design checkpoint',
      documentState: JSON.parse(JSON.stringify(stateToSave))
    };

    updateDocument({
      snapshots: [newSnapshot, ...snapshots]
    });

    setSnapshotName('');
    setDescription('');
  };

  const handleRestore = (snapshot: ProjectSnapshot) => {
    if (!window.confirm(`Restore checkpoint "${snapshot.name}"? Current unsaved modifications will be reverted.`)) {
      return;
    }

    const restoredDoc = {
      ...snapshot.documentState,
      snapshots: document.snapshots // Preserve existing snapshots list
    };

    setDocument(restoredDoc);
    onClose();
  };

  const handleDelete = (id: string) => {
    updateDocument({
      snapshots: snapshots.filter((s) => s.id !== id)
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
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Version History & Snapshots</h2>
              <p className="text-xs text-zinc-500">
                Save named project milestones and safely restore checkpoints at any time
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

        {/* Create Snapshot Form */}
        <form onSubmit={handleCreateSnapshot} className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Checkpoint Name
              </label>
              <input
                type="text"
                placeholder="e.g. Before Redesign, V1 Client Review"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Description / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Clean wireframes before applying high-res colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Checkpoint
            </button>
          </div>
        </form>

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {snapshots.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-60 text-blue-400" />
              <p className="text-xs font-medium">No named snapshots saved yet.</p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Create a milestone snapshot before making experimental design modifications.
              </p>
            </div>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{snap.name}</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(snap.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {snap.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{snap.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
                    <Layers className="w-3 h-3" />
                    <span>{snap.documentState?.pages?.length || 1} Pages</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRestore(snap)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(snap.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    title="Delete snapshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
