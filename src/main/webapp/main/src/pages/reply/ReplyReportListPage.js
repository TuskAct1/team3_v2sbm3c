import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ReplyReportListPage.css';

function ReplyReportListPage() {
  const [activeTab, setActiveTab] = useState('reply');
  const [replyGroups, setReplyGroups] = useState([]);
  const [expandedReplyId, setExpandedReplyId] = useState(null);
  const [boardReports, setBoardReports] = useState([]);

  // 댓글 신고 그룹 불러오기 (댓글별로 묶어서)
  async function fetchGroupedReplyReports() {
    try {
      const res = await axios.get('/replyReport/grouped');
      setReplyGroups(res.data);
    } catch (err) {
      console.error('댓글 신고 목록 불러오기 실패:', err);
      alert('댓글 신고 목록 불러오기에 실패했습니다.');
    }
  }

  // 게시글 신고 불러오기
  async function fetchBoardReports() {
    try {
      const res = await axios.get('/boardReport/list');
      setBoardReports(res.data);
    } catch (err) {
      console.error('게시글 신고 목록 불러오기 실패:', err);
      alert('게시글 신고 목록 불러오기에 실패했습니다.');
    }
  }

  useEffect(() => {
    fetchGroupedReplyReports();
    fetchBoardReports();
  }, []);

  const toggleExpand = (replyno) => {
    setExpandedReplyId(expandedReplyId === replyno ? null : replyno);
  };

  const handleDelete = async (id, type) => {
    const url = type === 'reply'
      ? `/replyReport/delete?replyReportno=${id}`
      : `/boardReport/delete?board_reportno=${id}`;

    if (window.confirm(`정말로 ${type === 'reply' ? '댓글' : '게시글'} 신고번호 ${id}를 삭제하시겠습니까?`)) {
      try {
        await axios.delete(url);
        alert('삭제되었습니다.');
        type === 'reply'
          ? fetchGroupedReplyReports()
          : setBoardReports(prev => prev.filter(b => b.board_reportno !== id));
      } catch (err) {
        console.error(err);
        alert('삭제 중 오류 발생');
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
                <button onClick={() => toggleExpand(group.replyno)} style={{ marginLeft: '10px' }}>
                  {expandedReplyId === group.replyno ? '⬆️ 접기' : '⬇️ 펼치기'}
                </button>
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
                        <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(r.replyReportno, 'reply')}>삭제</button>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>신고번호</th>
              <th>게시글번호</th>
              <th>신고자 회원번호</th>
              <th>신고일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {boardReports.map(report => (
              <tr key={report.board_reportno}>
                <td>{report.board_reportno}</td>
                <td>{report.boardno}</td>
                <td>{report.memberno}</td>
                <td>{report.rdate?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => handleDelete(report.board_reportno, 'board')}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReplyReportListPage;
