// EmotionDiary.jsx
import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DiaryReadModal from './DiaryReadModal';  

const dummyData = [];

const emotionIcons = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
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

function DiaryItem({ id, emotion, content, rdate, title, onClick }) {
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
    onClick(id);
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

function DiaryList({ diaryList, onDiaryClick, onCreateClick }) {
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

        <button onClick={onCreateClick}>새 일기쓰기</button>
      </div>

      {getProcessedDiaryList().map((it) => (
        <DiaryItem key={it.id} {...it} onClick={onDiaryClick}/>
      ))}
    </div>
  );
}

function DiaryPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedDiaryId, setSelectedDiaryId] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 페이지 정보
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 0;
  const [page, setPage] = useState(pageParam);
  const size = 10;

  // 서버 응답 데이터
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [curDate, setCurDate] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  useEffect(() => {
    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    fetchDiaries();
  }, [navigate, memberno, page, curDate]); // ✅ curDate 추가

  const fetchDiaries = async () => {
      try {
        const year = curDate.getFullYear();
        const month = curDate.getMonth() + 1;
        const res = await axios.get('/diary/list', {
          params: { memberno, page, size, year, month }
        });

        const list = res.data.content || [];

        // const list = Array.isArray(res.data) ? res.data : res.data.list || [];
        console.log(res.data);

        const mapped = list.map((item) => ({
          id: item.diaryno,
          emotion: item.risk_flag,
          content: item.content,
          rdate: item.rdate,
          title: item.title,
        }));

        setData(mapped);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('일기 목록 불러오기 실패:', err);
        setData([]);
        setTotalPages(0); // ✅ 서버 요청 실패하면 페이지 버튼 초기화
      }
    };


  // 월 필터
  const filteredByMonth = data.filter((item) => {
    const itemDate = new Date(item.rdate);
    return (
      itemDate.getFullYear() === curDate.getFullYear() &&
      itemDate.getMonth() === curDate.getMonth()
    );
  });

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
    setPage(0);               // ✅ 페이지 리셋
    setSearchParams({ page: 0 });
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
    setPage(0);               // ✅ 페이지 리셋
    setSearchParams({ page: 0 });
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    try {
      const res = await axios.get('/diary/search', {
        params: {
          memberno,
          keyword,
          type: searchType,
          page: 0,
          size
        }
      });

      const list = res.data.content || [];
      const mapped = list.map((item) => ({
        id: item.diaryno,
        emotion: item.risk_flag,
        content: item.content,
        rdate: item.rdate,
        title: item.title,
      }));

      setData(mapped);
      setTotalPages(res.data.totalPages);
      setIsSearchMode(true);
      setPage(0);
    } catch (err) {
      console.error('검색 실패:', err);
      alert("검색 실패!");
    }
  };

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#FFFFFF' }}>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text="<" onClick={decreaseMonth} />}
        rightChild={<MyButton text=">" onClick={increaseMonth} />}
      />

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px', marginRight: '10px' }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력 (제목/내용)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{
              padding: '8px',
              border: 'none',
              outline: 'none',
              width: '180px',
              backgroundColor: 'transparent'
            }}
          />
          {isSearchMode && (
            <button
              onClick={() => {
                // ✅ 검색 취소 동작
                setIsSearchMode(false);
                setKeyword("");
                setSearchType("all");
                window.location.reload();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#888',
              }}
            >
              ✕
            </button>
          )}
        </div>


        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <button onClick={handleSearch} style={{ padding: '8px 16px' }}>검색</button>
      </div>

      <DiaryList diaryList={filteredByMonth} onDiaryClick={(id) => setSelectedDiaryId(id)} onCreateClick={() => setIsCreateModalOpen(true)}/>

      {selectedDiaryId && (
        <DiaryReadModal
          id={selectedDiaryId}
          onClose={() => setSelectedDiaryId(null)}
          onSuccess={(newId) => {setSelectedDiaryId(newId);}}
        />
      )}
      {isCreateModalOpen && (
        <DiaryReadModal
          createMode
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newId) => {
            setIsCreateModalOpen(false);
            setSelectedDiaryId(newId);
            fetchDiaries();
          }}
        />
      )}

      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
          <button
            key={p}
            onClick={() => {
              setPage(p);
              setSearchParams({ page: p });
            }}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              backgroundColor: p === page ? '#0077cc' : '#eee',
              color: p === page ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {p + 1}
          </button>
        ))}
      </div>
    </div>
  );
}


export default DiaryPage;
