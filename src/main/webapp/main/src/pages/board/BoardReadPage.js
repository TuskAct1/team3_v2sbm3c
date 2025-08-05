// 📁 BoardReadPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import ReplySection from '../reply/ReplySection';
import BoardReportModal from './BoardReportModal';
import Breadcrumb from '../../components/Breadcrumb';
import './BoardReadPage.css';

function BoardReadPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardVO, setBoardVO] = useState({});
  const [isRecommended, setIsRecommended] = useState(false);
  const [recom, setRecom] = useState();
  const [showReport, setShowReport] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setCategoryno } = useOutletContext();

  const { boardno } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // 로그인 사용자 정보
  const memberno = parseInt(localStorage.getItem("memberno"), 10);

  const isImage = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png') || lower.endsWith('gif');
  };

  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    const passwd = window.prompt('게시글 등록시 입력한 비밀번호를 입력하세요.');
    if (!passwd) return;
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://121.78.128.139:9093/board/delete/${boardno}/${passwd}`);
      if (res.status === 200) {
        alert('삭제 완료!');
        navigate(`/board/list_all/all/1`);
      } else {
        alert(res.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else if (err.response?.status === 404) {
        alert('게시글을 찾을 수 없습니다.');
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRecommend = async () => {
    try {
      if (!isRecommended) {
        await axios.post(`http://121.78.128.139:9093/boardRecommend/${boardno}`);
        setBoardVO((prev) => ({
          ...prev,
          recom: prev.recom + 1,
        }));
      } else {
        await axios.delete(`http://121.78.128.139:9093/boardRecommend/${boardno}`);
        setBoardVO((prev) => ({
          ...prev,
          recom: Math.max(prev.recom - 1, 0),
        }));
      }
      setIsRecommended(!isRecommended);
    } catch (err) {
      alert('추천 처리 중 오류가 발생했습니다.');
    }
  };

  const fetchRecommendStatus = async () => {
    const res = await axios.get(`http://121.78.128.139:9093/boardRecommend/check/${boardno}`);
    setIsRecommended(res.data.recommended);
  };

  useEffect(() => {
    axios.get(`http://121.78.128.139:9093/board/read/${boardno}`).then((res) => {
      setCategoryGroup(res.data.categoryGroup);
      setBoardVO(res.data.boardVO);
      setLoading(false);
      setCategoryno(res.data.boardVO.categoryno);
    });
    fetchRecommendStatus();
  }, [boardno]);

  useEffect(() => {
    axios.get(`http://121.78.128.139:9093/boardRecommend/count/${boardno}`)
    .then((res) => {setRecom(res.data.recom); console.log(res.data.recom)});
  }, [boardno]);

  return (
    <div className="board-read">
      <div className="board-category-links">
        <a
          href="/board/list_all/all/1"
          className={boardVO.categoryno === null || boardVO.categoryno === undefined ? 'active' : ''}
        >
          전체
        </a>
        {categoryGroup.map((cat) => (
          <a
            key={cat.categoryno}
            href={`/board/list_category/${cat.categoryno}/all/1`}
            className={boardVO.categoryno === cat.categoryno ? 'active' : ''}
          >
            {cat.name}
          </a>
        ))}
      </div>

      <h1 className="board-read-title">{boardVO.title}</h1>

      <div className="board-meta-row">
        <div className="board-meta">
          {boardVO.rdate} · 조회 {boardVO.cnt} · 추천 {boardVO.recom}
        </div>

        {/* ✅ 작성자 본인일 때만 수정/삭제 버튼 보이기 */}
        {!loading && user?.memberno === boardVO.memberno && (
          <div className="board-buttons-right">
            <button onClick={() => navigate(`/board/update/${boardno}`)} className="board-btn update">수정</button>
            <button onClick={handleDelete} className="board-btn delete">삭제</button>
          </div>
        )}
      </div>

      <div className="board-divider-green"></div>

      {isImage(boardVO.file1) && (
        <img
          src={`/board/storage/${boardVO.file1saved}`}
          alt="첨부 이미지"
          className="board-image"
        />
      )}

      <div className="board-text">{stripHtml(boardVO.content)}</div>

      <div className="board-actions">
        <div className="action-button-group">
          <div className={`action-button recommend ${isRecommended ? 'active' : ''}`} onClick={handleRecommend}>
            <div className="icon-circle">
              <span className="icon">👍</span>
              <span className="label">추천</span>
            </div>
            <div className="count">{boardVO.recom}</div>
          </div>

          <div className={`action-button report ${isReported ? 'active' : ''}`} onClick={() => setShowReport(true)}>
            <div className="icon-circle">
              <span className="icon">🚨</span>
              <span className="label">신고</span>
            </div>
          </div>
        </div>
      </div>

      <BoardReportModal
        boardno={boardVO.boardno}
        show={showReport}
        onClose={() => setShowReport(false)}
        onReported={() => setIsReported(true)}
      />

      <div className="board-reply-section">
        <ReplySection boardno={boardno} />
      </div>

      <div className="board-bottom-buttons">
        <button
          onClick={() => navigate(`/board/list_all/all/1`)}
          className="board-btn list"
        >
          전체 목록
        </button>
      </div>
    </div>
  );
}

export default BoardReadPage;
