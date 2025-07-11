import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryGroupBar from './CategoryGroupBar';

function BoardPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [word, setWord] = useState('');
  const [now_page, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchType, setSearchType] = useState('all'); // all: 제목+내용, title: 제목, reply: 댓글

  const { categoryno } = useParams(); // categoryno는 문자열 (예: '3')
  const [selectedCategory, setSelectedCategory] = useState(categoryno || 'all');

  const navigate = useNavigate();

  // 게시글 불러오기 (검색, 페이징)
  const fetchBoardList = async (page = 1, searchWord = '', searchTypeParam = searchType) => {
    const queryWord = searchWord && searchWord.trim() !== '' ? searchWord : 'all';
    try {
      const res = await axios.get(`/board/list_all?word=${queryWord}&now_page=${page}&searchType=${searchTypeParam}`);
      setCategoryGroup(res.data.categoryGroup);
      setBoardList(res.data.boardList);
      setTotalPage(res.data.totalPage || 1);
      setNowPage(res.data.now_page || page);
      setWord(res.data.word === 'all' ? '' : res.data.word);
    } catch (err) {
      alert('전체글을 불러오지 못했습니다.fetchBoardList-BP');
    }
  };

  // 카테고리별 목록 불러오기
  const fetchBoardListByCategory = async (categoryno, page = 1, searchWord = '') => {
    const queryWord = searchWord && searchWord.trim() !== '' ? searchWord : 'all';
    const res = await axios.get(`/board/list_category/${categoryno}?word=${queryWord}&now_page=${page}`);
    setCategoryGroup(res.data.categoryGroup);
    setBoardList(res.data.listByCategoryBoard);
    setTotalPage(res.data.totalPage || 1);
    setNowPage(res.data.now_page || page);
    setWord(res.data.word === 'all' ? '' : res.data.word);
  };

  // 검색어 즉각적으로 검색 가능하게 하고싶으면 word를 []에 추가
  useEffect(() => {
    if (!categoryno || categoryno === 'all') {
      fetchBoardList(now_page || 1, word || '');
      setSelectedCategory('all');
    } else {
      fetchBoardListByCategory(categoryno, now_page || 1, word || '');
      setSelectedCategory(categoryno);
    }
  }, [categoryno, now_page]);

  // 검색
  const handleSearch = e => {
    e.preventDefault();
    fetchBoardList(1, word, searchType);
  };

  // 페이지 이동
  const handlePageChange = page => {
    fetchBoardList(page, word);
  };

  // 상세보기 이동
  const handleRowClick = boardno => {
    navigate(`/board/read/${boardno}`);
  };

  // 내용 일부만 표시
  const truncateContent = content => {
    if (!content) return '';
    return content.length > 160 ? `${content.substring(0, 160)}...` : content;
  };
  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  const isImage = filename => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  // 카테고리 선택 시 게시글 목록 불러오기
  const handleCategoryChange = async (categoryno) => {
    setSelectedCategory(categoryno);
    setWord(''); // 검색어 리셋

    try {
      if (categoryno === 'all') {
        const res = await axios.get(`/board/list_all`);
        navigate(`/board/list_all/all/1`);
        setSelectedCategory(res.data.categoryno);
        setBoardList(res.data.boardList);
      } else {
        const res = await axios.get(`/board/list_category/${categoryno}?word=all&now_page=1`);
        navigate(`/board/list_category/${categoryno}/all/1`);
        setSelectedCategory(res.data.categoryno);
        setBoardList(res.data.listByCategoryBoard);
      }
    } catch (err) {
      alert('게시글 목록을 불러오지 못했습니다.');
    }
    // categoryno로 목록+검색+1페이지 조회
    fetchBoardList(1, '');
    // navigate(`/board/list_category/${categoryno}/all/1`);
  };

  return (
    <div>
      <h1>전체 게시판 목록</h1>
      <a href={`/board/create/${categoryno}`}>등록</a>

      {/* 카테고리 그룹 버튼바 */}
      <CategoryGroupBar
        categoryGroup={categoryGroup}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr />

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          style={{ marginRight: 8, padding: '8px', fontSize: '16px' }}
        >
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="reply">댓글</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={word}
          onChange={e => setWord(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', width: 220, marginRight: 10 }}
        />
        <button type="submit">검색</button>
      </form>
      <table className="table table-striped" style={{ width: '100%' }}>
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '80%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>파일</th>
            <th>제목</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {boardList.map(boardVO => (
            <tr key={boardVO.boardno} onClick={() => handleRowClick(boardVO.boardno)} style={{ cursor: 'pointer' }}>
              <td>
                {isImage(boardVO.file1) && boardVO.size1 > 0 ? (
                  <img src={`/board/storage/${boardVO.thumb1}`} alt={boardVO.title} style={{ width: '120px', height: '90px', objectFit: 'cover' }} />
                ) : boardVO.size1 > 0 ? (
                  <div className="file-name">
                    <span>{boardVO.file1}</span>
                  </div>
                ) : (
                  <img src="/board/storage/none1.png" alt="No file" style={{ width: '120px', height: '90px' }} />
                )}
              </td>
              <td>
                <div>{boardVO.title}</div>
                <div>{stripHtml(truncateContent(boardVO.content))}</div>
              </td>
              <td>{boardVO.cnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      <div style={{ margin: '16px 0' }}>
        {Array.from({ length: totalPage }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={now_page === pageNum}
            style={{
              margin: '0 2px',
              padding: '6px 12px',
              borderRadius: 4,
              background: now_page === pageNum ? '#4662e1' : '#fff',
              color: now_page === pageNum ? '#fff' : '#4662e1',
              border: '1px solid #4662e1',
              fontWeight: now_page === pageNum ? 700 : 500,
              cursor: now_page === pageNum ? 'default' : 'pointer',
            }}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
