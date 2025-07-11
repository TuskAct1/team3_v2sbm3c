// ✅ DeleteConfirmModal.js
import React from 'react';
import '../styles/MemberListPage.css';

function DeleteConfirmModal({ open, onClose, onConfirm, member }) {
  if (!open || !member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate">
        <h3>정말 삭제하시겠어요?</h3>
        <p>
          <strong>{member.id}</strong> 회원님의 정보를<br />
          삭제하면 복구할 수 없어요.
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>취소</button>
          <button className="delete-btn" onClick={() => onConfirm(member.memberno)}>삭제</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;