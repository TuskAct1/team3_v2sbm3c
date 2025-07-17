import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useRecommend from './useRecommend';
import ReplyReportModal from './ReplyReportModal';

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

  // 페이징 상태
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

  const { handleRecommend } = useRecommend(replies, setReplies);

  const [replyImage, setReplyImage] = useState(null);

  // 댓글 조회 (페이징 포함)
  const fetchReplies = async (pageNumber = 1) => {
    try {
      const res = await axios.get('/reply/m_list', {
        params: { boardno, page: pageNumber, size: PAGE_SIZE }
      });

      // 응답 구조 검사
      let list = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data.comments)) {
        list = res.data.comments;
      } else {
        console.warn('❗ 댓글 응답이 배열이 아닙니다:', res.data);
      }

      setReplies(list); // ✅ 배열만 넣도록 보장
      setTotalPages(
        typeof res.data.totalPages === 'number'
          ? res.data.totalPages
          : Math.ceil(list.length / PAGE_SIZE)
      );
      setPage(pageNumber);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
      setReplies([]); // 실패 시에도 기본값으로 배열 설정
    }
  };

  // 게시판 번호 또는 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchReplies(page);
  }, [boardno]);

  const handleReplySubmit = async e => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const formData = new FormData();
      formData.append('boardno', boardno);
      formData.append('content', newReply);
      if (replyImage) formData.append('file', replyImage);  // ✅ 이미지 포함

      await axios.post('/reply/create', {
        boardno: boardno,
        content: newReply
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setNewReply('');
      setReplyImage(null);
      fetchReplies(1);
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('로그인이 필요합니다.');
    }
  };

  const handleDelete = reply => {
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

  const handleEdit = reply => {
    setEditingReplyNo(reply.replyno);
    setEditingContent(reply.content);
  };
  const handleEditCancel = () => {
    setEditingReplyNo(null);
    setEditingContent('');
  };
  const handleEditSave = reply => {
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

  const handleReport = reply => {
    setReportTargetReplyNo(reply.replyno);
    setReportModalOpen(true);
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h4>댓글</h4>
      {/*  댓글 등록 폼 */}
      <form onSubmit={handleReplySubmit} encType="multipart/form-data">
        <textarea
          value={newReply}
          onChange={e => setNewReply(e.target.value)}
          rows="3"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="댓글을 입력하세요"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setReplyImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <button type="submit" className="btn btn-primary btn-sm">댓글 등록</button>
      </form>

      {/* 댓글 리스트 */}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {replies.map(reply => (
          <li key={reply.replyno} style={{ display: 'flex', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <img
              src={reply.profile ? `/member/storage/${reply.profile}` : '/images/default_profile.png'}
              alt="프로필"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{reply.nickname} ({reply.id})</div>
              <div style={{ fontSize: '0.9em', color: '#777' }}>{reply.rdate}</div>

              {editingReplyNo === reply.replyno ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                    rows="2"
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                  <div style={{ marginTop: '5px' }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleEditSave(reply)} style={{ marginRight: '5px' }}>저장</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>취소</button>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                  {reply.blind === 1
                    ? <i style={{ color: '#999' }}>🚫 신고 누적으로 블라인드 처리된 댓글입니다.</i>
                    : stripHtml(reply.content)
                  }
                </div>
              )}

              <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(reply)} style={{ marginRight: '5px' }}>수정</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(reply)} style={{ marginRight: '5px' }}>삭제</button>
                <button className="btn btn-outline-success btn-sm" onClick={() => handleRecommend(reply)} style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                  <span style={{ color: reply.isRecommended ? 'red' : 'gray', marginRight: '5px', fontSize: '16px', userSelect: 'none' }}>❤</span>{reply.recommendCount || 0}
                </button>
                <button className="btn btn-outline-warning btn-sm" onClick={() => handleReport(reply)}>🚩 신고</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 페이징 컨트롤 */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={() => fetchReplies(1)} disabled={page === 1}>« 처음</button>
        <button onClick={() => fetchReplies(page - 1)} disabled={page === 1}>‹ 이전</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => fetchReplies(page + 1)} disabled={page === totalPages}>다음 ›</button>
        <button onClick={() => fetchReplies(totalPages)} disabled={page === totalPages}>끝 »</button>
      </div>

      {/* 댓글 신고 모달 */}
      <ReplyReportModal
        show={reportModalOpen}
        replyno={reportTargetReplyNo}
        onClose={() => { setReportModalOpen(false); setReportTargetReplyNo(null); }}
        onReportSuccess={() => fetchReplies(page)}
      />
    </div>
  );
}

export default ReplySection;
