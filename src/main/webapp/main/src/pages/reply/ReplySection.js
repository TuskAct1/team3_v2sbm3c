import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useRecommend from './useRecommend';
import ReplyReportModal from './ReplyReportModal';
import './ReplySection.css'; // ✅ CSS import

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function ReplySection({ boardno }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetReplyNo, setReportTargetReplyNo] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

  const { handleRecommend } = useRecommend(replies, setReplies);

  const fetchReplies = async (pageNumber = 1) => {
    try {
      const res = await axios.get('/reply/m_list', {
        params: { boardno, page: pageNumber, size: PAGE_SIZE }
      });

      const list = Array.isArray(res.data) ? res.data : res.data.comments || [];
      setReplies(list);
      setTotalPages(res.data.totalPages || Math.ceil(list.length / PAGE_SIZE));
      setPage(pageNumber);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
      setReplies([]);
    }
  };

  useEffect(() => {
    fetchReplies(page);
  }, [boardno]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await axios.post('/reply/create', {
        boardno,
        content: newReply
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setNewReply('');
      fetchReplies(1);
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('로그인이 필요합니다.');
    }
  };

  const handleDelete = (reply) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    axios.post('/reply/delete', {
      replyno: reply.replyno,
      memberno: reply.memberno
    })
      .then(res => {
        if (res.data.res === 1) fetchReplies(page);
        else alert('삭제 권한이 없습니다.');
      })
      .catch(err => console.error('삭제 실패:', err));
  };

  const handleEdit = (reply) => {
    setEditingReplyNo(reply.replyno);
    setEditingContent(reply.content);
  };

  const handleEditCancel = () => {
    setEditingReplyNo(null);
    setEditingContent('');
  };

  const handleEditSave = (reply) => {
    axios.post('/reply/update', {
      replyno: reply.replyno,
      memberno: reply.memberno,
      content: editingContent
    })
      .then(res => {
        if (res.data.res === 1) {
          fetchReplies(page);
          handleEditCancel();
        } else alert('수정 권한이 없습니다.');
      })
      .catch(err => console.error('수정 실패:', err));
  };

  const handleReport = (reply) => {
    setReportTargetReplyNo(reply.replyno);
    setReportModalOpen(true);
  };

  return (
    <div className="reply-section">
      {/* ✅ 댓글 작성 폼 */}
      <div className="reply-form-wrap">
        <textarea
          className="reply-input"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="도란도란 나누는 말 한마디가 오늘을 웃게 합니다. 댓글로 따뜻한 마음을 전해보세요!"
        />
        <button type="submit" className="reply-submit" onClick={handleReplySubmit}>
          등록
        </button>
      </div>

      {/* ✅ 댓글 리스트 */}
      <ul className="reply-list">
        {replies.length === 0 ? (
          <div className="reply-empty">
            💬 아직 등록된 댓글이 없습니다. <br />첫 댓글을 남겨보세요!
          </div>
        ) : (
          replies.map(reply => (
            <li key={reply.replyno} className="reply-item">
              <div className="reply-left">
                <img
                  src={reply.profile ? `/member/storage/${reply.profile}` : '/images/default_profile.png'}
                  alt="프로필"
                  className="reply-profile"
                />
                <div className="reply-body">
                  <div className="reply-header">
                    <span className="reply-nickname">{reply.nickname}</span>
                    <span className="reply-date">{reply.rdate}</span>
                  </div>

                  {editingReplyNo === reply.replyno ? (
                    <>
                      <textarea
                        className="reply-edit"
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                        rows="2"
                      />
                      <div className="reply-actions">
                        <button onClick={() => handleEditSave(reply)}>저장</button>
                        <button onClick={handleEditCancel}>취소</button>
                      </div>
                    </>
                  ) : (
                    <div className={`reply-content ${reply.blind === 1 ? 'reply-blind' : ''}`}>
                      {reply.blind === 1
                        ? '🚫 신고 누적으로 블라인드 처리된 댓글입니다.'
                        : stripHtml(reply.content)}
                    </div>
                  )}
                </div>
              </div>

              <div className="reply-actions-right">
                <button onClick={() => handleEdit(reply)}>수정</button>
                <button onClick={() => handleDelete(reply)}>삭제</button>
                <button
                  onClick={() => handleRecommend(reply)}
                  className={`reply-like-btn ${reply.isRecommended ? 'active' : ''}`}
                >
                  <i className={`fa-heart ${reply.isRecommended ? 'fas' : 'far'}`}></i>
                  <span className="reply-like-count">{reply.recommendCount || 0}</span>
                </button>

                <button
                  onClick={() => handleReport(reply)}
                  className="reply-report-btn"
                >
                  <i className="fas fa-exclamation-triangle"></i>
                  신고
                </button>

              </div>
            </li>
          ))
        )}
      </ul>

      {/* ✅ 페이징 */}
      {/* ✅ 페이징 */}
      {replies.length > 0 && (
        <div className="reply-pagination">
          <span
            className={`reply-page-arrow ${page === 1 ? 'disabled' : ''}`}
            onClick={() => page > 1 && fetchReplies(1)}
          >
            « 처음
          </span>
          <span
            className={`reply-page-arrow ${page === 1 ? 'disabled' : ''}`}
            onClick={() => page > 1 && fetchReplies(page - 1)}
          >
            ‹ 이전
          </span>
          <span className="reply-page-info">{page} / {totalPages}</span>
          <span
            className={`reply-page-arrow ${page === totalPages ? 'disabled' : ''}`}
            onClick={() => page < totalPages && fetchReplies(page + 1)}
          >
            다음 ›
          </span>
          <span
            className={`reply-page-arrow ${page === totalPages ? 'disabled' : ''}`}
            onClick={() => page < totalPages && fetchReplies(totalPages)}
          >
            끝 »
          </span>
        </div>
      )}

      {/* ✅ 신고 모달 */}
      <ReplyReportModal
        show={reportModalOpen}
        replyno={reportTargetReplyNo}
        onClose={() => {
          setReportModalOpen(false);
          setReportTargetReplyNo(null);
        }}
        onReportSuccess={() => fetchReplies(page)}
      />
    </div>
  );
}

export default ReplySection;
