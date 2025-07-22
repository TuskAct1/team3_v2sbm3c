import React, { useState } from 'react';
import axios from 'axios';

function BoardReportModal({ boardno, show, onClose, onReported }) {
  const [reason, setReason] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg('');
    try {
      await axios.post(`/boardReport/report/${boardno}`, {
        reason: reason
      });
      setResultMsg("신고가 접수되었습니다.");
      if (onReported) onReported();
    } catch (error) {
      // 이미 신고한 경우
      if (error.response?.status === 400 && error.response.data === "이미 신고하셨습니다.") {
        setResultMsg("이미 신고하신 게시글입니다.");
      } else {
        setResultMsg("신고 처리 중 오류가 발생했습니다.");
      }
    }
    setLoading(false);
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
          <div style={{ margin: '16px 0', color: resultMsg.includes('이미') ? '#ea4335' : '#4662e1', fontWeight: 600 }}>
            {resultMsg}
            <div style={{ textAlign: 'right', marginTop: 18 }}>
              <button onClick={handleClose} style={{ padding: '7px 20px', borderRadius: 6, border: 'none', background: '#4662e1', color: '#fff' }}>닫기</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              신고 사유<br />
              <textarea value={reason} onChange={e => setReason(e.target.value)} required
                rows={4} style={{ width: '100%', margin: '8px 0 20px 0', resize: 'none' }} />
            </label>
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={handleClose} style={{ marginRight: 12 }}>취소</button>
              <button type="submit" disabled={loading} style={{ background: '#f23d4b', color: '#fff', padding: '7px 20px', borderRadius: 6, border: 'none' }}>
                {loading ? "신고중..." : "신고"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BoardReportModal;
