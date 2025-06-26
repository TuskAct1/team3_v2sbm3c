import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './NoticeCreate.css'; // 스타일 재사용

function NoticeEdit() {
  const { noticeno } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState({ noticeno: '', title: '', content: '', status: '공개' });

  // 공지 불러오기
  useEffect(() => {
    axios.get(`http://localhost:9093/notice/read/${noticeno}`)
      .then(res => setNotice(res.data))
      .catch(err => console.error('❌ 상세 불러오기 실패', err));
  }, [noticeno]);

  // 입력값 변경 처리
  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9093/notice/update', notice);
      alert('✅ 수정 완료!');
      navigate('/notice/list');
    } catch (err) {
      alert('❌ 수정 실패');
    }
  };

  return (
    <div className="notice-page-bg">
      <div className="read-header">
        <h2>🛠️ 공지사항 수정</h2>

        <div className="notice-action-buttons">
          <button className="small-btn" onClick={() => navigate(`/notice/create`)}>등록</button>
          <button className="small-btn" onClick={() => navigate(`/notice/delete/${noticeno}`)}>삭제</button>
          <button className="small-btn" onClick={() => navigate('/notice/list')}>목록</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="notice-form">
        {/* 제목 입력 */}
        <label htmlFor="title" className="notice-label">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={notice.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          required
        />

        {/* 내용 입력 */}
        <label htmlFor="content" className="notice-label">내용</label>
        <textarea
          id="content"
          name="content"
          value={notice.content}
          onChange={handleChange}
          placeholder="내용을 입력하세요"
          rows="10"
          required
        ></textarea>

        {/* 공개 여부 선택 */}
        <label htmlFor="status" className="notice-label">공개 여부</label>
        <select
          id="status"
          name="status"
          value={notice.status}
          onChange={handleChange}
          required
        >
          <option value="공개">공개</option>
          <option value="비공개">비공개</option>
        </select>

        {/* 버튼 */}
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
}

export default NoticeEdit;
