import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 카테고리 그룹 버튼 컴포넌트
function CategoryGroupBar({ categoryGroup, selected, onChange }) {
  return (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      gap: 12,
      padding: "14px 12px 10px 12px",
      background: "#f7f8fa",
      borderBottom: "1px solid #e5e6eb"
    }}>
      {/* 전체 카테고리 */}
      <button
        key="all"
        onClick={() => onChange('all')}
        style={{
          minWidth: 76,
          height: 40,
          background: "#fff",
          border: selected === 'all'
            ? "2px solid #4662e1"
            : "1.5px solid #dbe1ea",
          color: selected === 'all' ? "#4662e1" : "#36393f",
          borderRadius: 20,
          fontWeight: selected === 'all' ? 700 : 500,
          fontSize: 16,
          outline: "none",
          cursor: "pointer",
          boxShadow: selected === 'all'
            ? "0 0 0 2px #dbe5f9"
            : "0 1px 3px rgba(30,32,37,0.03)",
          transition: "border 0.2s, color 0.2s"
        }}
      >
        전체
      </button>
      {categoryGroup.map(categoryVO => (
        <button
          key={categoryVO.categoryno}
          onClick={() => onChange(String(categoryVO.categoryno))}
          style={{
            minWidth: 76,
            height: 40,
            background: "#fff",
            border: selected === String(categoryVO.categoryno)
              ? "2px solid #4662e1"
              : "1.5px solid #dbe1ea",
            color: selected === String(categoryVO.categoryno) ? "#4662e1" : "#36393f",
            borderRadius: 20,
            fontWeight: selected === String(categoryVO.categoryno) ? 700 : 500,
            fontSize: 16,
            outline: "none",
            cursor: "pointer",
            boxShadow: selected === String(categoryVO.categoryno)
              ? "0 0 0 2px #dbe5f9"
              : "0 1px 3px rgba(30,32,37,0.03)",
            transition: "border 0.2s, color 0.2s"
          }}
        >
          {categoryVO.name}
        </button>
      ))}
    </div>
  );
}


function BoardPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardList, setBoardList] = useState([]);

  const { categoryno } = useParams(); // categoryno는 문자열 (예: '3')
  const [selectedCategory, setSelectedCategory] = useState(categoryno || 'all');

  // const { categoryno } = useParams(0);  // URL에서 boardno 추출

  const navigate = useNavigate();

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

  // 카테고리 및 전체 데이터 처음 로딩 (카테고리 그룹 + 전체글)
  useEffect(() => {
    axios
      .get('/board/list_all')
      .then((res) => {
        console.log('useEffect: ' + res);
        setCategoryGroup(res.data.categoryGroup);
        setBoardList(res.data.boardList);
      })
      .catch((err) => {
        console.error('게시판 데이터 불러오기 실패:', err);
      });
  }, []);

  // 카테고리 선택 시 게시글 목록 불러오기
  const handleCategoryChange = async (categoryno) => {
    setSelectedCategory(categoryno);

    try {
      if (categoryno === 'all') {
        const res = await axios.get('/board/list_all');
        setSelectedCategory(res.data.categoryno);
        setBoardList(res.data.boardList);
        navigate(`/board/list_all`)
      } else {
        const res = await axios.get(`/board/list_category/${categoryno}`);
        navigate(`/board/list_category/${categoryno}`)
        setSelectedCategory(res.data.categoryno);
        setBoardList(res.data.listByCategoryBoard);
      }
    } catch (err) {
      alert('게시글 목록을 불러오지 못했습니다.');
    }
  };

  return (
    <div>
      <h1>전체 게시판 목록</h1>
      <hr />
      <a href={`/board/create/${categoryno}`}>등록</a>
      <hr />
      {/* 카테고리 그룹 버튼바 */}
      <CategoryGroupBar
        categoryGroup={categoryGroup}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr />

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
        {boardList.map((boardVO) => (
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
                  src="/board/storage/none1.png" 
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

    </div>
    
  );
}

export default BoardPage;
