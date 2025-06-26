// src/components/NoticeList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeList.css';

function NoticeList() {
  const [notices, setNotices] = useState([]);            // 🔹 검색 결과 공지 목록
  const [searchKeyword, setSearchKeyword] = useState(''); // 🔹 검색 키워드
  const [visitedIds, setVisitedIds] = useState([]);       // 🔹 방문한 공지 번호
  const navigate = useNavigate();

  // 🔹 방문 기록 로딩
  useEffect(() => {
    const stored = localStorage.getItem('visitedNoticeIds');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setVisitedIds(parsed);
      } catch (e) {
        console.error('❌ 방문 기록 파싱 실패', e);
      }
    }
  }, []);

  // 🔹 검색 키워드 변경 시 서버에 검색 요청
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get('http://localhost:9093/notice/search', {
          params: { keyword: searchKeyword }
        });
        setNotices(res.data);
      } catch (err) {
        console.error('❌ 공지 검색 실패', err);
      }
    };

    fetchSearchResults();
  }, [searchKeyword]); // 검색어가 바뀔 때마다 실행됨

  // 🔹 제목 클릭 시 방문 처리 + 이동
  const handleTitleClick = (noticeno) => {
    const updated = [...new Set([...visitedIds, noticeno])];
    setVisitedIds(updated);
    localStorage.setItem('visitedNoticeIds', JSON.stringify(updated));
    navigate(`/notice/read/${noticeno}`);
  };

  // 🔹 방문 기록 초기화
  const handleResetVisited = () => {
    localStorage.removeItem('visitedNoticeIds');
    setVisitedIds([]);
  };

  return (
    <div className="notice-page-bg">
      <div className="notice-header">
        <h2>📢 공지사항 목록</h2>
        <div>
          <button className="create-btn" onClick={() => navigate('/notice/create')}>
            ➕ 등록하기
          </button>
        </div>
      </div>

      {/* 🔍 검색 입력창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 제목 + 내용 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {notices.length === 0 ? (
        <p className="empty-message">검색 결과가 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr key={notice.noticeno}>
                <td>{index + 1}</td>
                <td
                  className={`title-link ${visitedIds.includes(notice.noticeno) ? 'visited' : ''}`}
                  onClick={() => handleTitleClick(notice.noticeno)}
                >
                  {notice.title}
                </td>
                <td>{new Date(notice.rdate).toLocaleDateString('ko-KR')}</td>
                <td>{notice.views}</td>
                <td>
                  <div className="icon-wrapper">
                    <span
                      className="icon"
                      onClick={() => navigate(`/notice/update/${notice.noticeno}`)}
                      title="수정"
                    >✏️</span>
                    <span
                      className="icon"
                      onClick={() => navigate(`/notice/delete/${notice.noticeno}`)}
                      title="삭제"
                    >🗑️</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 방문기록 초기화 */}
      <div className="visited-reset-hint">
        <span onClick={handleResetVisited}>♻️ 방문기록 초기화</span>
      </div>
    </div>
  );
}

export default NoticeList;
