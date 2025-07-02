// EmotionDiary.jsx
import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const dummyData = [];

const emotionIcons = [
  { score: 1, icon: "😄", label: "아주 좋음" },
  { score: 2, icon: "🙂", label: "좋음" },
  { score: 3, icon: "😐", label: "보통" },
  { score: 4, icon: "🙁", label: "나쁨" },
  { score: 5, icon: "😞", label: "아주 나쁨" },
];

function reducer(state, action) {
  switch (action.type) {
    case 'SET': return action.data;
    case 'CREATE': return [action.data, ...state];
    case 'REMOVE': return state.filter(it => it.id !== action.targetId);
    case 'EDIT': return state.map(it => it.id === action.data.id ? action.data : it);
    default: return state;
  }
}

function MyHeader({ headText, leftChild, rightChild }) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // 수직 가운데 정렬 추가
        marginBottom: '20px',
      }}
    >
      <div>{leftChild}</div>
      <h2 style={{ margin: 0, textAlign: 'center', flex: 1 }}>{headText}</h2>
      <div>{rightChild}</div>
    </header>
  );
}


function MyButton({ text, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', backgroundColor: '#0077cc', color: 'white', border: 'none', borderRadius: '5px' }}>
      {text}
    </button>
  );
}

function DiaryItem({ id, emotion, content, rdate, title }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    try {
      await axios.delete(`/diary/delete/${id}`);
      alert('삭제되었습니다.');
      window.location.reload();
    } catch (e) {
      alert('삭제 실패');
    }
  };

  const handleUpdate = (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    navigate(`/diary/update/${id}`);
  };

  const handleRead = () => {
    navigate(`/diary/read/${id}`);
  };

  const emotionIcon = emotionIcons.find(e => e.score === emotion)?.icon || "😐";
  const emotionColor = emotion <= 3 ? '#4CAF50' : '#F44336';

  return (
    <div
      onClick={handleRead} // ✅ 카드 클릭 시 read 이동
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        cursor: 'pointer', // ✅ 마우스 포인터 변경
      }}
    >
      <h3 style={{ marginBottom: '8px' }}>{title}</h3>
      <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{rdate}</div>
      <div style={{ marginBottom: '8px', fontWeight: 400 }}>{content.slice(0, 50)}...</div>
      <div style={{ marginBottom: '12px', fontWeight: 'bold', color: emotionColor, fontSize: '1.5rem' }}>
        오늘의 감정 {emotionIcon}
      </div>
      <div>
        {/* 읽기 버튼 제거됨 */}
        <button onClick={handleUpdate} className="btn" style={{ marginRight: '8px' }}>
          수정
        </button>
        <button onClick={handleDelete} className="btn red">
          삭제
        </button>
      </div>
    </div>
  );
}

function DiaryList({ diaryList }) {
  const [sortType, setSortType] = useState('latest');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const sortOptionList = [
    { value: 'latest', name: '최신순' },
    { value: 'oldest', name: '오래된순' },
  ];

  const filterOptionList = [
    { value: 'all', name: '전체' },
    { value: 'good', name: '좋은감정만' },
    { value: 'bad', name: '나쁜감정만' },
  ];

  const getProcessedDiaryList = () => {
    const filtered = diaryList.filter((it) => {
      if (filter === 'good') return it.emotion <= 3;
      if (filter === 'bad') return it.emotion > 3;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.rdate).getTime();
      const dateB = new Date(b.rdate).getTime();
      return sortType === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          {sortOptionList.map((it) => (
            <option key={it.value} value={it.value}>{it.name}</option>
          ))}
        </select>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '10px' }}>
          {filterOptionList.map((it) => (
            <option key={it.value} value={it.value}>{it.name}</option>
          ))}
        </select>

        <button onClick={() => navigate('/diary/create')} style={{ marginLeft: '10px' }}>새 일기쓰기</button>
      </div>

      {getProcessedDiaryList().map((it) => (
        <DiaryItem key={it.id} {...it} />
      ))}
    </div>
  );
}

function DiaryPage() {
  const [data, dispatch] = useReducer(reducer, dummyData);
  const [curDate, setCurDate] = useState(new Date());

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const res = await axios.get('/diary/list_all');
        const list = Array.isArray(res.data) ? res.data : res.data.list || [];
        console.log(res,data);
        const mapped = list.map((item) => ({
          id: item.diaryno,
          emotion: item.risk_flag,
          content: item.content,
          rdate: item.rdate,  // 그냥 문자열 그대로 받음
          title: item.title,
        }));
        dispatch({ type: 'SET', data: mapped });
      } catch (err) {
        console.error('일기 목록 불러오기 실패:', err);
        dispatch({ type: 'SET', data: [] });
      }
    };
    fetchDiaries();
  }, []);

  const filteredByMonth = data.filter((item) => {
    const itemDate = new Date(item.rdate);
    return (
      itemDate.getFullYear() === curDate.getFullYear() &&
      itemDate.getMonth() === curDate.getMonth()
    );
  });

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
  };

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#FFFFFF' }}>
        <MyHeader
            headText={headText}
            leftChild={<MyButton text="<" onClick={decreaseMonth} />}
            rightChild={<MyButton text=">" onClick={increaseMonth} />}
        />
        <DiaryList diaryList={filteredByMonth} />
    </div>

  );
}

export default DiaryPage;
