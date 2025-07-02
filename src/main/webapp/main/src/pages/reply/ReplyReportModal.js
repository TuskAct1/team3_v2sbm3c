import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReplyReportModal({ replyno, show, onClose, onReportSuccess }) {
  const [reason, setReason] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [canReport, setCanReport] = useState(null); // null: 확인 전

  useEffect(() => {
    if (show && replyno) {
      // 신고 여부 확인
      axios.post('/replyReport/check', { replyno }, { withCredentials: true })
        .then((res) => {
          const result = res.data;
          if (result === -1) {
            setResultMsg('로그인이 필요합니다.');
            setCanReport(false);
          } else if (result === 0) {
            setResultMsg('이미 신고한 댓글입니다.');
            setCanReport(false);
          } else if (result === 1) {
            setCanReport(true); // 신고 가능
          } else {
            setResultMsg('알 수 없는 응답입니다.');
            setCanReport(false);
          }
        })
        .catch((err) => {
          console.error('신고 확인 오류:', err);
          setResultMsg('신고 확인 중 오류 발생');
          setCanReport(false);
        });
    }
  }, [show, replyno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/replyReport/report', { replyno, reason }, { withCredentials: true });
      if (res.data === 1) {
        setResultMsg('신고가 접수되었습니다.');
        if (onReportSuccess) onReportSuccess();
        setCanReport(false);
      } else {
        setResultMsg('신고 처리 오류');
      }
    } catch (err) {
      console.error('신고 제출 오류:', err);
      setResultMsg('신고 중 오류 발생');
    }
  };

  const handleClose = () => {
    setReason('');
    setResultMsg('');
    setCanReport(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: 32, borderRadius: 12, minWidth: 340,
        boxShadow: '0 8px 24px rgba(0,0,0,0.16)'
      }}>
        <h3>댓글 신고</h3>

        {canReport === null ? (
          <div style={{ marginTop: 16 }}>확인 중...</div>
        ) : canReport === false ? (
          <div>
            <div style={{ margin: '16px 0', color: '#e03e3e' }}>{resultMsg}</div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={handleClose} style={{
                background: '#4662e1', color: '#fff', padding: '7px 20px',
                borderRadius: 6, border: 'none'
              }}>
                확인
              </button>
            </div>
          </div>
        ) : resultMsg ? (
          <div>
            <div style={{ margin: '16px 0', color: '#4662e1' }}>{resultMsg}</div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={handleClose} style={{
                background: '#4662e1', color: '#fff', padding: '7px 20px',
                borderRadius: 6, border: 'none'
              }}>
                확인
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              신고 사유<br />
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required
                rows={4} style={{ width: '100%', margin: '8px 0 20px 0', resize: 'none' }} />
            </label>
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={handleClose} style={{ marginRight: 12 }}>취소</button>
              <button type="submit" style={{
                background: '#f23d4b', color: '#fff', padding: '7px 20px',
                borderRadius: 6, border: 'none'
              }}>
                신고
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReplyReportModal;
