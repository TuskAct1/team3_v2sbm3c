import React, { useState } from 'react';
import axios from 'axios';

function BoardReportModal({ boardno, show, onClose, memberno}) {
  const [reason, setReason] = useState('');
  const [resultMsg, setResultMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      boardno,
      memberno,
      reason
    });

    try {
      await axios.post(`/boardReport/report/${boardno}`, {
        boardno: boardno,
        // memberno 추가
        memberno: memberno, 
        reason: reason
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  // 모달이 닫힐 때 state 초기화
  const handleClose = () => {
    setReason('');
    setResultMsg('');
    onClose();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 340, boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}>
        <h3>게시글 신고</h3>
        {resultMsg ? (
          <div style={{ margin: '16px 0', color: '#4662e1' }}>{resultMsg}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              신고 사유<br />
              <textarea value={reason} onChange={e => setReason(e.target.value)} required
                rows={4} style={{ width: '100%', margin: '8px 0 20px 0', resize: 'none' }} />
            </label>
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={handleClose} style={{ marginRight: 12 }}>취소</button>
              <button type="submit" style={{ background: '#f23d4b', color: '#fff', padding: '7px 20px', borderRadius: 6, border: 'none' }}>신고</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BoardReportModal;