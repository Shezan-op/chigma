import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 300,
      pointerEvents: 'none'
    }}>
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${isSuccess ? '#A7F3D0' : isError ? '#FECACA' : isWarning ? '#FDE68A' : '#E0E7FF'}`,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#1F2937',
              animation: 'toastIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              minWidth: 260
            }}
          >
            {isSuccess && <CheckCircle2 size={16} color="#10B981" />}
            {isError && <AlertCircle size={16} color="#EF4444" />}
            {isWarning && <AlertTriangle size={16} color="#F59E0B" />}
            {!isSuccess && !isError && !isWarning && <Info size={16} color="#4F46E5" />}

            <span style={{ flex: 1 }}>{t.message}</span>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
