import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ReplyReportListPage.css';
import { FaTrash } from 'react-icons/fa';

function ReplyReportListPage() {
  const [activeTab, setActiveTab] = useState('reply');
  const [replyGroups, setReplyGroups] = useState([]);
  const [boardGroups, setBoardGroups] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const tableRef = useRef(null);
  const [nowPage, setNowPage] = useState(1);
  const recordsPerPage = 10;
  const [sortOption, setSortOption] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState('all');

  useEffect(() => {
    fetchGroupedReplyReports();
    fetchGroupedBoardReports();
    axios.get('http://121.78.128.139:9093/board/sessionInfo').then(res => {
      if (res.data.adminno) setIsAdmin(true);
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        tableRef.current.classList.add('fade-in');
      }
    }, { threshold: 0.1 });

    if (tableRef.current) observer.observe(tableRef.current);
    return () => { if (tableRef.current) observer.unobserve(tableRef.current); };
  }, []);

  const fetchGroupedReplyReports = async () => {
    try {
      const res = await axios.get('http://121.78.128.139:9093/replyReport/grouped');
      setReplyGroups(res.data);
    } catch (err) {
      alert('댓글 신고 목록 불러오기 실패');
    }
  };

  const fetchGroupedBoardReports = async () => {
    try {
      const res = await axios.get('http://121.78.128.139:9093/boardReport/grouped');
      setBoardGroups(res.data);
    } catch (err) {
      alert('게시글 신고 목록 불러오기 실패');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleDelete = async (id, type) => {
    const confirmMsg = type === 'board' ? '게시글' : '댓글';
    if (!window.confirm(`정말로 ${confirmMsg}을 삭제하시겠습니까?`)) return;

    try {
      if (type === 'board') {
        if (!isAdmin) return alert('관리자만 삭제할 수 있습니다.');
        await axios.delete(`http://121.78.128.139:9093/board/delete/${id}`, { params: { admin: true }, withCredentials: true });
        fetchGroupedBoardReports();
      } else {
        await axios.post('http://121.78.128.139:9093/reply/delete', { replyno: id });
        fetchGroupedReplyReports();
      }
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const renderRows = (data, type) => {
    // 🔍 검색
   const filteredData = data.filter(group => {
    const nickname = type === 'reply' ? group.nickname : group.author_nickname;
    const content = type === 'reply' ? group.content : group.title;
    const id = String(group[`${type}no`]);

    const keyword = searchKeyword.toLowerCase();

    if (searchField === 'id') {
      return id.includes(keyword);
    } else if (searchField === 'content') {
      return content?.toLowerCase().includes(keyword);
    } else if (searchField === 'nickname') {
      return nickname?.toLowerCase().includes(keyword);
    } else {
      // 기본: 전체 검색
      return (
        id.includes(keyword) ||
        content?.toLowerCase().includes(keyword) ||
        nickname?.toLowerCase().includes(keyword)
      );
    }
  });


  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.reports[0]?.report_date) - new Date(a.reports[0]?.report_date);
    } else if (sortOption === 'oldest') {
      return new Date(a.reports[0]?.report_date) - new Date(b.reports[0]?.report_date);
    } else if (sortOption === 'mostReported') {
      return b.reportCount - a.reportCount;
    }
    return 0;
  });

  const pagedData = sortedData.slice((nowPage - 1) * recordsPerPage, nowPage * recordsPerPage);

    return pagedData.map((group) => (
      <React.Fragment key={group[`${type}no`]}>
        <tr className="report-row">
          <td>{group[`${type}no`]}</td>
          <td>{group.reports[0]?.report_date || '-'}</td>
          <td>{type === 'reply' ? group.content : group.title}</td>
          {/* <td>{type === 'reply' ? group.nickname : group.author_nickname}</td> */}
          <td title={`ID: ${group.id || group.author_id}\n회원번호: ${group.memberno || group.author_memberno}`}>
            {group.nickname || group.author_nickname}
          </td>
          <td className="report-count">{group.reportCount}건</td>
          <td>
            <button className="icon-btn delete" onClick={() => handleDelete(group[`${type}no`], type)}>
              <FaTrash />
            </button>
            <button className="tab-btn" onClick={() => toggleExpand(group[`${type}no`])}>
              {expandedId === group[`${type}no`] ? '접기' : '펼치기'}
            </button>
          </td>
        </tr>
        {expandedId === group[`${type}no`] && (
          <tr className="report-detail">
            <td colSpan="6">
              <div className="report-detail-box">
                <h3>내용: {type === 'reply' ? group.content : group.title}</h3>
                <ul>
                  {group.reports.map(r => (
                    <p key={r[`${type === 'reply' ? 'replyReportno' : 'board_reportno'}`]}>
                      신고자: {r.reporter_nickname} (ID: {r.reporter_id}, 회원번호: {r.memberno}) |
                      신고일: {r.report_date} | 사유: {r.reason}
                    </p>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  };

  const renderPageButtons = () => {
    const totalCount = activeTab === 'reply' ? replyGroups.length : boardGroups.length;
    const maxPage = Math.ceil(totalCount / recordsPerPage);
    const visibleRange = 2;
    const pages = [];

    if (nowPage > 1) pages.push(<button key="prev" onClick={() => setNowPage(nowPage - 1)}>&lt;</button>);
    if (nowPage > visibleRange + 1) {
      pages.push(<button key="first" onClick={() => setNowPage(1)}>1</button>);
      pages.push(<span key="dots1">...</span>);
    }

    for (let i = Math.max(1, nowPage - visibleRange); i <= Math.min(maxPage, nowPage + visibleRange); i++) {
      pages.push(
        <button key={i} onClick={() => setNowPage(i)} className={nowPage === i ? 'active' : ''}>{i}</button>
      );
    }

    if (nowPage < maxPage - visibleRange) {
      pages.push(<span key="dots2">...</span>);
      pages.push(<button key="last" onClick={() => setNowPage(maxPage)}>{maxPage}</button>);
    }

    if (nowPage < maxPage) pages.push(<button key="next" onClick={() => setNowPage(nowPage + 1)}>&gt;</button>);

    return pages;
  };
  

  return (
    <div className="member-page">
      <h2 className="member-title">신고 리스트</h2>

    <div className="report-tabs">
      <button className={`tab-btn ${activeTab === 'reply' ? 'active-tab' : ''}`} onClick={() => { setNowPage(1); setActiveTab('reply'); }}>댓글</button>
      <button className={`tab-btn ${activeTab === 'board' ? 'active-tab' : ''}`} onClick={() => { setNowPage(1); setActiveTab('board'); }}>게시판</button>
    </div>

    <hr className="divider" />

    <div className="search-bar">
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="all">제목 + 내용</option>
        <option value="id">댓글번호</option>
        <option value="content">댓글 내용</option>
        <option value="nickname">작성자</option>
      </select>
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <button>검색</button>
    </div>

    <div className="report-header-row">
      <div className="report-stats">
        {activeTab === 'reply' && (
          <p>총 댓글 신고 수: <strong>{replyGroups.length}</strong>건</p>
        )}
        {activeTab === 'board' && (
          <p>총 게시글 신고 수: <strong>{boardGroups.length}</strong>건</p>
        )}
      </div>

      <div className="report-sort-right">
        <label htmlFor="sortSelect" className="sort-label">정렬 기준:</label>
        <select
          className="report-sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="mostReported">신고 많은 순</option>
        </select>
      </div>
    </div>

      <table className="member-table" ref={tableRef}>
        <thead>
          <tr>
            <th>{activeTab === 'reply' ? '댓글번호' : '게시글번호'}</th>
            <th>최초 신고날짜</th>
            <th>{activeTab === 'reply' ? '댓글 내용' : '게시글 제목'}</th>
            <th>작성자</th>
            <th>신고 수</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === 'reply' && replyGroups.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>🚫 현재 신고된 댓글이 없습니다.</td></tr>
          )}
          {activeTab === 'board' && boardGroups.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>🚫 현재 신고된 게시글이 없습니다.</td></tr>
          )}
          {activeTab === 'reply' ? renderRows(replyGroups, 'reply') : renderRows(boardGroups, 'board')}
        </tbody>
      </table>

      <div className="pagination">{renderPageButtons()}</div>
    </div>
  );
}

export default ReplyReportListPage;