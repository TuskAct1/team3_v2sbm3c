import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ReplyReportListPage.css';

function ReplyReportListPage() {
  const [activeTab, setActiveTab] = useState('reply'); // 탭 상태: 'reply' 또는 'board'
  const [replyReports, setReplyReports] = useState([]);
  const [boardReports, setBoardReports] = useState([]);

  // 댓글 신고 리스트 불러오기
  async function fetchReplyReports() {
    try {
      const res = await axios.get("/replyReport/list");
      setReplyReports(res.data);
    } catch (err) {
      console.error("댓글 신고 목록 불러오기 실패:", err);
      alert("댓글 신고 목록 불러오기에 실패했습니다.");
    }
  }

  // 게시글 신고 리스트 불러오기
  async function fetchBoardReports() {
    try {
      const res = await axios.get("/boardReport/list");
      setBoardReports(res.data);
    } catch (err) {
      console.error("게시글 신고 목록 불러오기 실패:", err);
      alert("게시글 신고 목록 불러오기에 실패했습니다.");
    }
  }

  useEffect(() => {
    fetchReplyReports();
    fetchBoardReports();
  }, []);

  // 공통 삭제 함수
  const handleDelete = async (id, type) => {
    const url = type === 'reply'
      ? `/replyReport/delete?replyReportno=${id}`
      : `/boardReport/delete?board_reportno=${id}`;

    if (window.confirm(`정말로 ${type === 'reply' ? '댓글' : '게시글'} 신고번호 ${id}를 삭제하시겠습니까?`)) {
      try {
        await axios.delete(url);
        alert("삭제되었습니다.");
        type === 'reply'
          ? setReplyReports(prev => prev.filter(r => r.replyReportno !== id))
          : setBoardReports(prev => prev.filter(b => b.board_reportno !== id));
      } catch (err) {
        console.error(err);
        alert("삭제 중 오류 발생");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>신고 리스트</h2>

      {/* 탭 버튼 */}
      <div style={{ marginBottom: "20px" }}>
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

      {/* 댓글 신고 리스트 */}
      {activeTab === 'reply' && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>신고번호</th>
              <th>댓글번호</th>
              <th>신고자 회원번호</th>
              <th>신고일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {replyReports.map(report => (
              <tr key={report.replyReportno}>
                <td>{report.replyReportno}</td>
                <td>{report.replyno}</td>
                <td>{report.memberno}</td>
                <td>{report.rdate?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => handleDelete(report.replyReportno, 'reply')}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 게시글 신고 리스트 */}
      {activeTab === 'board' && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
