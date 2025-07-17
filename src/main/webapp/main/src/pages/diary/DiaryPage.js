// // EmotionDiary.jsx
// import React, { useEffect, useReducer, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const dummyData = [];

// const emotionIcons = [
//   { score: 1, icon: "😃", label: "긍정" },
//   { score: 2, icon: "😠", label: "부정" },
//   { score: 3, icon: "😐", label: "중립" },
//   { score: 4, icon: "😰", label: "불안" },
//   { score: 5, icon: "😢", label: "우울" },
// ];

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET': return action.data;
//     case 'CREATE': return [action.data, ...state];
//     case 'REMOVE': return state.filter(it => it.id !== action.targetId);
//     case 'EDIT': return state.map(it => it.id === action.data.id ? action.data : it);
//     default: return state;
//   }
// }

// function MyHeader({ headText, leftChild, rightChild }) {
//   return (
//     <header
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center', // 수직 가운데 정렬 추가
//         marginBottom: '20px',
//       }}
//     >
//       <div>{leftChild}</div>
//       <h2 style={{ margin: 0, textAlign: 'center', flex: 1 }}>{headText}</h2>
//       <div>{rightChild}</div>
//     </header>
//   );
// }


// function MyButton({ text, onClick }) {
//   return (
//     <button onClick={onClick} style={{ padding: '8px 16px', backgroundColor: '#0077cc', color: 'white', border: 'none', borderRadius: '5px' }}>
//       {text}
//     </button>
//   );
// }

// function DiaryItem({ id, emotion, content, rdate, title }) {
//   const navigate = useNavigate();

//   const handleDelete = async (e) => {
//     e.stopPropagation(); // 카드 클릭 방지
//     try {
//       await axios.delete(`/diary/delete/${id}`);
//       alert('삭제되었습니다.');
//       window.location.reload();
//     } catch (e) {
//       alert('삭제 실패');
//     }
//   };

//   const handleUpdate = (e) => {
//     e.stopPropagation(); // 카드 클릭 방지
//     navigate(`/diary/update/${id}`);
//   };

//   const handleRead = () => {
//     navigate(`/diary/read/${id}`);
//   };

//   const emotionIcon = emotionIcons.find(e => e.score === emotion)?.icon || "😐";
//   const emotionColor = emotion <= 3 ? '#4CAF50' : '#F44336';

//   return (
//     <div
//       onClick={handleRead} // ✅ 카드 클릭 시 read 이동
//       style={{
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '16px',
//         marginBottom: '12px',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
//         backgroundColor: '#fff',
//         cursor: 'pointer', // ✅ 마우스 포인터 변경
//       }}
//     >
//       <h3 style={{ marginBottom: '8px' }}>{title}</h3>
//       <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{rdate}</div>
//       <div style={{ marginBottom: '8px', fontWeight: 400 }}>{content.slice(0, 50)}...</div>
//       <div style={{ marginBottom: '12px', fontWeight: 'bold', color: emotionColor, fontSize: '1.5rem' }}>
//         오늘의 감정 {emotionIcon}
//       </div>
//       <div>
//         {/* 읽기 버튼 제거됨 */}
//         <button onClick={handleUpdate} className="btn" style={{ marginRight: '8px' }}>
//           수정
//         </button>
//         <button onClick={handleDelete} className="btn red">
//           삭제
//         </button>
//       </div>
//     </div>
//   );
// }

// function DiaryList({ diaryList }) {
//   const [sortType, setSortType] = useState('latest');
//   const [filter, setFilter] = useState('all');
//   const navigate = useNavigate();

//   const sortOptionList = [
//     { value: 'latest', name: '최신순' },
//     { value: 'oldest', name: '오래된순' },
//   ];

//   const filterOptionList = [
//     { value: 'all', name: '전체' },
//     { value: 'good', name: '좋은감정만' },
//     { value: 'bad', name: '나쁜감정만' },
//   ];

//   const getProcessedDiaryList = () => {
//     const filtered = diaryList.filter((it) => {
//       if (filter === 'good') return it.emotion <= 3;
//       if (filter === 'bad') return it.emotion > 3;
//       return true;
//     });

//     const sorted = [...filtered].sort((a, b) => {
//       const dateA = new Date(a.rdate).getTime();
//       const dateB = new Date(b.rdate).getTime();
//       return sortType === 'latest' ? dateB - dateA : dateA - dateB;
//     });

//     return sorted;
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: '10px' }}>
//         <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
//           {sortOptionList.map((it) => (
//             <option key={it.value} value={it.value}>{it.name}</option>
//           ))}
//         </select>

//         <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '10px' }}>
//           {filterOptionList.map((it) => (
//             <option key={it.value} value={it.value}>{it.name}</option>
//           ))}
//         </select>

