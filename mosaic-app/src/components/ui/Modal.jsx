import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = "", 
  closeOnOverlayClick = true,
  closeOnEscape = true 
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className={`bg-gray-800 rounded-lg border border-gray-600 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;