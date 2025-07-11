import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 감정 아이콘/라벨 매핑
const emotions = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

const DiaryRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInMemberno = user?.memberno;

  useEffect(() => {
    if (!user?.memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    axios.get(`/diary/read/${id}`)
      .then((res) => {
        if (res.data && res.data.memberno && res.data.memberno !== loggedInMemberno) {
          alert('권한이 없습니다.');
          navigate('/diary');
          return;
        }
        setDiary(res.data);
      })
      .catch(() => {
        alert('불러오기 실패');
        navigate('/diary');
      });
  }, [id, navigate, loggedInMemberno]);

  if (!diary) return <div>불러오는 중...</div>;

  // 감정 정보 찾기
  const emotion = emotions.find(e => e.score === diary.risk_flag);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>{diary.title}</h2>
      <p><strong>날짜:</strong> {diary.rdate}</p>

      {emotion && (
        <div style={{ margin: '12px 0', fontSize: '1.5rem' }}>
          <strong>오늘의 감정:</strong> {emotion.icon} {emotion.label}
        </div>
      )}

      {diary.file1saved && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={`http://localhost:9093/diary/storage/${diary.file1saved}`}
            alt="첨부 이미지"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      )}

      <p style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{diary.content}</p>
      
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0077cc',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        뒤로가기
      </button>
    </div>
  );
};

export default DiaryRead;
