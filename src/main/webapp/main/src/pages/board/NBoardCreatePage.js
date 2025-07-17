import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './NBoardCreate.css'; // ✅ CSS import

const BoardCreate = () => {
  const { categoryno: paramCategoryno } = useParams();
  const [categoryno, setCategoryno] = useState(paramCategoryno ? String(paramCategoryno) : '');
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryVO, setCategoryVO] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [passwd, setPasswd] = useState('');
  const [file1MF, setFile1MF] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 카테고리 목록 불러오기
  useEffect(() => {
    axios
      .get(`/board/list_all?word=all&now_page=1`)
      .then((res) => setCategoryGroup(res.data.categoryGroup))
      .catch((err) => console.error('게시판 데이터 불러오기 실패:', err));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryno) return alert('카테고리를 선택해주세요.');
    if (!passwd) return alert('비밀번호를 입력해주세요.');

    const formData = new FormData();
    formData.append('categoryno', categoryno);
    formData.append('title', title);
    formData.append('content', content);
    if (file1MF) formData.append('file1MF', file1MF);
    formData.append('passwd', passwd);

    try {
      const response = await axios.post('/board/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status >= 200 && response.status < 300) {
        alert('게시글이 등록되었습니다!');
        window.location.href = '/board/list_all/all/1';
      } else {
        alert('등록 실패!');
      }
    } catch (err) {
      alert('서버 에러.');
    }
  };

  return (
    <div className="board-create-wrap">
      <div className="board-create-title-line">
        <span>{categoryVO.name}</span> 게시글 등록
      </div>

      <form onSubmit={handleSubmit} className="board-create-form" encType="multipart/form-data">
        {paramCategoryno && (
          <div className="form-row">
            <label>게시판</label>
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
        )}

        <div className="form-row">
          <label>제목</label>
          <input
            type="text"
            className="board-create-title-input"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 에디터는 세로로 */}
        <div className="form-row form-full">
          <label className="form-label">내용</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요 (텍스트, 사진, 링크 등)"
            className="board-create-editor"
          />
        </div>

        {/* 사진 첨부를 한 줄에 맞추기 */}
        <div className="form-row">
          <label className="form-label">사진 첨부</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
        </div>

        {imagePreview && (
          <div className="form-row">
            <img src={imagePreview} alt="미리보기" className="board-create-preview" />
          </div>
        )}

        <div className="form-row">
          <label>비밀번호</label>
          <input
            type="password"
            className="board-create-pass-input"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
          <button type="submit" className="board-create-submit-btn">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardCreate;