//         <button onClick={() => navigate('/diary/create')} style={{ marginLeft: '10px' }}>새 일기쓰기</button>
//       </div>

//       {getProcessedDiaryList().map((it) => (
//         <DiaryItem key={it.id} {...it} />
//       ))}
//     </div>
//   );
// }

// function DiaryPage() {
//   const navigate = useNavigate();

//   const [keyword, setKeyword] = useState("");
//   const [searchType, setSearchType] = useState("all");
//   const [isSearchMode, setIsSearchMode] = useState(false);

//   // 페이지 정보
//   const [searchParams, setSearchParams] = useSearchParams();
//   const pageParam = parseInt(searchParams.get('page')) || 0;
//   const [page, setPage] = useState(pageParam);
//   const size = 10;

//   // 서버 응답 데이터
//   const [data, setData] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   const [curDate, setCurDate] = useState(new Date());

//   const user = JSON.parse(localStorage.getItem("user"));
//   const memberno = user?.memberno;

//   useEffect(() => {
//     if (!memberno) {
//       alert("로그인이 필요합니다.");
//       navigate("/login");
//       return;
//     }

//     const fetchDiaries = async () => {
//       try {
//         const year = curDate.getFullYear();
//         const month = curDate.getMonth() + 1;
//         const res = await axios.get('/diary/list', {
//           params: { memberno, page, size, year, month }
//         });

//         const list = res.data.content || [];


//         // const list = Array.isArray(res.data) ? res.data : res.data.list || [];
//         console.log(res.data);

//         const mapped = list.map((item) => ({
//           id: item.diaryno,
//           emotion: item.risk_flag,
//           content: item.content,
//           rdate: item.rdate,
//           title: item.title,
//         }));

//         setData(mapped);
//         setTotalPages(res.data.totalPages);
//       } catch (err) {
//         console.error('일기 목록 불러오기 실패:', err);
//         setData([]);
//         setTotalPages(0); // ✅ 서버 요청 실패하면 페이지 버튼 초기화
//       }
//     };

//     fetchDiaries();
//   }, [navigate, memberno, page, curDate]); // ✅ curDate 추가


//   // 월 필터
//   const filteredByMonth = data.filter((item) => {
//     const itemDate = new Date(item.rdate);
//     return (
//       itemDate.getFullYear() === curDate.getFullYear() &&
//       itemDate.getMonth() === curDate.getMonth()
//     );
//   });

//   const increaseMonth = () => {
//     setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
//     setPage(0);               // ✅ 페이지 리셋
//     setSearchParams({ page: 0 });
//   };

//   const decreaseMonth = () => {
//     setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
//     setPage(0);               // ✅ 페이지 리셋
//     setSearchParams({ page: 0 });
//   };

//   const handleSearch = async () => {
//     if (!keyword.trim()) {
//       alert("검색어를 입력해주세요!");
//       return;
//     }

//     try {
//       const res = await axios.get('/diary/search', {
//         params: {
//           memberno,
//           keyword,
//           type: searchType,
//           page: 0,
//           size
//         }
//       });

//       const list = res.data.content || [];
//       const mapped = list.map((item) => ({
//         id: item.diaryno,
//         emotion: item.risk_flag,
//         content: item.content,
//         rdate: item.rdate,
//         title: item.title,
//       }));

//       setData(mapped);
//       setTotalPages(res.data.totalPages);
//       setIsSearchMode(true);
//       setPage(0);
//     } catch (err) {
//       console.error('검색 실패:', err);
//       alert("검색 실패!");
//     }
//   };

//   const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

//   return (
//     <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#FFFFFF' }}>
//       <MyHeader
//         headText={headText}
//         leftChild={<MyButton text="<" onClick={decreaseMonth} />}
//         rightChild={<MyButton text=">" onClick={increaseMonth} />}
//       />

//       <div style={{ marginBottom: '20px' }}>
//         <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px', marginRight: '10px' }}>
//           <input
//             type="text"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             placeholder="검색어 입력 (제목/내용)"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 handleSearch();
//               }
//             }}
//             style={{
//               padding: '8px',
//               border: 'none',
//               outline: 'none',
//               width: '180px',
//               backgroundColor: 'transparent'
//             }}
//           />
//           {isSearchMode && (
//             <button
//               onClick={() => {
//                 // ✅ 검색 취소 동작
//                 setIsSearchMode(false);
//                 setKeyword("");
//                 setSearchType("all");
//                 window.location.reload();
//               }}
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 color: '#888',
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>


