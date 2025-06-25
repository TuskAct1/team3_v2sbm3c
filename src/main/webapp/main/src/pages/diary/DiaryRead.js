// DiaryRead.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DiaryRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    axios.get(`/diary/read/${id}`)
      .then((res) => {
        setDiary(res.data);
      })
      .catch(() => {
        alert('불러오기 실패');
        navigate('/diary/list_all');
      });
  }, [id, navigate]);

  if (!diary) return <div>불러오는 중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{diary.title}</h2>
      <p><strong>날짜:</strong> {diary.rdate}</p>
      <p><strong>감정 점수:</strong> {diary.risk_flag}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{diary.content}</p>
      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>뒤로가기</button>
    </div>
  );
};

export default DiaryRead;
