import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const BoardCreate = () => {
  const { categoryno: paramCategoryno } = useParams(); // URL에서 카테고리 번호 가져오기
  const [categoryno, setCategoryno] = useState(paramCategoryno ? String(paramCategoryno) : '');

  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryVO, setCategoryVO] = useState({});

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [passwd, setPasswd] = useState('');
  const [file1MF, setFile1MF] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  useEffect(() => {
    axios
        .get(`/board/list_all`)
        .then((res) => {
          setCategoryGroup(res.data.categoryGroup);
        })
        .catch((err) => {
          console.error('게시판 데이터 불러오기 실패:', err);
        });
  }, []);

  // 이미지 미리보기
  const handleFileChange = e => {
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!categoryno) {
        alert('카테고리를 선택해주세요.');
        return;
    }
  
    if (!passwd) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('categoryno', categoryno);
    formData.append('title', title);
    formData.append('content', content); // 리치에디터 내용
    if (file1MF) formData.append('file1MF', file1MF);
    formData.append('passwd', passwd);

    // 기타 필요한 필드 (카테고리, 회원 등) 추가 가능

    try {
      const response = await axios.post('/board/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status >= 200 && response.status < 300) {
        alert('게시글이 등록되었습니다!');
        window.location.href = '/board/list_all';
      } else {
        alert('등록 실패!');
      }
    } catch (err) {
      alert('서버 에러.');
    }
  };

  return (
    <div className="blog-form-container" style={{
      maxWidth: 720, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.07)', padding: 32
    }}>
      <div className='title_line'>
        <span className="title_line_text">{categoryVO.name}</span> &gt; 게시글 등록
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {paramCategoryno && (
          <div>
            <label>카테고리</label>
            <select
              className="form-control"
              value={categoryno}
              onChange={(e) => setCategoryno(e.target.value)}
              required
            >
              <option value="">카테고리 선택</option>
              {categoryGroup.map((categoryVO) => (
                <option key={categoryVO.categoryno} value={categoryVO.categoryno}>
                  {categoryVO.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{
            width: '100%',
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 24,
            border: 'none',
            borderBottom: '2px solid #eee',
            outline: 'none',
            padding: '8px 0'
          }}
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="내용을 입력하세요 (텍스트, 사진, 링크 등)"
          style={{
            height: 320,
            marginBottom: 24,
            background: '#fafbfc',
            borderRadius: 8
          }}
        />
        
        <div style={{ marginBottom: 20, padding: 20 }}>
          <label style={{ fontWeight: 500 }}>대표 이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && (
            <img src={imagePreview} alt="미리보기" style={{ maxWidth: 240, marginTop: 12, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          )}
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 500 }}>비밀번호</label>
          <input
            type="password"
            value={passwd}
            onChange={e => setPasswd(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
            style={{
              width: '100%',
              fontSize: 20,
              padding: '8px',
              marginTop: 8,
              border: '1px solid #ddd',
              borderRadius: 8
            }}
          />
        </div>

        <button type="submit" style={{
          padding: '12px 32px',
          background: '#1ec800',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          borderRadius: 12,
          fontSize: 18,
          cursor: 'pointer'
        }}>
          등록하기
        </button>
      </form>
    </div>
  );
};

export default BoardCreate;
