import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReplySection from '../reply/ReplySection';
import BoardReportModal from './BoardReportModal';

function BoardReadPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardVO, setBoardVO] = useState({});
  // const [recommendCount, setRecommendCount] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [recom, setRecom] = useState();

  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [showReport, setShowReport] = useState(false);

  const { boardno } = useParams();
  const navigate = useNavigate();

  const memberno = parseInt(localStorage.getItem("memberno"), 10); // ✅ 추가


  // 이미지 체크
  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  // HTML 태그 제거
  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  // 삭제
  const handleDelete = async (e) => {
  e.preventDefault();
  const passwd = window.prompt('게시글 등록시 입력한 비밀번호를 입력하세요.');
  if (!passwd) return;

  const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`/board/delete/${boardno}/${passwd}`);
    if (res.status === 200) {
      alert('삭제 완료!');
      navigate(`/board/list_all/all/1`);
    } else {
      alert(res.data);
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      alert('비밀번호가 일치하지 않습니다.');
    } else if (err.response && err.response.status === 404) {
      alert('게시글을 찾을 수 없습니다.');
    } else {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};

  // 추천(좋아요) 토글
  const handleRecommend = async () => {
    try {
      if (!isRecommended) {
        setIsRecommended(true);
        setRecom(prev => prev + 1);
        await axios.post(`/boardRecommend/${boardno}`);
      } else {
        setIsRecommended(false);
        setRecom(prev => Math.max(prev - 1, 0));
        await axios.delete(`/boardRecommend/${boardno}`);
      }
      fetchRecommendStatus();
    } catch (err) {
      alert('추천 처리 중 오류가 발생했습니다.');
    }
  };

  // 추천 상태/수 불러오기
  const fetchRecommendStatus = async () => {
    const [statusRes, countRes] = await Promise.all([
      axios.get(`/boardRecommend/check/${boardno}`),
      axios.get(`/boardRecommend/count/${boardno}`)
    ]);
    setIsRecommended(statusRes.data.recommended);
  };

  useEffect(() => {
    // 게시글 정보
    axios.get(`/board/read/${boardno}`)
      .then((res) => {
        setCategoryGroup(res.data.categoryGroup);
        setBoardVO(res.data.boardVO);
      })
      .catch(() => {});

    fetchRecommendStatus();
  }, [boardno]);

  useEffect(() => {
    // 추천 수 증가
    axios.get(`/boardRecommend/count/${boardno}`)
      .then((res) => {
        setRecom(res.data.recom);
        // console.log(res.data.recom);
        // setBoardVO(res.data.boardVO);
      })
      .catch(() => {});
  }, [boardno]);

  return (
    <div style={{
      maxWidth: 800,
      margin: '36px auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
      padding: 32
    }}>
      <div style={{ marginBottom: 20 }}>
        {categoryGroup.map(CategoryVO => (
          <a
            key={CategoryVO.categoryno}
            href={`/board/list_category/${CategoryVO.categoryno}/all/1`}
            style={{
              marginRight: 12,
              textDecoration: 'none',
              color: '#4662e1',
              fontWeight: boardVO.categoryno === CategoryVO.categoryno ? 700 : 400
            }}
          >
            {CategoryVO.name}
          </a>
        ))}
      </div>


      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
        {/* 첨부 이미지 */}
        {isImage(boardVO.file1) && (
          <img
            src={`/board/storage/${boardVO.file1saved}`}
            alt="첨부 이미지"
            style={{
              width: 220,
              height: 160,
              objectFit: 'cover',
              borderRadius: 12,
              marginRight: 24,
              boxShadow: '0 2px 8px rgba(70,98,225,0.08)'
            }}
          />
        )}
        {/* 게시글 정보 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            {boardVO.title}
          </div>
          <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>
            작성일: {boardVO.rdate} &nbsp;|&nbsp; 조회수: {boardVO.cnt}
          </div>
          <div style={{ margin: '24px 0', fontSize: 18, lineHeight: 1.7, minHeight: 120 }}>
            {/* 내용: HTML 허용 시 dangerouslySetInnerHTML 사용 */}
            <span>{stripHtml(boardVO.content)}</span>
          </div>
          <div>
            {/* 추천(좋아요) 버튼 */}
            <button
              onClick={handleRecommend}
              style={{
                padding: '10px 24px',
                background: isRecommended ? '#4662e1' : '#fff',
                color: isRecommended ? '#fff' : '#4662e1',
                fontWeight: 700,
                border: `2px solid #4662e1`,
                borderRadius: 24,
                fontSize: 17,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isRecommended ? '❤️ 추천 취소' : '🤍 추천'}
              &nbsp; {boardVO.recom}
            </button>
          </div>
            <div style={{ marginTop: '18px', textAlign: 'right' }}>
              <button onClick={() => setShowReport(true)} style={{
                background: '#f23d4b', color: '#fff', border: 'none',
                padding: '7px 18px', borderRadius: 7, fontWeight: 600, fontSize: 15, marginRight: 10
              }}>
              신고
              </button>
          </div>
        <BoardReportModal boardno={boardVO.boardno} show={showReport} memberno={memberno} onClose={() => setShowReport(false)} />
        </div>
      </div>

      {/* 댓글 */}
      <div style={{ margin: '36px 0 16px 0' }}>
        <ReplySection boardno={boardno} />
      </div>

      {/* 하단 버튼 */}
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <button
          onClick={handleDelete}
          className="btn btn-secondary btn-sm"
          style={{ background: '#fff', color: '#f55', border: '1px solid #fbb', borderRadius: 8, fontWeight: 600 }}
        >
          삭제
        </button>
        <button
          onClick={() => navigate(`/board/list_category/${boardVO.categoryno}`)}
          className="btn btn-secondary btn-sm"
          style={{ background: '#4662e1', color: '#fff', borderRadius: 8, fontWeight: 600 }}
        >
          목록
        </button>
        <button
          onClick={() => navigate(`/board/update/${boardno}`)}
          className="btn btn-secondary btn-sm"
          style={{ background: '#5db14b', color: '#fff', borderRadius: 8, fontWeight: 600 }}
        >
          수정
        </button>
      </div>

              {/* <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{boardVO.title}</span>
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
        <ReplySection boardno={boardno} />
      </fieldset> */}
    </div>
  );
}

export default BoardReadPage;
