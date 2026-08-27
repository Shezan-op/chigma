import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { X, Trash2 } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useProjectStore();

  if (!confirmModal || !confirmModal.isOpen) return null;

  return (
    <div className="chigma-modal-backdrop" onClick={closeConfirmModal}>
      <div className="chigma-confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="confirm-modal-close-btn" onClick={closeConfirmModal}>
          <X size={15} />
        </button>

        <div className="confirm-modal-inner">
          {/* Left Glowing Red Circle with Trash Icon */}
          <div className="confirm-icon-glow-wrapper">
            <div className="confirm-icon-circle">
              <Trash2 size={22} className="confirm-trash-icon" />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="confirm-text-area">
            <h3 className="confirm-modal-title">{confirmModal.title}</h3>
            <p className="confirm-modal-desc">{confirmModal.message}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="confirm-modal-footer">
          <button className="confirm-btn cancel" onClick={closeConfirmModal}>
            Cancel
          </button>
          <button className="confirm-btn danger" onClick={confirmModal.onConfirm}>
            {confirmModal.confirmLabel || 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
};
