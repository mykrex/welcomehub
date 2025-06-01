import React from 'react';
import './TimeCard.css';

interface ModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

//This makes the message of error AND confirmation
const Modal: React.FC<ModalProps> = ({ title, message, confirmText = 'OK', cancelText, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {cancelText && <button className="modal-button cancel" onClick={onCancel}>{cancelText}</button>}
          <button className="modal-button confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
