import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReplySection({ boardno }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');


  const fetchReplies = () => {
    axios
      .get(`/reply/m_list?boardno=${boardno}`)
      .then((res) => {
        // 추천 수와 내가 추천했는지 여부를 백엔드에서 포함해서 받아온다고 가정
        // 예: res.data = [{ replyno, content, recommendCount, isRecommended, ... }, ...]
        setReplies(res.data);
      })
      .catch((err) => console.error('댓글 불러오기 실패:', err));
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    axios
      .post('/reply/create', {
        boardno: boardno,
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

  // 추천 처리: replyRecommend/create_session 호출
  const handleRecommend = (reply) => {
  // 추천 여부 확인
  axios.get(`/replyRecommend/hartCnt?replyno=${reply.replyno}`, { withCredentials: true })
    .then((res) => {
      if (res.data > 0) {
        // 이미 추천했으면 추천 취소 시도
        axios.delete(`/replyRecommend/delete_by_reply_member/${reply.replyno}`, { withCredentials: true })
          .then((res) => {
            if (res.data > 0) {
              alert('추천이 취소되었습니다.');
              // 추천 취소 성공 시 상태 업데이트
              setReplies((prevReplies) =>
                prevReplies.map((r) =>
                  r.replyno === reply.replyno
                    ? {
                        ...r,
                        recommendCount: Math.max((r.recommendCount || 1) - 1, 0),
                        isRecommended: false,
                      }
                    : r
                )
              );
            } else {
              alert('추천 취소 실패');
            }
          })
          .catch((err) => {
            console.error('추천 취소 실패:', err);
            alert('추천 취소 중 오류가 발생했습니다.');
          });
      } else {
        // 추천 안 했으면 추천 등록
        axios.post('/replyRecommend/create_session', { replyno: reply.replyno }, { withCredentials: true })
          .then((res) => {
            if (res.data === 1) {
              alert('추천이 등록되었습니다.');
              // 추천 성공 시 상태 업데이트
              setReplies((prevReplies) =>
                prevReplies.map((r) =>
                  r.replyno === reply.replyno
                    ? {
                        ...r,
                        recommendCount: (r.recommendCount || 0) + 1,
                        isRecommended: true,
                      }
                    : r
                )
              );
            } else {
              alert('추천 등록 실패');
            }
          })
          .catch((err) => {
            console.error('추천 등록 실패:', err);
            alert('추천 등록 중 오류가 발생했습니다.');
          });
      }
    })
    .catch((err) => {
      console.error('추천 상태 확인 실패:', err);
    });
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
                <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{reply.content}</div>
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

                {/* 추천 버튼: 하트 문자 + 추천 수 표시 */}
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
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReplySection;
