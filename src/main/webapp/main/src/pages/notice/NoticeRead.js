// src/components/NoticeRead.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeRead.css';

function NoticeRead() {
  const { noticeno } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [user, setUser] = useState(null); // ✅ 사용자 정보 상태

  // ✅ 로그인된 사용자 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('❌ 사용자 정보 파싱 실패', e);
      }
    }
  }, []);

  const isAdmin = user && user.adminno != null; // ✅ 관리자 여부 확인

  // ✅ 공지사항 상세 불러오기
  useEffect(() => {
    axios.get(`http://localhost:9093/notice/read/${noticeno}`)
      .then(res => setNotice(res.data))
      .catch(err => console.error('❌ 공지사항 상세 불러오기 실패', err));
  }, [noticeno]);

  // ✅ 삭제 버튼 클릭 시 바로 삭제 요청
  const handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:9093/notice/delete/${noticeno}`);
      alert("✅ 삭제가 완료되었습니다.");
      navigate('/notice/list');
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 카테고리 뱃지 색상 클래스
  const getCategoryClass = (category) => {
    switch (category) {
      case '이벤트':
        return 'badge-event';
      case '점검':
        return 'badge-system';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="notice-page-bg">
      <div className="read-header">
        <h2>📌 공지사항 </h2>

        {/* ✅ 버튼 오른쪽 상단 정렬 */}
        <div className="notice-action-buttons">
          {isAdmin && (
            <div className="text-link-group">
              <span className="text-link" onClick={() => navigate(`/notice/create`)}>등록</span>
              <span className="link-divider">|</span>
              <span className="text-link" onClick={() => navigate(`/notice/update/${noticeno}`)}>수정</span>
              <span className="link-divider">|</span>
              <span className="text-link" onClick={handleDelete}>삭제</span>
            </div>
          )}
          <button className="pretty-back-button" onClick={() => navigate('/notice/list')}>목록</button>
        </div>
      </div>

      {notice ? (
        <div className="notice-read-content">
          {/* ✅ 카테고리 뱃지 */}
          <div
            className={`badge ${getCategoryClass(notice.category)}`}
            style={{ marginBottom: '10px' }}
          >
            {notice.category}
          </div>

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
