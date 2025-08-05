import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DiaryReadModal from './DiaryReadModal';
import { FaChevronDown } from 'react-icons/fa';

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

function DiaryItem({ id, emotion, content, rdate, title, onClick }) {
  const emotionIcon = emotionIcons.find(e => e.score === emotion)?.icon || "😐";

  return (
    <div
      onClick={() => onClick(id)}
      style={{
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>작성 날짜 {rdate}</div>
      <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>{content.replace(/<[^>]+>/g, '').slice(0, 40)}...</div>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        오늘의 감정 : <span style={{ fontSize: '1.4rem' }}>{emotionIcon}</span>
      </div>
    </div>
  );
}

function DiaryList({ diaryList, onDiaryClick }) {
  const visibleCards = diaryList.map((it) => (
    <DiaryItem key={it.id} {...it} onClick={onDiaryClick} />
  ));

  const fillerCount = diaryList.length < 3 ? 3 - diaryList.length : 0;
  const fillers = Array.from({ length: fillerCount }, (_, idx) => (
    <div
      key={`filler-${idx}`}
      style={{
        visibility: 'hidden',
        height: '100%',     // DiaryItem과 높이 맞춤
      }}
    />
  ));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // 항상 3열
        gap: '20px',
      }}
    >
      {visibleCards}
      {fillers}
    </div>
  );
}

