import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useRecommend from './useRecommend';
// 댓글 신고 모달
import ReplyReportModal from './ReplyReportModal';

function ReplySection({ boardno }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  // 댓글 신고 모달용 
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetReplyNo, setReportTargetReplyNo] = useState(null);

  const { handleRecommend } = useRecommend(replies, setReplies);

  const fetchReplies = () => {
    axios
      .get(`/reply/m_list?boardno=${boardno}`)
      .then((res) => {
        setReplies(res.data);
      })
      .catch((err) => console.error('댓글 불러오기 실패:', err));
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    axios
      .post('/reply/create', {
        boardno,
        content: newReply,
      })
      .then(() => {
        setNewReply('');
        fetchReplies();
      })
      .catch((err) => {
        console.error('댓글 등록 실패:', err);
        alert('로그인이 필요합니다.');
      });
  };

  const handleDelete = (reply) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    axios
      .post('/reply/delete', {
        replyno: reply.replyno,
        memberno: reply.memberno,
      })
      .then((res) => {
        if (res.data.res === 1) {
          fetchReplies();
        } else {
          alert('삭제 권한이 없습니다.');
        }
      })
      .catch((err) => console.error('삭제 실패:', err));
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
    axios
      .post('/reply/update', {
        replyno: reply.replyno,
        memberno: reply.memberno,
        content: editingContent,
      })
      .then((res) => {
        if (res.data.res === 1) {
          fetchReplies();
          setEditingReplyNo(null);
          setEditingContent('');
        } else {
          alert('수정 권한이 없습니다.');
        }
      })
      .catch((err) => console.error('수정 실패:', err));
  };

  // const handleReport = (reply) => {
  //   axios.post('/replyReport/report', { replyno: reply.replyno }, { withCredentials: true })
  //     .then((res) => {
  //       const result = res.data;
  //       if (result === -1) {
  //         alert('로그인이 필요합니다.');
  //       } else if (result === 0) {
  //         alert('이미 신고한 댓글입니다.');
  //       } else if (result === 1) {
  //         alert('신고가 접수되었습니다.');
  //       } else {
  //         alert('알 수 없는 응답');
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('신고 처리 실패:', err);
  //       alert('신고 중 오류가 발생했습니다.');
  //     });
  //   };

    const handleReport = (reply) => {
    setReportTargetReplyNo(reply.replyno);
    setReportModalOpen(true);
  };





  useEffect(() => {
    fetchReplies();
  }, [boardno]);

  return (
    <div style={{ marginTop: '40px' }}>
      <h4>댓글</h4>

      <form onSubmit={handleReplySubmit}>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          rows="3"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit" className="btn btn-primary btn-sm">
          댓글 등록
        </button>
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {replies.map((reply) => (
          <li
            key={reply.replyno}
            style={{
              display: 'flex',
              marginBottom: '15px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '10px',
            }}
          >
            <img
              src={reply.profile ? `/member/storage/${reply.profile}` : '/images/default_profile.png'}
              alt="프로필"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>
                {reply.nickname} ({reply.id})
              </div>
              <div style={{ fontSize: '0.9em', color: '#777' }}>{reply.rdate}</div>
              {editingReplyNo === reply.replyno ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows="2"
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                  <div style={{ marginTop: '5px' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleEditSave(reply)}
                      style={{ marginRight: '5px' }}
                    >
                      저장
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>
                      취소
                    </button>
                  </div>
                </>
              ) : (
                
                <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                  {reply.blind === 1 ? (
                    <i style={{ color: '#999' }}>🚫 신고 누적으로 블라인드 처리된 댓글입니다.</i>
                  ) : (
                    reply.content
                  )}
                </div>
              )}


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

                {/* 추천 버튼 */}
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleRecommend(reply)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      color: reply.isRecommended ? 'red' : 'gray',
                      marginRight: '5px',
                      fontSize: '16px',
                      userSelect: 'none',
                    }}
                  >
                    ❤
                  </span>
                  {reply.recommendCount || 0}
                </button>

                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => handleReport(reply)}
                  style={{ marginLeft: '5px' }}
                >
                  🚩 신고
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* 댓글 신고 모달 */}
        <ReplyReportModal
          show={reportModalOpen}
          replyno={reportTargetReplyNo}
          onClose={() => {
            setReportModalOpen(false);
            setReportTargetReplyNo(null);
          }}
          onReportSuccess={() => {
            fetchReplies();          // 댓글 목록 새로고침
          }}
        />

    </div>
  );
}

export default ReplySection;
