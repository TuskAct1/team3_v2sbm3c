// src/components/NoticeDelete.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './NoticeCreate.css'; // ✅ 등록/수정 폼과 동일한 스타일 사용

function NoticeDelete() {
  const { noticeno } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  // 📦 공지 상세 불러오기
  useEffect(() => {
    axios.get(`http://localhost:9093/notice/read/${noticeno}`)
      .then(res => setNotice(res.data))
      .catch(err => console.error('❌ 공지 불러오기 실패', err));
  }, [noticeno]);

  // 🗑️ 삭제 처리
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9093/notice/delete/${noticeno}`);
      alert('🗑️ 삭제 완료!');
      navigate('/notice/list');
    } catch (err) {
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div className="notice-page-bg"> {/* ✅ 연한 연두 배경 */}
      <div className="read-header">
        <h2>🗑️ 공지사항 삭제</h2>

        <div className="notice-action-buttons">
          <button className="small-btn" onClick={() => navigate(`/notice/create`)}>등록</button>
          <button className="small-btn" onClick={() => navigate(`/notice/update/${noticeno}`)}>수정</button>
          <button className="small-btn" onClick={() => navigate('/notice/list')}>목록</button>
        </div>
      </div>

      {notice ? (
        <div className="notice-delete-box">
          <p><strong>제목:</strong> {notice.title}</p>
          <p><strong>내용:</strong> {notice.content}</p>
          <p className="notice-delete-warning">⚠️ 정말로 삭제하시겠습니까?</p>
          <div className="notice-delete-buttons">
            <button className="delete-btn" onClick={handleDelete}>삭제하기</button>
            <button className="cancel-btn" onClick={() => navigate('/notice/list')}>돌아가기</button>
          </div>
        </div>
      ) : (
        <p className="empty-message">📦 공지를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default NoticeDelete;
