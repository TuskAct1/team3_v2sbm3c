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

  const [newComment, setNewComment] = useState('');  // 일반 댓글 입력창용
  const [replyContents, setReplyContents] = useState({});  // 각 답글창에 대한 입력값 저장


  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetReplyNo, setReportTargetReplyNo] = useState(null);

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


  const fetchReplies = async (pageNumber = 1) => {
    try {
      const res = await axios.get('/reply/m_list', {
        params: { boardno, page: pageNumber, size: PAGE_SIZE }
      });

      const data = res.data || {};
      const comments = Array.isArray(data.comments) ? data.comments : [];
      const total = typeof data.totalPages === 'number' ? data.totalPages : 1;

      setReplies(comments);
      setTotalPages(total);
      setPage(pageNumber);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
      setReplies([]);
      setTotalPages(1);
    }
  };





  // 게시판 번호 또는 페이지 변경 시 데이터 로드
useEffect(() => {
  console.log("reply")
  fetchReplies(page);
}, [boardno, page]);




  // const handleReplySubmit = async (e) => {
  //   e.preventDefault();
  //   if (!newReply.trim()) return;

  //   try {
  //     const formData = new FormData();
  //     formData.append('boardno', boardno);
  //     formData.append('content', newReply);
  //     if (replyImage) formData.append('file', replyImage);  // ✅ 이미지 포함


  //     await axios.post(
  //       '/reply/create',
  //       {
  //         boardno,
  //         content: newReply,
  //         parent_replyno: replyTo,
  //         level: replyLevel
  //       },
  //       {
  //         withCredentials: true,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );

  //     await axios.post('/reply/create', {
  //       boardno,
  //       content: newReply
  //     }, {
  //       headers: { 'Content-Type': 'application/json' }
  //     });


  //     setNewReply('');
  //     fetchReplies(1);
  //   } catch (err) {
  //     console.error('댓글 등록 실패:', err);
  //     alert('로그인이 필요합니다.');
  //   }
  // };

const handleReplySubmit = async (e, isReply = false, parentReplyno = null, level = 1) => {
  e.preventDefault();

  const content = isReply
    ? replyContents[parentReplyno]?.trim()
    : newComment.trim();

  if (!content) return;

  try {
    await axios.post('/reply/create', {
      boardno,
      content,
      parent_replyno: isReply ? parentReplyno : null,
      level
    });

    // ✅ 여기 위치에서 상태 초기화!
    if (isReply) {
      // 답글 등록 성공 시
      setReplyContents(prev => ({ ...prev, [parentReplyno]: '' }));
      setReplyTo(null);
      setReplyLevel(1);
    } else {
      // 댓글 등록 성공 시
      setNewComment('');
    }

    fetchReplies(1); // 등록 후 목록 갱신
  } catch (err) {
    alert('댓글 등록 실패');
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
      <form onSubmit={(e) => handleReplySubmit(e, false)}>
        <textarea
          className="reply-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="도란도란 나누는 말 한마디가 오늘을 웃게 합니다. 댓글로 따뜻한 마음을 전해보세요!"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setReplyImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <button type="submit" className="btn btn-primary btn-sm">댓글 등록</button>
      </form>
    </div>
          

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
              src={reply.profile ? `/profile/${reply.profile}` : '/images/default_profile.png'}
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
                  onSubmit={(e) => handleReplySubmit(e, true, reply.replyno, reply.level + 1)}
                  style={{
                    marginTop: '10px',
                    paddingLeft: `${reply.level * 20}px`
                  }}
                >
                  <textarea
                    value={replyContents[reply.replyno] || ''}
                    onChange={e =>
                      setReplyContents({
                        ...replyContents,
                        [reply.replyno]: e.target.value
                      })
                    }
                    rows="2"
                    placeholder="답글을 입력하세요"
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <div>
                    <button type="submit" className="btn btn-sm btn-success" style={{ marginRight: '10px' }}>
                      답글 등록
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyLevel(1);
                        // 답글 작성 취소할 때 replyContents도 초기화
                        setReplyContents(prev => ({ ...prev, [reply.replyno]: '' }));
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
        <button
          type="button"  // ✅ form이 아닌 버튼이므로 'button'으로 바꿔야함
          className="btn btn-primary btn-sm"
          onClick={(e) => handleReplySubmit(e, false)}
        >
          댓글 등록
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
                  src={reply.profile ? `/profile/${reply.profile}` : '/images/default_profile.png'}
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
