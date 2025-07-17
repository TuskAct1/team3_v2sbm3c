import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeList.css';

function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [visitedIds, setVisitedIds] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  // ✅ 로그인 유저 정보 로드
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

  // ✅ 방문한 공지 불러오기
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

  // ✅ 검색어 바뀔 때마다 공지 다시 로드
  useEffect(() => {
    fetchSearchResults();
  }, [searchKeyword]);

  // ✅ 관리자 여부 판단
  const isAdmin = user?.adminno !== undefined;

  // ✅ 공지사항 목록 요청
  const fetchSearchResults = async () => {
    try {
      const res = await axios.get('http://localhost:9093/notice/search', {
        params: { keyword: searchKeyword },
      });
      setNotices(res.data);
      setVisibleCount(10);
    } catch (err) {
      console.error('❌ 공지 검색 실패', err);
    }
  };

  // ✅ 공지 클릭 시 방문기록 저장 후 이동
  const handleTitleClick = (noticeno) => {
    const updated = [...new Set([...visitedIds, noticeno])];
    setVisitedIds(updated);
    localStorage.setItem('visitedNoticeIds', JSON.stringify(updated));
    navigate(`/notice/read/${noticeno}`);
  };

  // ✅ 방문기록 초기화
  const handleResetVisited = () => {
    localStorage.removeItem('visitedNoticeIds');
    setVisitedIds([]);
  };

  // ✅ 카테고리 배지 색상 지정
  const getCategoryClass = (category) => {
    switch (category) {
      case '이벤트':
        return 'notice-list-badge-event';
      case '점검':
        return 'notice-list-badge-system';
      default:
        return 'notice-list-badge-default';
    }
  };

  // ✅ 더보기 버튼
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // ✅ 사용자 권한에 따라 공지 필터링
  const filteredNotices = notices.filter(
    (notice) => isAdmin || notice.status === '공개'
  );

  return (
    <div className="notice-page-bg">
      {/* ✅ 상단 영역 */}
      <div className="notice-header">
        <h2>공지사항</h2>
        <div className="title-main">토닥의 다양한 소식을 안내해 드립니다.</div>
      </div>

      {/* ✅ 검색창 + 총 개수 */}
      <div className="notice-top-row">
        <div className="notice-count">총 {filteredNotices.length}건</div>
        <div className="notice-search-bar">
          <input
            type="text"
            placeholder="🔍 제목 + 내용 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ 관리자만 등록 버튼 보이게 */}
      {isAdmin && (
        <div className="create-button-container">
          <button className="pretty-back-button" onClick={() => navigate('/notice/create')}>
            등록하기
          </button>
        </div>
      )}

      {/* ✅ 공지 리스트 */}
      <div className="notice-list">
        {filteredNotices.length === 0 ? (
          <p className="empty-message">검색 결과가 없습니다.</p>
        ) : (
          filteredNotices.slice(0, visibleCount).map((notice) => (
            <div
              key={notice.noticeno}
              className="notice-table-row"
              onClick={() => handleTitleClick(notice.noticeno)}
            >
              <div className="notice-td title">
                <div className="notice-title-badge">
                  <span className={`notice-list-badge ${getCategoryClass(notice.category)}`}>
                    {notice.category}
                  </span>
                </div>
                <span className={`notice-title-text ${
                  visitedIds.includes(notice.noticeno) ? 'visited' : ''
                }`}>
                  {/* ✅ 비공개일 경우 🔒 표시 */}
                  {isAdmin && notice.status === '비공개' && (
                    <i
                      className="fas fa-lock private-lock-icon"
                      title="비공개 공지"
                      aria-hidden="true"
                    ></i>
                  )}
                  {notice.title}
                </span>
              </div>

              <div className="notice-td date">
                {new Date(notice.rdate).toLocaleDateString('ko-KR')}
              </div>

              {/* ✅ 관리자만 수정/삭제 가능 */}
              {isAdmin && (
                <div className="notice-td actions" onClick={(e) => e.stopPropagation()}>
                  <div className="action-links">
                    <span
                      className="text-link"
                      onClick={() => navigate(`/notice/update/${notice.noticeno}`)}
                    >
                      수정
                    </span>
                    <span className="link-divider">|</span>
                    <span
                      className="text-link"
                      onClick={async () => {
                        const ok = window.confirm('정말 삭제하시겠습니까?');
                        if (!ok) return;
                        try {
                          await axios.delete(`http://localhost:9093/notice/delete/${notice.noticeno}`);
                          alert('✅ 삭제가 완료되었습니다.');
                          setNotices((prev) => prev.filter((n) => n.noticeno !== notice.noticeno));
                        } catch (err) {
                          console.error('❌ 삭제 실패', err);
                          alert('삭제 중 오류가 발생했습니다.');
                        }
                      }}
                    >
                      삭제
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ✅ 더보기 버튼 */}
      {visibleCount < filteredNotices.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            <i className="fas fa-chevron-down" style={{ marginRight: '6px' }}></i>
            더보기
          </button>
        </div>
      )}

      {/* ✅ 방문기록 초기화 */}
      <div className="visited-reset-hint">
        <span onClick={handleResetVisited}>♻️ 방문기록 초기화</span>
      </div>
    </div>
  );
}

export default NoticeList;
