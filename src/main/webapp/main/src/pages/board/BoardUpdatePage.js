import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import './NBoardCreate.css'; // ✅ 동일한 CSS 사용

function BoardUpdatePage() {
  const { boardno } = useParams();
  const navigate = useNavigate();
  
  const [boardVO, setBoardVO] = useState(null);
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryno, setCategoryno] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1MF, setFile1MF] = useState(null);
  const [passwd, setPasswd] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/board/update/${boardno}`);
        const board = response.data.boardVO;
        const categories = response.data.categoryGroup || [];

        setBoardVO(board);
        setCategoryGroup(categories);
        setCategoryno(String(board.categoryno)); // 현재 카테고리 선택
        setTitle(board.title);
        setContent(stripHtml(board.content));
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        alert('게시글 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [boardno]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile1MF(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!passwd) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('boardno', boardno);
    formData.append('categoryno', categoryno); // ✅ 추가
    formData.append('title', title);
    formData.append('content', content);
    formData.append('passwd', passwd);
    if (file1MF) formData.append('file1MF', file1MF);

    try {
      const response = await axios.put('/board/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert('수정이 완료되었습니다.');
        navigate(`/board/read/${boardno}`);
      } else {
        alert('수정 실패');
      }
    } catch (error) {
      console.error('수정 오류:', error);
      alert('서버 오류 발생');
    }
  };

  if (isLoading) return <div className="text-center mt-5">로딩 중...</div>;
  if (!boardVO) return <div className="alert alert-danger mt-5">게시글 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="board-create-wrap">
      <div className="board-create-title-line">게시글 수정</div>

      <form onSubmit={handleUpdate} className="board-create-form" encType="multipart/form-data">
        {/* ✅ 카테고리 수정 */}
        <div className="form-row">
          <label className="form-label">게시판</label>
          <select
            className="board-create-select"
            value={categoryno}
            onChange={(e) => setCategoryno(e.target.value)}
            required
          >
            <option value="">게시판을 선택해주세요</option>
            {categoryGroup.map((categoryVO) => (
              <option key={categoryVO.categoryno} value={categoryVO.categoryno}>
                {categoryVO.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="board-create-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="form-row form-full">
          <label className="form-label">내용</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            className="board-create-editor"
            placeholder="내용을 입력하세요 (텍스트, 사진, 링크 등)"
          />
        </div>

        <div className="form-row">
          <label className="form-label">사진 첨부</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
        </div>

        {boardVO.file1 && isImage(boardVO.file1) && (
          <div className="form-row form-full">
            <label className="form-label">현재 이미지</label>
            <img
              src={`/contents/storage/${boardVO.file1saved}`}
              alt="현재 이미지"
              className="board-create-preview"
            />
          </div>
        )}

        {imagePreview && (
          <div className="form-row form-full">
            <label className="form-label">새 이미지</label>
            <img src={imagePreview} alt="미리보기" className="board-create-preview" />
          </div>
        )}

        <div className="form-row">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            className="board-create-pass-input"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
          <button type="submit" className="board-create-submit-btn">수정하기</button>
        </div>
      </form>
    </div>
  );
}

export default BoardUpdatePage;
