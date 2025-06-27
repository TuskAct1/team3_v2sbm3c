import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryGroupBar from './CategoryGroupBar';

function BoardByCategoryPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [listByCategoryBoard, setListByCategoryBoard] = useState([]);
  const [categoryVO, setCategoryVO] = useState({});
  const [boardList, setBoardList] = useState({});

  const [word, setWord] = useState('');
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { categoryno } = useParams(); // categoryno는 문자열 (예: '3')
  const [selectedCategory, setSelectedCategory] = useState(categoryno || 'all');

  const navigate = useNavigate();

  // 게시글 목록 불러오기
  const fetchBoardList = async (page = 1, searchWord = '', catNo = categoryno) => {
  const queryWord = searchWord && searchWord.trim() !== '' ? searchWord : 'all';
  if (!catNo || catNo === 'all' || catNo === undefined) {
    // 전체글 목록
    try {
      const res = await axios.get(`/board/list_all/all/1`);
      setCategoryGroup(res.data.categoryGroup);
      setListByCategoryBoard(res.data.boardList);
      setTotalPage(res.data.totalPage || 1);
      setNowPage(page);
      setWord(queryWord === 'all' ? '' : queryWord);
    } catch (err) {
      alert('전체글을 불러오지 못했습니다.123');
    }
    return;
  };

  try {
    const res = await axios.get(`/board/list_category/${catNo}/${queryWord}/${page}`);
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

  // 검색 버튼 클릭
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoardList(1, word, selectedCategory); // 첫 페이지, 검색어, 선택된 카테고리
    if(selectedCategory !== 'all')
      navigate(`/board/list_category/${selectedCategory}/${word && word.trim() !== '' ? word : 'all'}/1`);
  };

  // 페이지 이동
  const handlePageChange = (page) => {
    fetchBoardList(page, word, selectedCategory);
    if(selectedCategory !== 'all')
      navigate(`/board/list_category/${selectedCategory}/${word && word.trim() !== '' ? word : 'all'}/${page}`);
  };


  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  // 게시글 읽기 페이지로 이동
  const handleRowClick = (boardno) => {
    navigate(`/board/read/${boardno}`);
  };

  // 내용을 160자로 제한
  const truncateContent = (content) => {
    if (!content) return '';
    return content.length > 160 ? `${content.substring(0, 160)}...` : content;
  };


  function stripHtml(html) {
    if (!html) return ''; // undefined, null, '' 모두 빈 문자열 반환
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  // 카테고리 선택 시 게시글 목록 불러오기
  const handleCategoryChange = async (categoryno) => {
    setSelectedCategory(categoryno);
    setWord(''); // 검색어 리셋

    if (categoryno === 'all' | categoryno === undefined) {
      try {
        const res = await axios.get('/board/list_all/all/1');
        setListByCategoryBoard(res.data.boardList);
        setNowPage(1);
        setTotalPage(res.data.totalPage || 1);
        navigate(`/board/list_all/all/1`);
      } catch (err) {
        alert('전체글을 불러오지 못했습니다.');
      }
      return;
    }
    // categoryno로 목록+검색+1페이지 조회
    fetchBoardList(1, '', categoryno);
    navigate(`/board/list_category/${categoryno}/all/1`);
  };
  
  return (
    <div>
      <h1>{categoryVO.name} 목록</h1>

      <a href={`/board/create/${categoryno}`}>등록</a>

      {/* 카테고리 그룹 버튼바 */}
      <CategoryGroupBar
        categoryGroup={categoryGroup}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr />
      
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} style={{ margin: '16px 0' }}>
        <input
          type="text"
          placeholder="검색어 입력"
          value={word}
          onChange={e => setWord(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', width: 220, marginRight: 10 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>검색</button>
      </form>

      <table className="table table-striped" style={{ width: '100%' }}>
      <colgroup>
        <col style={{ width: '10%' }} />
        <col style={{ width: '80%' }} />
        <col style={{ width: '10%' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="th_bs">파일</th>
          <th className="th_bs">제목</th>
          <th className="th_bs">조회수</th>
        </tr>
      </thead>
      
      <tbody>
        {listByCategoryBoard.map((boardVO) => (
          <tr 
            key={boardVO.boardno} 
            onClick={() => handleRowClick(boardVO.boardno)}
            style={{ cursor: 'pointer' }}
          >
            <td className="td_basic" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', verticalAlign: 'middle', textAlign: 'center' }}>
              {isImage(boardVO.file1) && boardVO.size1 > 0 ? (
                // 이미지 파일인 경우 썸네일 표시
                <img 
                  src={`/board/storage/${boardVO.thumb1}`} 
                  alt={boardVO.title} 
                  style={{ width: '120px', height: '90px', objectFit: 'cover' }} 
                />
              ) : boardVO.size1 > 0 ? (
                // 이미지가 아닌 파일인 경우 파일명 표시
                <div className="file-name">
                  <i className="bi bi-file-earmark"></i>
                  <span>{boardVO.file1}</span>
                </div>
              ) : (
                // 파일이 없는 경우 플레이스홀더 이미지
                <img 
                  src="./images/none1.png" 
                  alt="No file" 
                  style={{ width: '120px', height: '90px' }} 
                />
              )}
            </td>
            <td className="td_left">
              <div>
                <span>{boardVO.title}</span>
              </div>
              <div>
                <span>{stripHtml(truncateContent(boardVO.content))}</span>
              </div>
            </td>
            <td className="td_left">
              <div>
                <span>{boardVO.cnt}</span>
              </div>
            </td>
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
            disabled={nowPage === pageNum}
            style={{
              margin: '0 2px',
              padding: '6px 12px',
              borderRadius: 4,
              background: nowPage === pageNum ? '#4662e1' : '#fff',
              color: nowPage === pageNum ? '#fff' : '#4662e1',
              border: '1px solid #4662e1',
              fontWeight: nowPage === pageNum ? 700 : 500,
              cursor: nowPage === pageNum ? 'default' : 'pointer',
            }}
          >
            {pageNum}
          </button>
        ))}
      </div>

    </div>
  );
}

export default BoardByCategoryPage;