//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           style={{ padding: '8px', marginRight: '10px' }}
//         >
//           <option value="all">제목+내용</option>
//           <option value="title">제목</option>
//           <option value="content">내용</option>
//         </select>
//         <button onClick={handleSearch} style={{ padding: '8px 16px' }}>검색</button>
//       </div>

//       <DiaryList diaryList={filteredByMonth} />

      
//       <div style={{ marginTop: '20px', textAlign: 'center' }}>
//         {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
//           <button
//             key={p}
//             onClick={() => {
//               setPage(p);
//               setSearchParams({ page: p });
//             }}
//             style={{
//               margin: '0 5px',
//               padding: '6px 12px',
//               backgroundColor: p === page ? '#0077cc' : '#eee',
//               color: p === page ? '#fff' : '#333',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//             }}
//           >
//             {p + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }


// export default DiaryPage;
// EmotionDiary.jsx
// EmotionDiary.jsx

// EmotionDiary.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const emotionIcons = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

function MyHeader({ headText, leftChild, rightChild }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
      {leftChild}
      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{headText}</h2>
      {rightChild}
    </header>
  );
}

function MyButton({ text, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
      {text}
    </button>
  );
}

function DiaryItem({ id, emotion, content, rdate, title }) {
  const navigate = useNavigate();
  const emotionIcon = emotionIcons.find(e => e.score === emotion)?.icon || "😐";

  const handleRead = () => navigate(`/diary/read/${id}`);

  return (
    <div
      onClick={handleRead}
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
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>{content.slice(0, 40)}...</div>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>오늘의 감정 : <span style={{ fontSize: '1.4rem' }}>{emotionIcon}</span></div>
    </div>
  );
}

function DiaryList({ diaryList }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {diaryList.map((it) => <DiaryItem key={it.id} {...it} />)}
    </div>
  );
}

function DiaryPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [sortType, setSortType] = useState("latest");
  const [filter, setFilter] = useState("all");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 0;
  const [page, setPage] = useState(pageParam);
  const size = 10;
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

    const fetchDiaries = async () => {
      try {
        const year = curDate.getFullYear();
        const month = curDate.getMonth() + 1;
        const res = await axios.get('/diary/list', {
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

        setData(mapped);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('일기 목록 불러오기 실패:', err);
        setData([]);
        setTotalPages(0);
      }
    };

    fetchDiaries();
  }, [navigate, memberno, page, curDate]);

  const filteredByMonth = data.filter((item) => {
    const itemDate = new Date(item.rdate);
    return itemDate.getFullYear() === curDate.getFullYear() && itemDate.getMonth() === curDate.getMonth();
  }).filter((item) => {
    if (filter === 'good') return item.emotion <= 3;
    if (filter === 'bad') return item.emotion > 3;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.rdate).getTime();
    const dateB = new Date(b.rdate).getTime();
    return sortType === 'latest' ? dateB - dateA : dateA - dateB;
  });

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
    setPage(0);
    setSearchParams({ page: 0 });
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
    setPage(0);
    setSearchParams({ page: 0 });
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return alert("검색어를 입력해주세요!");

    try {
      const res = await axios.get('/diary/search', {
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
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 네비게이션 경로 */}
      <div style={{ fontSize: '14px', marginBottom: '10px', color: '#888' }}>🏠 홈 &gt; 토닥 콘텐츠 &gt; 일기</div>

      <h1 style={{ fontSize: '36px', marginBottom: '8px', textAlign: 'center' }}>일기</h1>
      <p style={{ color: '#555', fontSize: '16px', marginBottom: '30px', textAlign: 'center' }}>
      오늘 하루, 마음은 어땠나요?<br />생각이나 기분을 짧게 적어보는 것만으로도<br />마음이 조금 가벼워질 수 있어요!
      </p>

      <MyHeader headText={headText} leftChild={<MyButton text="<" onClick={decreaseMonth} />} rightChild={<MyButton text=">" onClick={increaseMonth} />} />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px' }}>
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px', backgroundColor: '#6DBD5F', color: '#fff', border: 'none', borderRadius: '5px' }}>검색</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">전체</option>
            <option value="good">좋은 감정만</option>
            <option value="bad">나쁜 감정만</option>
          </select>
        </div>
        <button onClick={() => navigate('/diary/create')} style={{ padding: '8px 16px', backgroundColor: '#6DBD5F', color: '#fff', border: 'none', borderRadius: '5px' }}>새 일기쓰기</button>
      </div>

      <DiaryList diaryList={filteredByMonth} />

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
          <button
            key={p}
            onClick={() => { setPage(p); setSearchParams({ page: p }); }}
            style={{ margin: '0 6px', padding: '8px 14px', backgroundColor: p === page ? '#4CAF50' : '#eee', color: p === page ? '#fff' : '#333', border: 'none', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {p + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DiaryPage;