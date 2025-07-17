import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ReplyReportListPage.css';

function ReplyReportListPage() {
  const [activeTab, setActiveTab] = useState('reply');
  const [replyGroups, setReplyGroups] = useState([]);
  const [expandedReplyId, setExpandedReplyId] = useState(null);
  const [boardReports, setBoardReports] = useState([]);
  const [boardGroups, setBoardGroups] = useState([]);
  const [expandedBoardId, setExpandedBoardId] = useState(null);

  // 관리자 확인용
  const [isAdmin, setIsAdmin] = useState(false);

  // 댓글 신고 그룹 불러오기 (댓글별로 묶어서)
  async function fetchGroupedReplyReports() {
    try {
      const res = await axios.get('/replyReport/grouped');
      console.log('✅ 서버 응답 replyGroups:', res.data); // 여기에 찍기
      setReplyGroups(res.data);
    } catch (err) {
      console.error('댓글 신고 목록 불러오기 실패:', err);
      alert('댓글 신고 목록 불러오기에 실패했습니다.');
    }
  }

  async function fetchGroupedBoardReports() {
  try {
    const res = await axios.get('/boardReport/grouped');
    setBoardGroups(res.data);
  } catch (err) {
    console.error('게시글 신고 목록 불러오기 실패:', err);
    alert('게시글 신고 목록 불러오기에 실패했습니다.');
  }
}

  // // 게시글 신고 불러오기
  // async function fetchBoardReports() {
  //   try {
  //     const res = await axios.get('/boardReport/list');
  //     setBoardReports(res.data);
  //   } catch (err) {
  //     console.error('게시글 신고 목록 불러오기 실패:', err);
  //     alert('게시글 신고 목록 불러오기에 실패했습니다.');
  //   }
  // }

  useEffect(() => {
    fetchGroupedReplyReports();
    console.log("replyGroups 예시:", replyGroups);
    fetchGroupedBoardReports(); // ✅ 변경

      // 관리자 여부 확인
    axios.get('/board/sessionInfo').then(res => {
      if (res.data.adminno) {
        setIsAdmin(true);
      }
    });

  }, []);

  // const toggleExpand = (replyno) => {
  //   setExpandedReplyId(expandedReplyId === replyno ? null : replyno);
  // };

  const toggleExpand = (id, type) => {
  if (type === 'reply') {
    setExpandedReplyId(expandedReplyId === id ? null : id);
  } else {
    setExpandedBoardId(expandedBoardId === id ? null : id);
  }
};

//   const handleDelete = async (id, type) => {
//     const url = type === 'reply'
//       ? '/reply/delete'
//       : '/board/delete';

//     const data = type === 'reply'
//       ? { replyno: id }        // 서버에서 ReplyVO의 replyno로 사용
//       : { boardno: id };       // 서버에서 BoardVO의 boardno로 사용

//     if (window.confirm(`정말로 ${type === 'reply' ? '댓글' : '게시글'} 신고번호 ${id}를 삭제하시겠습니까?`)) {
//       try {
//         await axios.post(url, data); // ✅ POST로 변경하고 JSON 전달
//         alert('삭제되었습니다.');
//         type === 'reply'
//           ? fetchGroupedReplyReports()
//           : setBoardReports(prev => prev.filter(b => b.board_reportno !== id));
//       } catch (err) {
//         console.error(err);
//         alert('삭제 중 오류 발생');
//       }
//     }
// };


  // const handleDelete = async (id, type) => {
  //   if (type === 'board') {
  //     const passwd = prompt('게시글 비밀번호를 입력하세요:');
  //     if (!passwd) return;

  //     try {
  //       await axios.delete(`/board/delete/${id}/${passwd}`);
  //       alert('게시글이 삭제되었습니다.');
  //       fetchGroupedBoardReports();
  //     } catch (err) {
  //       console.error(err);
  //       alert(err.response?.data || '삭제 중 오류 발생');
  //     }
  //   } else {
  //     // 댓글 삭제는 기존처럼
  //     try {
  //       await axios.post('/reply/delete', { replyno: id });
  //       alert('댓글이 삭제되었습니다.');
  //       fetchGroupedReplyReports();
  //     } catch (err) {
  //       console.error(err);
  //       alert('댓글 삭제 중 오류 발생');
  //     }
  //   }
  // };


  // const handleDelete = async (id, type) => {
  //   if (type === 'board') {
  //     let passwd = '';

  //     // ⬇️ 관리자 아니면 비밀번호 입력 요청
  //     if (!isAdmin) {
  //       passwd = prompt('게시글 비밀번호를 입력하세요:');
  //       if (!passwd) return;
  //     }

  //     try {
  //       await axios.delete(`/board/delete/${id}`, {
  //         params: { passwd }
  //       });
  //       alert('게시글이 삭제되었습니다.');
  //       fetchGroupedBoardReports();
  //     } catch (err) {
  //       console.error(err);
  //       alert(err.response?.data || '삭제 중 오류 발생');
  //     }
  //   } else {
  //     // 댓글 삭제
  //     try {
  //       await axios.post('/reply/delete', { replyno: id });
  //       alert('댓글이 삭제되었습니다.');
  //       fetchGroupedReplyReports();
  //     } catch (err) {
  //       console.error(err);
  //       alert('댓글 삭제 중 오류 발생');
  //     }
  //   }
  // };

  const handleDelete = async (id, type) => {
    if (type === 'board') {
      if (!isAdmin) {
        alert('관리자만 게시글을 삭제할 수 있습니다.');
        return;
      }

      const confirm = window.confirm('정말로 게시글을 삭제하시겠습니까?');
      if (!confirm) return;

      try {
        await axios.delete(`/board/delete/${id}`, {
          params: { admin: true }, // 관리자 삭제 요청임을 표시
          withCredentials: true
        });
        alert('게시글이 삭제되었습니다.');
        fetchGroupedBoardReports();
      } catch (err) {
        console.error(err);
        alert(err.response?.data || '삭제 중 오류 발생');
      }
    } else {
      // 댓글 삭제
      try {
        await axios.post('/reply/delete', { replyno: id });
        alert('댓글이 삭제되었습니다.');
        fetchGroupedReplyReports();
      } catch (err) {
        console.error(err);
        alert('댓글 삭제 중 오류 발생');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>신고 리스트</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('reply')}
          className={activeTab === 'reply' ? 'active-tab' : ''}
        >
          댓글 신고
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={activeTab === 'board' ? 'active-tab' : ''}
        >
          게시글 신고
        </button>
      </div>

      {activeTab === 'reply' && (
        <div>
          {replyGroups.map(group => (
            <div key={group.replyno} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>
                [댓글번호: {group.replyno}] (신고 수: {group.reportCount}건)
                <button onClick={() => toggleExpand(group.replyno, 'reply')} style={{ marginLeft: '10px' }}>
                  {expandedReplyId === group.replyno ? '⬆️ 접기' : '⬇️ 펼치기'}
                </button>
                <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(group.replyno, 'reply')}>삭제</button>
              </div>
              <div>작성자: {group.nickname} (ID: {group.id}, 회원번호: {group.memberno})</div>
              <div>📝 댓글 내용: {group.content}</div>
              {expandedReplyId === group.replyno && (
                <div style={{ marginTop: '10px' }}>
                  <div>📋 신고 목록:</div>
                  <ul>
                    {group.reports.map(r => (
                      <li key={r.replyReportno}>
                        - 신고자: {r.reporter_nickname} (ID: {r.reporter_id}, 회원번호: {r.memberno}) |
                        신고일: {r.report_date} | 사유: {r.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'board' && (
        <div>
          {boardGroups.map(group => (
            <div key={group.boardno} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>
                [게시글번호: {group.boardno}] (신고 수: {group.reportCount}건)
                <button onClick={() => toggleExpand(group.boardno, 'board')} style={{ marginLeft: '10px' }}>
                  {expandedBoardId === group.boardno ? '⬆️ 접기' : '⬇️ 펼치기'}
                </button>
                <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(group.boardno, 'board')}>삭제</button>
              </div>
              <div>작성자: {group.author_nickname} (ID: {group.author_id}, 회원번호: {group.author_memberno})</div>
              <div>📝 제목: {group.title}</div>
              {expandedBoardId === group.boardno && (
                <div style={{ marginTop: '10px' }}>
                  <div>📋 신고 목록:</div>
                  <ul>
                    {group.reports.map(r => (
                      <li key={r.board_reportno}>
                        - 신고자: {r.reporter_nickname} (ID: {r.reporter_id}, 회원번호: {r.memberno}) |
                        신고일: {r.report_date} | 사유: {r.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReplyReportListPage;
