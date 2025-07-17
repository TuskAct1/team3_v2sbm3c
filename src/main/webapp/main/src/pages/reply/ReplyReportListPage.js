import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/MemberListPage.css';
import { FaTrash } from 'react-icons/fa';

function ReplyReportListPage() {
  const [activeTab, setActiveTab] = useState('reply');
  const [replyGroups, setReplyGroups] = useState([]);
  const [expandedReplyId, setExpandedReplyId] = useState(null);
  const [boardReports, setBoardReports] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchReplyReports();
    fetchBoardReports();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        tableRef.current?.classList.add('fade-in');
      }
    }, { threshold: 0.1 });

    if (tableRef.current) observer.observe(tableRef.current);
    return () => {
      if (tableRef.current) observer.unobserve(tableRef.current);
    };
  }, [activeTab]);

  const fetchReplyReports = async () => {
    try {
      const res = await axios.get('/replyReport/grouped');
      setReplyGroups(res.data);
    } catch (err) {
      alert('댓글 신고 목록 불러오기 실패');
    }
  };

  const fetchBoardReports = async () => {
    try {
      const res = await axios.get('/boardReport/list');
      setBoardReports(res.data);
    } catch (err) {
      alert('게시글 신고 목록 불러오기 실패');
    }
  };

  const handleDelete = async (id, type) => {
    const url = type === 'reply'
      ? `/replyReport/delete?replyReportno=${id}`
      : `/boardReport/delete?board_reportno=${id}`;

    if (window.confirm(`${type === 'reply' ? '댓글' : '게시글'} 신고번호 ${id}를 삭제할까요?`)) {
      try {
        await axios.delete(url);
        alert('삭제 완료');
        type === 'reply' ? fetchReplyReports() : fetchBoardReports();
      } catch (err) {
        alert('삭제 중 오류');
      }
    }
  };

  return (
    <div className="member-page">
      <h2 className="member-title">신고 리스트</h2>

      <div className="search-bar">
        <button
          onClick={() => { setActiveTab('reply'); setExpandedReplyId(null); }}
          className={activeTab === 'reply' ? 'active-tab' : ''}
        >
          댓글 신고
        </button>
        <button
          onClick={() => { setActiveTab('board'); setExpandedReplyId(null); }}
          className={activeTab === 'board' ? 'active-tab' : ''}
        >
          게시글 신고
        </button>
      </div>

      {activeTab === 'reply' && (
        <div>
          <table className="member-table" ref={tableRef}>
            <thead>
              <tr>
                <th>댓글번호</th>
                <th>신고 수</th>
                <th>작성자</th>
                <th>댓글 내용</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {replyGroups.map(group => (
                <tr key={group.replyno}>
                  <td>{group.replyno}</td>
                  <td>{group.reportCount}</td>
                  <td>{group.nickname} (ID: {group.id})</td>
                  <td>{group.content}</td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => setExpandedReplyId(prev => prev === group.replyno ? null : group.replyno)}
                    >
                      {expandedReplyId === group.replyno ? '접기' : '펼치기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expandedReplyId && (
            <div className="myinquiry-detail animate-fade">
              <div className="myinquiry-detail-header">
                <h4>📋 댓글 신고 상세 내역</h4>
              </div>
              <div className="myinquiry-detail-content">
                {replyGroups
                  .find(g => g.replyno === expandedReplyId)
                  ?.reports.map(r => (
                    <div key={r.replyReportno} style={{ marginBottom: '10px' }}>
                      - 신고자: {r.reporter_nickname} (ID: {r.reporter_id})<br />
                      사유: {r.reason}<br />
                      날짜: {r.report_date}
                      <button
                        className="icon-btn delete"
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleDelete(r.replyReportno, 'reply')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'board' && (
        <div>
          {boardReports.length > 0 ? (
            <table className="member-table" ref={tableRef}>
              <thead>
                <tr>
                  <th>신고번호</th>
                  <th>게시글번호</th>
                  <th>신고자</th>
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
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(report.board_reportno, 'board')}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>등록된 게시글 신고가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ReplyReportListPage;
