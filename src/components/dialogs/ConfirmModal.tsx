import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useProjectStore();

  if (!confirmModal || !confirmModal.isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeConfirmModal}>
      <div className="chigma-modal sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon danger">
            <AlertTriangle size={18} />
            <h3>{confirmModal.title}</h3>
          </div>
          <button className="btn-icon sm" onClick={closeConfirmModal}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">{confirmModal.message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={closeConfirmModal}>
            Cancel
          </button>
          <button className="btn-danger" onClick={confirmModal.onConfirm}>
            {confirmModal.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
