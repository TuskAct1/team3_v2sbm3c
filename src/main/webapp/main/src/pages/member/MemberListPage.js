import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/MemberListPage.css';
import { FaTrash } from 'react-icons/fa';

function MemberListPage() {
  const [members, setMembers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [nowPage, setNowPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const recordsPerPage = 10;
  const tableRef = useRef(null);

  const fetchMembers = () => {
    axios
      .get('http://121.78.128.139:9093/api/members', {
        params: {
          keyword,
          field: searchField,
          now_page: nowPage,
          records_per_page: recordsPerPage,
        },
      })
      .then((res) => {
        setMembers(res.data.list || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch((err) => {
        console.error('회원 리스트 불러오기 실패', err);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, [keyword, nowPage, searchField]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tableRef.current.classList.add('fade-in');
        }
      },
      { threshold: 0.1 }
    );

    if (tableRef.current) observer.observe(tableRef.current);
    return () => {
      if (tableRef.current) observer.unobserve(tableRef.current);
    };
  }, []);

  const handleDeleteClick = (e, member) => {
    e.stopPropagation();
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleConfirmDelete = (memberno) => {
    axios
      .delete(`http://121.78.128.139:9093/api/admin/members/delete`, { params: { memberno } })
      .then((res) => {
        alert(res.data);
        setShowModal(false);
        fetchMembers();
      })
      .catch((err) => {
        console.error(err);
        alert('삭제 중 오류 발생');
      });
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxPage = Math.ceil(totalCount / recordsPerPage);
    const visibleRange = 2;

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
      <h2 className="member-title">회원 리스트</h2>
      <div className="search-bar">
        <select value={searchField} onChange={(e) => { setSearchField(e.target.value); setNowPage(1); }}>
          <option value="all">제목 + 내용</option>
          <option value="mname">이름</option>
          <option value="id">아이디</option>
          <option value="tel">전화번호</option>
          <option value="mdate">등록일</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" value={keyword} onChange={(e) => { setKeyword(e.target.value); setNowPage(1); }} />
        <button>검색</button>
      </div>

      <table className="member-table" ref={tableRef}>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th>전화번호</th>
            <th>등록일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.memberno} className={selectedRow === member.memberno ? 'selected' : ''}>
              <td>{(nowPage - 1) * recordsPerPage + index + 1}</td>
              <td>{member.mname}</td>
              <td>{member.id}</td>
              <td>{member.tel}</td>
              <td>{member.mdate?.slice(0, 10)}</td>
              <td>
                <button className="icon-btn delete" onClick={(e) => handleDeleteClick(e, member)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">{renderPageButtons()}</div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate">
            <h3>정말 삭제하시겠어요?</h3>
            <p>
              <strong>{selectedMember.id}</strong> 회원님의 정보를<br />삭제하면 복구할 수 없어요.
            </p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>취소</button>
              <button className="delete-btn" onClick={() => handleConfirmDelete(selectedMember.memberno)}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberListPage;
