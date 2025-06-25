import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReplySection({ boardno }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // 항상 memberno=1로 테스트
  const testMemberNo = 1;

  const fetchReplies = () => {
    axios
      .get(`/reply/m_list?boardno=${boardno}`)
      .then((res) => setReplies(res.data))
      .catch((err) => console.error('댓글 불러오기 실패:', err));
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    axios
      .post('/reply/create', {
        boardno: boardno,
        content: newReply
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
        memberno: reply.memberno
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
        content: editingContent
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
    // 먼저 중복 추천 체크
    axios
      .get(`/replyRecommend/hartCnt?replyno=${reply.replyno}&memberno=${testMemberNo}`)
      .then((res) => {
        if (res.data > 0) {
          alert('이미 추천한 댓글입니다.');
        } else {
          // 추천 등록
          axios
            .post('/replyRecommend/create_session', { replyno: reply.replyno })
            .then((res) => {
              if (res.data === 1) {
                alert('추천이 등록되었습니다.');
                fetchReplies(); // 추천 수 갱신용
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

              <div style={{ marginTop: '5px' }}>
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
                {/* 추천 버튼 추가 */}
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleRecommend(reply)}
                >
                  추천
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
    </div>
  );
}

export default ReplySection;
