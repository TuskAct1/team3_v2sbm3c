import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function BoardCreatePage() {
  const { categoryno: paramCategoryno } = useParams(); // URL에서 카테고리 번호 가져오기
  const [categoryGroup, setCategoryGroup] = useState([]);
  const navigate = useNavigate();

  const [categoryno, setCategoryno] = useState(paramCategoryno);
  const [categoryVO, setCategoryVO] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1MF, setFile1MF] = useState(null);
  const [passwd, setPasswd] = useState('1234');

  useEffect(() => {
    axios
        .get('/board/list_all')
        .then((res) => {
          setCategoryGroup(res.data.categoryGroup);
        })
        .catch((err) => {
          console.error('게시판 데이터 불러오기 실패:', err);
        });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryno) {
        alert('카테고리를 선택해주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('categoryno', categoryno);
    formData.append('title', title);
    formData.append('content', content);

    if (file1MF) {
      formData.append('file1MF', file1MF);
    }

    formData.append('passwd', passwd);

    try {
      const res = await fetch('/board/create', {
        method: 'POST',
        body: formData, // Content-Type 자동 설정됨
      });

      if (res.ok) {
        alert('등록 성공');
        navigate(`/board/list_category/${categoryno}`);
      } else {
        alert('등록 실패');
      }
    } catch (err) {
      console.error('등록 오류:', err);
      alert('에러 발생');
    }
  };

  return (
    <div>
      <div className='title_line'>
        <span className="title_line_text">{categoryVO.name}</span> &gt; 게시글 등록
      </div>

      <aside>
        <a href={`/board/create/${categoryno}`}>등록</a>
        <span>│</span>
        <a href={window.location.href}>새로고침</a>
      </aside>

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

        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="form-control"
            style={{ width: '100%' }}
            placeholder="제목"
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-control"
            rows="12"
            style={{ width: '100%' }}
            placeholder="내용"
          />
        </div>

        <div>
          <label>이미지</label>
          <input
            type="file"
            className="form-control"
            id="file1MF"
            name="file1MF"
            onChange={(e) => setFile1MF(e.target.files[0])}
          />
        </div>

        <div>
          <label>패스워드</label>
          <input
            type="password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            required
            className="form-control"
            style={{ width: '50%' }}
          />
        </div>

        <div className="content_body_bottom" style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-secondary btn-sm">등록</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(`/board/list_category/${categoryno}`)}>목록</button>
        </div>
      </form>
    </div>
  );
}

export default BoardCreatePage;
