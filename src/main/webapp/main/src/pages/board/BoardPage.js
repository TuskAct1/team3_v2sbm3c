import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryGroupBar from './CategoryGroupBar';
import './BoardPage.css';

function BoardPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [word, setWord] = useState('');
  const [now_page, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchType, setSearchType] = useState('all');
  const { categoryno } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoryno || 'all');
  const navigate = useNavigate();

  // 전체 게시글 조회
  const fetchBoardList = async (page = 1, searchWord = '', searchTypeParam = searchType) => {
    const queryWord = searchWord.trim() !== '' ? searchWord : 'all';
    try {
      const res = await axios.get(`/board/list_all?word=${queryWord}&now_page=${page}&searchType=${searchTypeParam}`);
      setCategoryGroup(res.data.categoryGroup);
      setBoardList(res.data.boardList);
      setTotalPage(res.data.totalPage || 1);
      setNowPage(res.data.now_page || page);
      setWord(res.data.word === 'all' ? '' : res.data.word);
    } catch {
      alert('전체글을 불러오지 못했습니다.');
    }
  };

  // 카테고리별 게시글 조회
  const fetchBoardListByCategory = async (categoryno, page = 1, searchWord = '') => {
    const queryWord = searchWord.trim() !== '' ? searchWord : 'all';
    try {
      const res = await axios.get(`/board/list_category/${categoryno}?word=${queryWord}&now_page=${page}`);
      setCategoryGroup(res.data.categoryGroup);
      setBoardList(res.data.listByCategoryBoard);
      setTotalPage(res.data.totalPage || 1);
      setNowPage(res.data.now_page || page);
      setWord(res.data.word === 'all' ? '' : res.data.word);
    } catch {
      alert('카테고리별 게시글을 불러오지 못했습니다.');
    }
  };

  // mount 또는 category 변경 시
  useEffect(() => {
    if (!categoryno || categoryno === 'all') {
      fetchBoardList(now_page, word);
      setSelectedCategory('all');
    } else {
      fetchBoardListByCategory(categoryno, now_page, word);
      setSelectedCategory(categoryno);
    }
  }, [categoryno, now_page]);

  const handleSearch = e => {
    e.preventDefault();
    fetchBoardList(1, word, searchType);
  };

  const handlePageChange = page => {
    if (!categoryno || categoryno === 'all') {
      fetchBoardList(page, word);
    } else {
      fetchBoardListByCategory(categoryno, page, word);
    }
  };

  const handleRowClick = boardno => {
    navigate(`/board/read/${boardno}`);
  };

  const handleCategoryChange = async (categoryno) => {
    setSelectedCategory(categoryno);
    setWord('');
    if (categoryno === 'all') {
      await fetchBoardList(1, '');
      navigate(`/board/list_all/all/1`);
    } else {
      await fetchBoardListByCategory(categoryno, 1, '');
      navigate(`/board/list_category/${categoryno}/all/1`);
    }
  };

  const hasAttachment = (file1, size1) => {
    return file1 && size1 > 0;
  };

  return (
    <div className="board-page-container">
      <h1 className="board-title">도란도란</h1>
      <p className="board-subtitle">
        소소한 일상부터 속마음까지, <br />
        어르신들끼리 도란도란 이야기를 나눌 수 있는 공간입니다.
      </p>

      <CategoryGroupBar
        categoryGroup={categoryGroup}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />

      <hr className="board-divider" />

      {/* 검색 */}
      <div className="board-search-wrapper">
        <form onSubmit={handleSearch} className="board-search-form">
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="all">제목+내용</option>
            <option value="title">제목</option>
            <option value="reply">댓글</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={word}
            onChange={e => setWord(e.target.value)}
          />
          <button type="submit" className="green-btn">검색</button>
        </form>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="board-register-btn-wrapper">
        <a href={`/board/create/${categoryno}`} className="yellow-btn">글 쓰기</a>
      </div>

      {/* 게시판 테이블 */}
      <table className="board-table styled-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>조회</th>
            <th>추천</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {boardList.map((boardVO, index) => (
            <tr key={boardVO.boardno} onClick={() => handleRowClick(boardVO.boardno)}>
              <td>{boardList.length - index + (now_page - 1) * 10}</td>
              <td><span className="board-badge">{boardVO.categoryname}</span></td>
              <td>
                <div className="board-title-cell">
                  <span className="board-title-text">{boardVO.title}</span>
                  {hasAttachment(boardVO.file1, boardVO.size1) && (
                    <img src="/images/image_icon.png" alt="첨부" className="file-icon" />
                  )}
                </div>
              </td>
              <td>{boardVO.nickname}</td>
              <td>{boardVO.cnt}</td>
              <td>{boardVO.recom}</td>
              <td>{boardVO.rdate?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ 페이징 */}
      <div className="board-pagination-circles">
        <button
          className="arrow-btn"
          onClick={() => now_page > 1 && handlePageChange(now_page - 1)}
          disabled={now_page === 1}
        >
          &#8249;
        </button>

        {(() => {
          const pageSize = 5;
          const currentGroup = Math.floor((now_page - 1) / pageSize);
          const startPage = currentGroup * pageSize + 1;
          const endPage = Math.min(startPage + pageSize - 1, totalPage);

          return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNum = startPage + i;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`circle-page-btn ${now_page === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          });
        })()}

        <button
          className="arrow-btn"
          onClick={() => now_page < totalPage && handlePageChange(now_page + 1)}
          disabled={now_page === totalPage}
        >
          &#8250;
        </button>
      </div>

    </div>
  );
}

export default BoardPage;
