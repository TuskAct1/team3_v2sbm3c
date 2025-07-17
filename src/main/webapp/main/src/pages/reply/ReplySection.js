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

  const [replyTo, setReplyTo] = useState(null);
  const [replyLevel, setReplyLevel] = useState(1);

  const handleReplyButtonClick = (parentReplyno, level) => {
    setReplyTo(parentReplyno);
    setReplyLevel(level);
  };

  // // 댓글 조회 (페이징 포함)
  // const fetchReplies = async (pageNumber = 1) => {
  //   try {
  //     const res = await axios.get('/reply/m_list', {
  //       params: { boardno, page: pageNumber, size: PAGE_SIZE }
  //     });

  //     // 응답 구조 검사
  //     let list = [];

  //     if (Array.isArray(res.data)) {
  //       list = res.data;
  //     } else if (Array.isArray(res.data.comments)) {
  //       list = res.data.comments;
  //     } else {
  //       console.warn('❗ 댓글 응답이 배열이 아닙니다:', res.data);
  //     }

  //     setReplies(list); // ✅ 배열만 넣도록 보장
  //     setTotalPages(
  //       typeof res.data.totalPages === 'number'
  //         ? res.data.totalPages
  //         : Math.ceil(list.length / PAGE_SIZE)
  //     );
  //     setPage(pageNumber);
  //   } catch (err) {
  //     console.error('댓글 불러오기 실패:', err);
  //     setReplies([]); // 실패 시에도 기본값으로 배열 설정
  //   }
  // };
      
  const fetchReplies = async (pageNumber = 1) => {
    try {
      const res = await axios.get('/reply/m_list', {
        params: { boardno, page: pageNumber, size: PAGE_SIZE }
      });
      // res.data 가 object 인지, 그 안에 comments 배열이 있는지 검사
      const data = res.data || {};
      const comments = Array.isArray(data.comments) ? data.comments : [];
      const total = typeof data.totalPages === 'number' ? data.totalPages : 1;

      setReplies(comments);
      setTotalPages(total);
      setPage(pageNumber);

    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
      // 실패 시 빈 상태로 세팅
      setReplies([]);
      setTotalPages(1);
    }
  };




  // 게시판 번호 또는 페이지 변경 시 데이터 로드
useEffect(() => {
  fetchReplies(page);
}, [boardno, page]);

  const handleReplySubmit = async e => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const formData = new FormData();
      formData.append('boardno', boardno);
      formData.append('content', newReply);
      if (replyImage) formData.append('file', replyImage);  // ✅ 이미지 포함

      await axios.post(
        '/reply/create',
        {
          boardno,
          content: newReply,
          parent_replyno: replyTo,
          level: replyLevel
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

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
  {replies.map(reply => {
    const indent = (reply.level - 1) * 40;

    return (
      <li
        key={reply.replyno}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '15px',
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px',
          paddingLeft: `${indent}px`,       // 기본 들여쓰기
          boxSizing: 'border-box'
        }}
      >
        {/* level>1 일 때 ㄴ 마커 표시 */}
        {reply.level > 1 && (
          <span
            style={{
              position: 'absolute',
              left: `${indent - 10}px`,    // 들여쓰기 바로 왼쪽
              top: '1.2em',                 // 프로필 이미지 옆 텍스트 줄 맞춤
              color: '#777',
              fontSize: '1em',
              userSelect: 'none'
            }}
          >
            ㄴ
          </span>
        )}
      <img
        src={reply.profile ? `/member/storage/${reply.profile}` : '/images/default_profile.png'}
        alt="프로필"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: '10px'
        }}
      />

      {/* flex:1 컨테이너 안에 모아두면 레이아웃이 깨지지 않습니다 */}
      <div style={{ flex: 1 }}>
        {/* 1) 작성자 / 날짜 / 내용 */}
        <div style={{ fontWeight: 'bold' }}>
          {reply.nickname} ({reply.id})
        </div>
        <div style={{ fontSize: '0.9em', color: '#777' }}>
          {reply.rdate}
        </div>
        <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
          {reply.blind === 1
            ? <i style={{ color: '#999' }}>🚫 신고 누적으로 블라인드 처리된 댓글입니다.</i>
            : stripHtml(reply.content)
          }
        </div>

        {/* 2) 답글 버튼 (계층 제한) */}
        {reply.level <= 2 && (
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => handleReplyButtonClick(reply.replyno, reply.level + 1)}
            style={{ marginTop: '5px' }}
          >
            ↪ 답글
          </button>
        )}

        {/* 3) 수정 · 삭제 · 추천 · 신고 버튼 그룹 */}
        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleEdit(reply)}
            style={{ marginRight: '5px' }}
          >
            수정
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleDelete(reply)}
            style={{ marginRight: '5px' }}
          >
            삭제
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => handleRecommend(reply)}
            style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}
          >
            <span
              style={{
                color: reply.isRecommended ? 'red' : 'gray',
                marginRight: '5px',
                fontSize: '16px',
                userSelect: 'none'
              }}
            >
              ❤
            </span>
            {reply.recommendCount || 0}
          </button>
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => handleReport(reply)}
          >
            🚩 신고
          </button>
        </div>

        {/* 4) 버튼 그룹 바로 아래에 답글 폼 */}
        {reply.replyno === replyTo && reply.level < 3 && (
          <form
            onSubmit={handleReplySubmit}
            style={{
              marginTop: '10px',
              paddingLeft: `${reply.level * 20}px`
            }}
          >
            <textarea
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
              rows="2"
              placeholder="답글을 입력하세요"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div>
              <button
                type="submit"
                className="btn btn-sm btn-success"
                style={{ marginRight: '10px' }}
              >
                답글 등록
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setReplyTo(null);
                  setReplyLevel(1);
                  setNewReply('');
                }}
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
    </li>
    );
  })}
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