function DiaryPage() {
  const navigate = useNavigate();
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [sortType, setSortType] = useState("latest");
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 0;
  const [page, setPage] = useState(pageParam);
  const size = 6;
  const [curDate, setCurDate] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;
  const [data, dispatch] = useReducer(reducer, []);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    fetchDiaries();
  }, [navigate, memberno, page, curDate]);

  const fetchDiaries = async () => {
    try {
      const year = curDate.getFullYear();
      const month = curDate.getMonth() + 1;
      const res = await axios.get('http://121.78.128.139:9093/diary/list', {
        params: { memberno, page, size, year, month },
      });

      const list = res.data.content || [];
      const mapped = list.map((item) => ({
        id: item.diaryno,
        emotion: item.risk_flag,
        content: item.content,
        rdate: item.rdate,
        title: item.title,
      }));

      dispatch({ type: 'SET', data: mapped });
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('일기 목록 불러오기 실패:', err);
      dispatch({ type: 'SET', data: [] });
      setTotalPages(0);
    }
  };

  const filteredList = data.filter((item) => {
    const itemDate = new Date(item.rdate);
    const inMonth = itemDate.getFullYear() === curDate.getFullYear() && itemDate.getMonth() === curDate.getMonth();
    const emotionFilter = filter === 'good' ? item.emotion <= 3 : filter === 'bad' ? item.emotion > 3 : true;
    return inMonth && emotionFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.rdate).getTime();
    const dateB = new Date(b.rdate).getTime();
    return sortType === 'latest' ? dateB - dateA : dateA - dateB;
  });

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요!');
      return;
    }
    try {
      const res = await axios.get('http://121.78.128.139:9093/diary/search', {
        params: { memberno, keyword, type: searchType, page: 0, size },
      });
      const list = res.data.content || [];
      const mapped = list.map((item) => ({
        id: item.diaryno,
        emotion: item.risk_flag,
        content: item.content,
        rdate: item.rdate,
        title: item.title,
      }));
      dispatch({ type: 'SET', data: mapped });
      setTotalPages(res.data.totalPages);
      setPage(0);
      setIsSearching(true);  // ✅ 검색 모드 활성화
    } catch (err) {
      console.error('검색 실패:', err);
      alert('검색 실패!');
    }
  };
  const handleCancel = () => {
    setKeyword('');
    setIsSearching(false);
    setPage(0);
    // 🔄 전체 데이터 다시 불러오기
    fetchDiaries();  // 전체 리스트 로딩 함수
  };

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#6DBD5F',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const selectStyle = {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center', // 🔥 오른쪽에서 12px 들여쓰기
    backgroundSize: '12px',
    paddingRight: '32px', // 🔥 화살표 공간 확보
  };

  const paginationStyle = (active) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: active ? '#4CAF50' : '#eee',
    color: active ? '#fff' : '#333',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    margin: '0 5px',
  });

  const minimalSelectStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    paddingRight: '18px',    // ▼ 공간 확보
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23333\' height=\'12\' viewBox=\'0 0 24 24\' width=\'12\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    borderRadius: '6px',
    padding: '6px 12px',
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 className='diary-title'>일기</h1>
        <p className='diary-subtitle'>
          ✍️ 오늘 하루, 마음은 어땠나요?<br />
          생각이나 기분을 짧게 적어보는 것만으로도<br />
          마음이 조금 가벼워질 수 있어요!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/diary/images/left.png" alt="이전 달" style={{ width: '18px', height: '18px' }} />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '500' }}>{headText}</h2>
        <button onClick={() => setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/diary/images/right.png" alt="다음 달" style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* 일기 검색 */}
      <div className="diary-search-wrapper">
        <div className="diary-search-form">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="all">제목+내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          {!isSearching ? (
            <button onClick={handleSearch}>검색</button>
          ) : (
            <button onClick={handleCancel}>취소</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={minimalSelectStyle}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={minimalSelectStyle}
          >
            <option value="all">전체</option>
            <option value="good">좋은 감정만</option>
            <option value="bad">나쁜 감정만</option>
          </select>
        </div>

        <button onClick={() => setSelectedDiaryId('create')} className='yellow-btn'>새 일기쓰기</button>
      </div>

      <hr style={{
        border: 'none',
        borderTop: '1px solid #e0e0e0',
        marginBottom: '30px'
      }} />

      {filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '40px 0', fontSize: '18px', color: '#777' }}>
          작성된 일기가 없습니다.
        </div>
      ) : (
        <DiaryList diaryList={filteredList} onDiaryClick={(id) => setSelectedDiaryId(id)} />
      )}

      {selectedDiaryId && (
        <DiaryReadModal
          id={selectedDiaryId === 'create' ? null : selectedDiaryId}
          createMode={selectedDiaryId === 'create'}
          onClose={() => setSelectedDiaryId(null)}
          onSuccess={(result) => {
            if (selectedDiaryId === 'create') {
              // 새 일기 작성
              dispatch({
                type: 'CREATE',
                data: {
                  id: result.diaryno,
                  title: result.title,
                  content: result.content,
                  rdate: result.rdate,
                  emotion: result.risk_flag,
                }
              });
              setSelectedDiaryId(result.diaryno);
            } else if (typeof result === 'number') {
              // ✅ 삭제된 경우: result는 삭제된 diary id
              dispatch({
                type: 'REMOVE',
                targetId: result
              });
              if (filteredList.length === 1 && page > 0) {
                setPage(page - 1);
                setSearchParams({ page: page - 1 });
              } else {
                fetchDiaries();  // ✅ 삭제 후 다시 fetch
              }
              setSelectedDiaryId(null);
            } else {
              // 수정된 경우
              dispatch({
                type: 'EDIT',
                data: {
                  id: result.diaryno,
                  title: result.title,
                  content: result.content,
                  rdate: result.rdate,
                  emotion: result.risk_flag,
                }
              });
              setSelectedDiaryId(result.diaryno);
            }
          }}
        />
      )}

      {filteredList.length > 0 && (
        <div className="custom-pagination-container">
          {/* ◀️ 이전 페이지 */}
          <button
            onClick={() => {
              if (page > 0) {
                setPage(page - 1);
                setSearchParams({ page: page - 1 });
              }
            }}
            disabled={page === 0}
            className={`page-arrow-btn ${page === 0 ? 'disabled' : ''}`}
          >
            <img src="/diary/images/left.png" alt="이전 페이지" className="arrow-icon" />
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setPage(i);
                setSearchParams({ page: i });
              }}
              className={`page-number-btn ${i === page ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}

          {/* ▶️ 다음 페이지 */}
          <button
            onClick={() => {
              if (page < totalPages - 1) {
                setPage(page + 1);
                setSearchParams({ page: page + 1 });
              }
            }}
            disabled={page === totalPages - 1}
            className={`page-arrow-btn ${page === totalPages - 1 ? 'disabled' : ''}`}
          >
            <img src="/diary/images/right.png" alt="다음 페이지" className="arrow-icon" />
          </button>
        </div>
      )}
    </div>
  );
  
}

export default DiaryPage;
