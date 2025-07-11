import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeCreate.css';

function NoticeCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('공개');
  const [category, setCategory] = useState('공지'); // ✅ 카테고리 상태 추가
  const navigate = useNavigate();
  const adminno = 1; // 실제 로그인된 관리자 번호로 교체 필요

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      content,
      status,
      category, // ✅ 카테고리 포함
      adminno,
    };

    try {
      await axios.post('http://localhost:9093/notice/create', data);
      alert('공지 등록 완료!');
      navigate('/notice/list');
    } catch (err) {
      console.error('❌ 등록 실패:', err);
    }
  };

  return (
    <div className="notice-page-bg">
      <div className="read-header">
        <h2>📝 공지사항 등록</h2>

        <div className="notice-action-buttons">
          <button className="small-btn" onClick={() => navigate(`/notice/create`)}>등록</button>
          <button className="small-btn" onClick={() => navigate('/notice/list')}>목록</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="notice-form">

        {/* ✅ 카테고리 선택 */}
        <label htmlFor="category" className="notice-label">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="공지">공지</option>
          <option value="이벤트">이벤트</option>
          <option value="시스템 점검">시스템 점검</option>
        </select>

        {/* 제목 입력 */}
        <label htmlFor="title" className="notice-label">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* 내용 입력 */}
        <label htmlFor="content" className="notice-label">내용</label>
        <textarea
          id="content"
          value={content}
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />

        {/* 공개 여부 선택 */}
        <label htmlFor="status" className="notice-label">공개 여부</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="공개">공개</option>
          <option value="비공개">비공개</option>
        </select>

        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default NoticeCreate;
