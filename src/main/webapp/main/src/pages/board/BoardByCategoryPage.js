import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryGroupBar from './CategoryGroupBar';
import './BoardPage.css'; // ✅ 통일된 스타일 사용

function BoardByCategoryPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [listByCategoryBoard, setListByCategoryBoard] = useState([]);
  const [categoryVO, setCategoryVO] = useState({});
  const [searchType, setSearchType] = useState('all');
  const [word, setWord] = useState('');
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { categoryno } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoryno || 'all');
  const navigate = useNavigate();

  const fetchBoardList = async (page = 1, searchWord = '', catNo = categoryno, searchTypeParam = searchType) => {
    const queryWord = searchWord && searchWord.trim() !== '' ? searchWord : 'all';
    if (!catNo || catNo === 'all' || catNo === undefined) {
      try {
        const res = await axios.get(`/board/list_all`);
        setCategoryGroup(res.data.categoryGroup);
        setListByCategoryBoard(res.data.boardList);
        setTotalPage(res.data.totalPage || 1);
        setNowPage(page);
        setWord(queryWord === 'all' ? '' : queryWord);
      } catch (err) {
        alert('전체글을 불러오지 못했습니다.123');
      }
      return;
    }

    try {
      const res = await axios.get(`/board/list_category/${catNo}?word=${queryWord}&now_page=${page}&searchType=${searchTypeParam}`);
      setCategoryGroup(res.data.categoryGroup);
      setCategoryVO(res.data.categoryVO);
      setListByCategoryBoard(res.data.listByCategoryBoard);
      setTotalPage(res.data.totalPage || 1);
      setNowPage(res.data.now_page || page);
      setWord(res.data.word === 'all' ? '' : res.data.word);
    } catch (err) {
      alert('게시글 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchBoardList();
  }, [categoryno]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoardList(1, word, selectedCategory, searchType);
    if (selectedCategory !== 'all')
      navigate(`/board/list_category/${selectedCategory}/${word && word.trim() !== '' ? word : 'all'}/1`);
  };

  const handlePageChange = (page) => {
    fetchBoardList(page, word, selectedCategory);
    if (selectedCategory !== 'all')
      navigate(`/board/list_category/${selectedCategory}/${word && word.trim() !== '' ? word : 'all'}/${page}`);
  };

  const handleRowClick = (boardno) => {
    navigate(`/board/read/${boardno}`);
  };

  const truncateContent = (content) => {
    if (!content) return '';
    return content.length > 160 ? `${content.substring(0, 160)}...` : content;
  };

  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  const handleCategoryChange = async (categoryno) => {
    setSelectedCategory(categoryno);
    setWord('');

    if (categoryno === 'all' || categoryno === undefined) {
      try {
        const res = await axios.get('/board/list_all');
        setListByCategoryBoard(res.data.boardList);
        setNowPage(1);
        setTotalPage(res.data.totalPage || 1);
        navigate(`/board/list_all/all/1`);
      } catch (err) {
        alert('전체글을 불러오지 못했습니다.');
      }
      return;
    }

    fetchBoardList(1, '', categoryno);
    navigate(`/board/list_category/${categoryno}/all/1`);
  };

  return (
    <div className="board-page-container">
      <h1 className="board-title">{categoryVO.name} 게시판</h1>

      <CategoryGroupBar
        categoryGroup={categoryGroup}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr className="board-divider" />

      {/* ✅ 검색창 가운데 정렬 */}
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

      {/* ✅ 등록 버튼은 테이블 위 오른쪽 정렬 */}
      <div className="board-register-btn-wrapper">
        <a href={`/board/create/${categoryno}`} className="yellow-btn">글 쓰기</a> 
      </div>

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
          {listByCategoryBoard.map((boardVO, index) => (
            <tr key={boardVO.boardno} onClick={() => handleRowClick(boardVO.boardno)} className="board-row">
              <td>{listByCategoryBoard.length - index + (nowPage - 1) * 10}</td>
              <td>
                <span className="board-badge">
                  {boardVO.categoryname}
                </span>
              </td>
              <td>
                <div className="board-title-text">{boardVO.title}</div>
              </td>
              <td>{boardVO.nickname}</td>
              <td>{boardVO.cnt}</td>
              <td>{boardVO.recom}</td>
              <td>{boardVO.rdate?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="board-pagination">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={nowPage === pageNum}
            className={nowPage === pageNum ? 'page-btn active' : 'page-btn'}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );

}

export default BoardByCategoryPage;