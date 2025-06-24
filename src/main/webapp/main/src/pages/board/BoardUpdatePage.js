import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardUpdatePage() {
  const { boardno } = useParams();
  const navigate = useNavigate();
  
  const [boardVO, setBoardVO] = useState(null);
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1MF, setFile1MF] = useState(null);
  const [passwd, setPasswd] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || 
           lower.endsWith('jpeg') || 
           lower.endsWith('png') || 
           lower.endsWith('gif');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!passwd) {
      alert('패스워드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('boardno', boardno);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('passwd', passwd);
    
    if (file1MF) {
      formData.append('file1MF', file1MF);
    }

    try {
      const response = await axios.put('/board/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('수정이 완료되었습니다.');
        navigate(`/board/read/${boardno}`);
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('수정 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/board/update/${boardno}`);
        
        setBoardVO(response.data.boardVO);
        setCategoryGroup(response.data.categoryGroup || []);
        setTitle(response.data.boardVO.title);
        setContent(stripHtml(response.data.boardVO.content));
        
        // 기존 파일 정보가 있는 경우 설정
        if (response.data.boardVO.file1) {
          // 서버에서 파일 정보를 받아와서 설정
          // 실제 구현에서는 서버에서 파일 정보를 제공해야 함
        }
        
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        alert('게시글 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [boardno]);

  function stripHtml(html) {
    if (!html) return ''; // undefined, null, '' 모두 빈 문자열 반환
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  if (isLoading) {
    return <div className="text-center mt-5">로딩 중...</div>;
  }

  if (!boardVO) {
    return <div className="alert alert-danger mt-5">게시글 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">게시글 수정</h1>
      <hr />

      <div className="mb-4">
        {categoryGroup.map((category) => (
          <a 
            key={category.categoryno} 
            href={`/board/list_category/${category.categoryno}`} 
            className="badge bg-secondary me-2"
          >
            {category.name}
          </a>
        ))}
      </div>

      <form onSubmit={handleUpdate} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="form-control"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-control"
            rows="10"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">이미지 업로드</label>
          <input
            type="file"
            className="form-control"
            id="file1MF"
            name="file1MF"
            onChange={(e) => setFile1MF(e.target.files[0])}
            accept="image/*"
          />
          
          {/* 기존 이미지 표시 */}
          {boardVO.file1 && isImage(boardVO.file1) && (
            <div className="mt-2">
              <label className="form-label">현재 이미지</label>
              <div>
                <img 
                  src={`/storage/${boardVO.file1}`} 
                  alt="현재 게시글 이미지" 
                  className="img-thumbnail"
                  style={{ maxWidth: '200px' }}
                />
                <p className="small text-muted mt-1">{boardVO.file1}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">패스워드</label>
          <input
            type="password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            required
            className="form-control"
            placeholder="패스워드를 입력하세요"
          />
          <div className="form-text">게시글 수정을 위해 패스워드가 필요합니다</div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">수정</button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/board/read/${boardno}`)}
          >
            취소
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/board/list_category/${boardVO.categoryno}`)}
          >
            목록
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardUpdatePage;
