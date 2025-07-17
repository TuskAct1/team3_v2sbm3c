import React from "react";
import "./TermsModal.css";

const TermsModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <div className="terms-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="terms-modal-content">
          <pre>{content}</pre>
        </div>
        <button className="confirm-btn" onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default TermsModal;
