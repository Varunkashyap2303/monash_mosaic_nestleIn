import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700",
  isDangerous = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const defaultConfirmClass = isDangerous 
    ? "bg-red-600 hover:bg-red-700" 
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="p-6 max-w-sm w-full mx-4"
    >
      <div className="delete-confirm-container">
        <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors touch-manipulation"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors touch-manipulation ${
              confirmButtonClass || defaultConfirmClass
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;