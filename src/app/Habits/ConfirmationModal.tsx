import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-400',
          button: 'bg-red-600 hover:bg-red-500 text-white',
          border: 'border-red-500/20'
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          button: 'bg-yellow-600 hover:bg-yellow-500 text-white',
          border: 'border-yellow-500/20'
        };
      case 'info':
        return {
          icon: 'text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-500 text-white',
          border: 'border-blue-500/20'
        };
      default:
        return {
          icon: 'text-red-400',
          button: 'bg-red-600 hover:bg-red-500 text-white',
          border: 'border-red-500/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-neutral-700">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
          type='button'
          title='Close'
            onClick={onClose}
            className="ml-auto p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <p className="text-neutral-300 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 ${styles.button} rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
