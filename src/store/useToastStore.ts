import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem['type'], durationMs?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', durationMs = 3000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }]
    }));

    if (durationMs > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, durationMs);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
