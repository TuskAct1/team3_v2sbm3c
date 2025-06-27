import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReplySection from '../reply/ReplySection';
import BoardReportModal from './BoardReportModal';

function BoardReadPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardVO, setBoardVO] = useState({});
  const [recommendCount, setRecommendCount] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);

  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [showReport, setShowReport] = useState(false);

  const { boardno } = useParams();
  const navigate = useNavigate();

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
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      await axios.delete(`/board/delete/${boardno}`);
      navigate(`/board/list_all/all/1`);
    }
  };

  // 추천(좋아요) 토글
  const handleRecommend = async () => {
    try {
      if (!isRecommended) {
        await axios.post(`/boardRecommend/${boardno}`);
      } else {
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
    setRecommendCount(countRes.data.count);
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
              &nbsp; {recommendCount}
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
        <BoardReportModal boardno={boardVO.boardno} show={showReport} onClose={() => setShowReport(false)} />
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
    </div>
  );
}

export default BoardReadPage;
