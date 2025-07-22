import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useRecommend from './useRecommend';
import ReplyReportModal from './ReplyReportModal';
import './ReplySection.css';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function ReplySection({ boardno }) {
  const [allReplies, setAllReplies] = useState([]);         // 전체 댓글+답글 목록
  const [topComments, setTopComments] = useState([]);       // 댓글만 따로 저장
  const [replyMap, setReplyMap] = useState({});             // 답글 Map: parent_replyno → 답글 목록
  const [pagedComments, setPagedComments] = useState([]);   // 현재 페이지에 보여줄 댓글 목록
  const [newComment, setNewComment] = useState('');
  const [replyContents, setReplyContents] = useState({});
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetReplyNo, setReportTargetReplyNo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyTo, setReplyTo] = useState(null);
  const [replyLevel, setReplyLevel] = useState(1);
  const PAGE_SIZE = 5;

  const storedUser = localStorage.getItem("user");
  const loginMemberno = storedUser ? JSON.parse(storedUser).memberno : null;

  const { handleRecommend } = useRecommend(allReplies, setAllReplies);

  // ✅ 추천 후 allReplies 갱신되면 topComments 등도 다시 계산
  useEffect(() => {
    const top = [];
    const map = {};

    allReplies.forEach(reply => {
      if (reply.level === 1) {
        top.push(reply);
      } else {
        const parent = reply.parent_replyno;
        if (!map[parent]) map[parent] = [];
        map[parent].push(reply);
      }
    });

    setTopComments(top);
    setReplyMap(map);
    setTotalPages(Math.ceil(top.length / PAGE_SIZE));
    setPagedComments(top.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  }, [allReplies, page]);


  const fetchReplies = async () => {
    try {
      const res = await axios.get('/reply/m_list', {
        params: { boardno, page: 1, size: 999 } // 전체 받아오기
      });
      const all = res.data?.comments || [];

      const top = [];
      const map = {};

      all.forEach(reply => {
        if (reply.level === 1) {
          top.push(reply);
        } else {
          const parent = reply.parent_replyno;
          if (!map[parent]) map[parent] = [];
          map[parent].push(reply);
        }
      });

      setAllReplies(all);
      setTopComments(top);
      setReplyMap(map);
      setTotalPages(Math.ceil(top.length / PAGE_SIZE));
      setPage(1);
      setPagedComments(top.slice(0, PAGE_SIZE));
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  const changePage = (newPage) => {
    const start = (newPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setPagedComments(topComments.slice(start, end));
    setPage(newPage);
  };

  useEffect(() => {
    fetchReplies();
  }, [boardno]);

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

      if (isReply) {
        setReplyContents(prev => ({ ...prev, [parentReplyno]: '' }));
        setReplyTo(null);
        setReplyLevel(1);
      } else {
        setNewComment('');
      }

      fetchReplies();
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
        if (res.data.res === 1) fetchReplies();
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
          fetchReplies();
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
      {/* 댓글 작성 */}
      <div className="reply-form-wrap">
        <textarea
          className="reply-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="도란도란 나누는 말 한마디가 오늘을 웃게 합니다. 댓글로 따뜻한 마음을 전해보세요!"
        />
        <button
          type="button"
          className="reply-submit"
          onClick={(e) => handleReplySubmit(e, false)}
        >
          등록
        </button>
      </div>

      {/* 댓글 + 답글 리스트 */}
      <ul className="reply-list">
        {pagedComments.length === 0 ? (
          <div className="reply-empty">💬 아직 댓글이 없습니다.</div>
        ) : (
          pagedComments.map(reply => (
            <React.Fragment key={reply.replyno}>
              {/* 댓글 */}
              <li className={`reply-item level-${reply.level}`} style={{ paddingLeft: '0px' }}>
                <div className="reply-left">
                  <img
                    src={reply.profile ? `/member/storage/${reply.profile}` : '/images/default_profile.png'}
                    alt="프로필"
                    className="reply-profile"
                  />
                  <div className="reply-body">
                    <div className="reply-header">
                      <span className="reply-nickname">{reply.nickname}</span>
                      <span className="reply-date">
                        {reply.rdate}
                        <button
                          className="reply-btn-small"
                          onClick={() => {
                            setReplyTo(reply.replyno);
                            setReplyLevel(2);
                          }}
                        >
                          답글달기
                        </button>
                      </span>
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

                    {reply.replyno === replyTo && (
                      <form
                        className="reply-form-wrap reply-reply"
                        onSubmit={(e) => handleReplySubmit(e, true, reply.replyno, 2)}
                      >
                        <textarea
                          className="reply-input"
                          value={replyContents[reply.replyno] || ''}
                          onChange={e => setReplyContents({ ...replyContents, [reply.replyno]: e.target.value })}
                          placeholder="답글을 입력하세요"
                        />
                        <div className="reply-button-group">
                          <button type="submit" className="reply-submit">등록</button>
                          <button
                            type="button"
                            className="reply-cancel"
                            onClick={() => {
                              setReplyTo(null);
                              setReplyLevel(1);
                              setReplyContents(prev => ({ ...prev, [reply.replyno]: '' }));
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                <div className="reply-actions-right">
                  {reply.memberno === loginMemberno && (
                    <>
                      <button onClick={() => handleEdit(reply)}>수정</button>
                      <button onClick={() => handleDelete(reply)}>삭제</button>
                    </>
                  )}
                  <button onClick={() => handleRecommend(reply)} className={`reply-like-btn ${reply.isRecommended ? 'active' : ''}`}>
                    <i className={`fa-heart ${reply.isRecommended ? 'fas' : 'far'}`}></i>
                    <span className="reply-like-count">{reply.recommendCount || 0}</span>
                  </button>
                  <button onClick={() => handleReport(reply)} className="reply-report-btn">
                    <i className="fas fa-exclamation-triangle"></i> 신고
                  </button>
                </div>
              </li>

              {/* 답글들 출력 */}
              {replyMap[reply.replyno]?.map(child => (
                <li key={child.replyno} className="reply-item level-2" style={{ paddingLeft: '40px' }}>
                  <div className="reply-left">
                    <img
                      src={child.profile ? `/member/storage/${child.profile}` : '/images/default_profile.png'}
                      alt="프로필"
                      className="reply-profile"
                    />
                    <div className="reply-body">
                      <div className="reply-header">
                        <span className="reply-nickname">{child.nickname}</span>
                        <span className="reply-date">{child.rdate}</span>
                      </div>

                      {editingReplyNo === child.replyno ? (
                        <>
                          <textarea
                            className="reply-edit"
                            value={editingContent}
                            onChange={e => setEditingContent(e.target.value)}
                            rows="2"
                          />
                          <div className="reply-actions">
                            <button onClick={() => handleEditSave(child)}>저장</button>
                            <button onClick={handleEditCancel}>취소</button>
                          </div>
                        </>
                      ) : (
                        <div className={`reply-content ${child.blind === 1 ? 'reply-blind' : ''}`}>
                          {child.blind === 1
                            ? '🚫 신고 누적으로 블라인드 처리된 댓글입니다.'
                            : stripHtml(child.content)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="reply-actions-right">
                    {child.memberno === loginMemberno && (
                      <>
                        <button onClick={() => handleEdit(child)}>수정</button>
                        <button onClick={() => handleDelete(child)}>삭제</button>
                      </>
                    )}
                    <button onClick={() => handleRecommend(child)} className={`reply-like-btn ${child.isRecommended ? 'active' : ''}`}>
                      <i className={`fa-heart ${child.isRecommended ? 'fas' : 'far'}`}></i>
                      <span className="reply-like-count">{child.recommendCount || 0}</span>
                    </button>
                    <button onClick={() => handleReport(child)} className="reply-report-btn">
                      <i className="fas fa-exclamation-triangle"></i> 신고
                    </button>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))
        )}
      </ul>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="reply-pagination">
          <span className={`reply-page-arrow ${page === 1 ? 'disabled' : ''}`} onClick={() => changePage(1)}>« 처음</span>
          <span className={`reply-page-arrow ${page === 1 ? 'disabled' : ''}`} onClick={() => page > 1 && changePage(page - 1)}>‹ 이전</span>
          <span className="reply-page-info">{page} / {totalPages}</span>
          <span className={`reply-page-arrow ${page === totalPages ? 'disabled' : ''}`} onClick={() => page < totalPages && changePage(page + 1)}>다음 ›</span>
          <span className={`reply-page-arrow ${page === totalPages ? 'disabled' : ''}`} onClick={() => changePage(totalPages)}>끝 »</span>
        </div>
      )}

      {/* 신고 모달 */}
      <ReplyReportModal
        show={reportModalOpen}
        replyno={reportTargetReplyNo}
        onClose={() => {
          setReportModalOpen(false);
          setReportTargetReplyNo(null);
        }}
        onReportSuccess={() => fetchReplies()}
      />
    </div>
  );
}

export default ReplySection;
