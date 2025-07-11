// src/components/NoticeList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeList.css';

function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [visitedIds, setVisitedIds] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ 사용자 정보 로딩
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

  // ✅ 방문 기록 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('visitedNoticeIds');
    if (stored) {
      try {
        setVisitedIds(JSON.parse(stored));
      } catch (e) {
        console.error('❌ 방문 기록 파싱 실패', e);
      }
    }
  }, []);

  // ✅ 검색 시 공지 불러오기
  useEffect(() => {
    fetchSearchResults();
  }, [searchKeyword]);

  const fetchSearchResults = async () => {
    try {
      const res = await axios.get('http://localhost:9093/notice/search', {
        params: { keyword: searchKeyword },
      });
      setNotices(res.data);
    } catch (err) {
      console.error('❌ 공지 검색 실패', err);
    }
  };

  const handleTitleClick = (noticeno) => {
    const updated = [...new Set([...visitedIds, noticeno])];
    setVisitedIds(updated);
    localStorage.setItem('visitedNoticeIds', JSON.stringify(updated));
    navigate(`/notice/read/${noticeno}`);
  };

  const handleResetVisited = () => {
    localStorage.removeItem('visitedNoticeIds');
    setVisitedIds([]);
  };

  const isAdmin = user?.adminno !== undefined;

  const getCategoryClass = (category) => {
    switch (category) {
      case '이벤트':
        return 'badge-event';
      case '시스템 점검':
        return 'badge-system';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="notice-page-bg">
      <div className="notice-header">
        <h2>공지사항</h2>
        <div className="title-main">토닥의 다양한 소식을 안내해 드립니다.</div>
      </div>

      {/* ✅ 상단: 총 건수 + 검색창 */}
      <div className="notice-top-row">
        <div className="notice-count">총 {notices.length}건</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 제목 + 내용 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ 등록 버튼 (관리자만 보임) */}
      {isAdmin && (
        <div className="create-button-container">
          <button className="create-btn" onClick={() => navigate('/notice/create')}>
            ➕ 등록하기
          </button>
        </div>
      )}

      {/* ✅ 공지 목록 */}
      <div className="notice-list">
        {notices.length === 0 ? (
          <p className="empty-message">검색 결과가 없습니다.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.noticeno}
              className="notice-item"
              onClick={() => handleTitleClick(notice.noticeno)}
            >
              <div className="notice-info-left">
                <div className="notice-left-inner">
                  <span className={`badge ${getCategoryClass(notice.category)}`}>
                    {notice.category}
                  </span>
                  <span
                    className={`notice-title ${
                      visitedIds.includes(notice.noticeno) ? 'visited' : ''
                    }`}
                  >
                    {notice.title}
                  </span>
                </div>
              </div>

              <div className="notice-info-right">
                <span className="notice-date">
                  {new Date(notice.rdate).toLocaleDateString('ko-KR')}
                </span>

                {isAdmin && (
                  <div
                    className="admin-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="icon-button"
                      title="수정"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/notice/update/${notice.noticeno}`);
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      className="icon-button"
                      title="삭제"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
                        if (!confirmDelete) return;

                        try {
                          await axios.delete(
                            `http://localhost:9093/notice/delete/${notice.noticeno}`
                          );
                          alert('✅ 삭제가 완료되었습니다.');
                          setNotices((prev) =>
                            prev.filter((n) => n.noticeno !== notice.noticeno)
                          );
                        } catch (err) {
                          console.error('❌ 삭제 실패', err);
                          alert('삭제 중 오류가 발생했습니다.');
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="visited-reset-hint">
        <span onClick={handleResetVisited}>♻️ 방문기록 초기화</span>
      </div>
    </div>
  );
}

export default NoticeList;
