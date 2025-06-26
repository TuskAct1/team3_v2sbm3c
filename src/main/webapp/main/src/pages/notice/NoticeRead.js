// src/components/NoticeRead.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeRead.css';

function NoticeRead() {
  const { noticeno } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:9093/notice/read/${noticeno}`)
      .then(res => setNotice(res.data))
      .catch(err => console.error('❌ 공지사항 상세 불러오기 실패', err));
  }, [noticeno]);

  return (
    <div className="notice-page-bg">
    <div className="read-header">
      <h2>📌 공지사항 상세보기</h2>

      {/* 🔹 오른쪽 상단 버튼들 */}
      <div className="notice-action-buttons">
        <button className="small-btn" onClick={() => navigate(`/notice/create`)}>등록</button>
        <button className="small-btn" onClick={() => navigate(`/notice/update/${noticeno}`)}>수정</button>
        <button className="small-btn" onClick={() => navigate(`/notice/delete/${noticeno}`)}>삭제</button>
        <button className="small-btn" onClick={() => navigate('/notice/list')}>목록</button>
      </div>
    </div>

      {notice ? (
        <div className="notice-read-content">
          <h3>{notice.title}</h3>
          <div className="notice-meta">
            <span>작성일: {new Date(notice.rdate).toLocaleDateString('ko-KR')}</span>
            <span>조회수: {notice.views}</span>
          </div>
          <hr />
          <p className="notice-body">{notice.content}</p>
        </div>
      ) : (
        <p className="empty-message">📦 불러오는 중...</p>
      )}
    </div>
  );
}

export default NoticeRead;
