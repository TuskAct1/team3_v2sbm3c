import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardReadPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardVO, setBoardVO] = useState([]);
  const { boardno } = useParams(); // URL에서 boardno 추출

  const navigate = useNavigate();

  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  function stripHtml(html) {
    if (!html) return ''; // undefined, null, '' 모두 빈 문자열 반환
    // 모든 태그 제거, &nbsp; 등도 변환
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }


  const handleDelete = (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      axios
        .delete(`/board/delete/${boardno}`)
      
      navigate(`/board/list_all`)
      console.log('삭제처리');
    }
  };

  useEffect(() => {
    axios
      .get(`/board/read/${boardno}`)
      .then((res) => {
        setCategoryGroup(res.data.categoryGroup);
        setBoardVO(res.data.boardVO);
      })
      .catch((err) => {
        console.error('게시판 데이터 불러오기 실패:', err);
      });
  }, [boardno]);

  return (
    <div>
      <h1>게시글 조회</h1>

      <hr />
      <div>
        {categoryGroup.map((CategoryVO) => (
          <a key={CategoryVO.categoryno} href={`/board/list_category/${CategoryVO.categoryno}`} style={{ marginRight: '10px' }}>
            {CategoryVO.name}
          </a>
        ))}
      </div>
      
      <fieldset style={{ border: '1px solid #ccc', padding: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <div style={{ width: '100%', wordBreak: 'break-word' }}>
              {isImage(boardVO.file1) && (
                <img
                  src={`/board/storage/${boardVO.file1saved}`}
                  alt="첨부 이미지"
                  style={{ width: '50%', float: 'left', marginTop: '0.5%', marginRight: '1%' }}
                />
              )}

              <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{boardVO.title}</span>
              <span style={{ fontSize: '1em', marginLeft: '10px' }}>{boardVO.rdate}</span>
              <br />
              <br />
              <div style={{ whiteSpace: 'pre-wrap', clear: 'both' }}>
                <span>{stripHtml(boardVO.content)}</span>
              </div>
            </div>
          </li>
        </ul>

        <div style={{ marginTop: '20px', clear: 'both' }}>
          <button onClick={handleDelete} className="btn btn-secondary btn-sm" style={{ marginRight: '10px' }}>
            삭제
          </button>
          <button onClick={() => navigate(`/board/list_category/${boardVO.categoryno}`)} className="btn btn-secondary btn-sm">
            목록
          </button>
          <button onClick={() => navigate(`/board/update/${boardno}`)} className="btn btn-secondary btn-sm">
            수정
          </button>
        </div>
      </fieldset>
    </div>
  );
}

export default BoardReadPage;
