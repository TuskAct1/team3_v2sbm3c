import React, { useEffect, useState } from "react";
import "./MyInquiryList.css";

function MyInquiryList({ memberno }) {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchList = async () => {
      
    const res = await fetch(`/inquiry/list_all?memberno=${memberno}`);
    const data = await res.json();

    const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
    console.log(list);
    const myInquiries = list.filter(inquiry => String(inquiry.memberno) === String(memberno));

        // 응답에서 실제 배열을 추출
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        // 🔍 내 문의만 필터링 (memberno 비교)
        const myInquiries = list.filter(
          (inquiry) => String(inquiry.memberno) === String(memberno)
        );

        console.log("✅ 나의 문의 리스트:", myInquiries);

        setList(myInquiries);
        setFilteredList(myInquiries);
      } catch (err) {
        console.error("❌ 문의 목록 불러오기 실패:", err);
        setList([]);
        setFilteredList([]);
      }
    };
    fetchList();
  }, [memberno]);


  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = list.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        (item.category && item.category.toLowerCase().includes(keyword))
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleSelect = async (inquiryno) => {
    setLoading(true);
    try {
      const res = await fetch(`/inquiry/${inquiryno}?memberno=${memberno}`);
      const data = await res.json();
      setSelected(data);
    } catch (err) {
      console.error("❌ 상세 문의 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="myinquiry-wrapper">
      {/* 검색창 */}
      <div className="myinquiry-search-box">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력해주세요."
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="myinquiry-count">총 {filteredList.length}건</div>

      <ul className="myinquiry-list-style">
        {filteredList.map((inquiry) => (
          <li
            key={inquiry.inquiryno}
            className="myinquiry-row"
            onClick={() => handleSelect(inquiry.inquiryno)}
          >
            <div className="left">
              <span className="type-label">1:1</span>
              <span className="title-text">{inquiry.title}</span>
            </div>
            <div className="right">
              <span className="date-category">
                {inquiry.create_date?.substring(2, 10).replaceAll("-", ".")} · {inquiry.category || inquiry.title}
              </span>
              <span className={`status-label ${inquiry.status === 'Y' ? 'done' : 'wait'}`}>
                {inquiry.status === "Y" ? "답변완료" : "대기중"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 상세 보기 */}
      {selected && (
        <div className="myinquiry-detail animate-fade">
          <div className="myinquiry-detail-header">
            <h4>{selected.title}</h4>
            <button onClick={() => setSelected(null)}>✖</button>
          </div>
          <div className="myinquiry-detail-meta">작성일: {selected.create_date?.substring(0, 10)}</div>
          <div className="myinquiry-detail-content">{selected.content}</div>

          <div className="myinquiry-detail-answer">
            <div className="answer-label">관리자 답변</div>
            {selected.answer ? (
              <div className="answer-box">{selected.answer}</div>
            ) : (
              <div className="answer-box empty">아직 답변이 등록되지 않았습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyInquiryList;
