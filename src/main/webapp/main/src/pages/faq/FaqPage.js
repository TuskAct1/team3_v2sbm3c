import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

import FaqSearchBar from "./FaqSearchBar";
import "./FaqPage.css"; // 고유 CSS 추가

function FaqPage() {
  const [faqAll, setFaqAll] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [selectedTab, setSelectedTab] = useState("전체"); // ✅ 탭 상태 추가

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/faq/list').then(res => {
      setFaqAll(res.data);
      setFaqList(res.data);
    });
  }, []);

  // 🔍 검색 필터
  const handleSearch = (query) => {
    let filtered = faqAll;
    if (query) {
      filtered = filtered.filter(f =>
        f.question.includes(query) ||
        (f.answer && f.answer.includes(query))
      );
    }
    // 탭 필터도 적용해서 같이 보여주기
    if (selectedTab !== "전체") {
      filtered = filtered.filter(f => f.category === selectedTab);
    }
    setFaqList(filtered);
  };

  // 🔁 탭 클릭 시 필터링
  const handleTabChange = (category) => {
    setSelectedTab(category);

    const filtered = category === "전체"
      ? faqAll
      : faqAll.filter(f => f.category === category);

    setFaqList(filtered);
    setOpenIdx(null); // 펼쳐진 거 닫기
  };

  const handleToggle = idx => {
    setOpenIdx(idx === openIdx ? null : idx);
  };

  const handleWrite = () => {
    navigate('/faq/create');
  };

  const handleDelete = async (faqno) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      await axios.delete(`/faq/${faqno}`);
      setFaqList(prev => prev.filter(faq => faq.faqno !== faqno));
    }
  };

  return (
    <div className="faq-wrap">
      <FaqSearchBar onSearch={handleSearch} />

      {/* ✅ 탭 필터 버튼 */}
      <div className="faq-tab-bar">
        {["전체", "이용방법", "콘텐츠"].map(tab => (
          <button
            key={tab}
            className={`faq-tab-btn ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="faq-header">
        <div className="faq-count">총 {faqList.length}건</div>
        <button onClick={handleWrite} className="faq-create-btn">등록</button>
      </div>

      <div className="faq-list">
        {faqList.map((faq, idx) => (
          <div key={faq.faqno} className="faq-item">
            <button
              type="button"
              className={`faq-question-btn ${openIdx === idx ? "faq-open" : ""}`}
              onClick={() => handleToggle(idx)}
            >
              <div>
                {faq.category && (
                  <div className="faq-category">{faq.category}</div>
                )}
                <div className="faq-question-row">
                  <span className="faq-label-q">Q</span>
                  {faq.question}
                </div>
              </div>
              <span>
                {openIdx === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </span>
            </button>

            {openIdx === idx && (
              <div className="faq-answer-box">
                <div className="faq-answer-header">
                  <span className="faq-label-a">A.</span>
                </div>
                <div className="faq-answer-text">{faq.answer}</div>

                {faq.files && faq.files.length > 0 && (
                  <div className="faq-image-box">
                    {faq.files.map(f => (
                      <img
                        key={f.fileno}
                        src={`/faq/storage/${f.savedname}`}
                        alt={f.filename}
                        className="faq-image"
                      />
                    ))}
                  </div>
                )}

                {/* 관리자만 삭제 버튼 */}
                {isAdmin && (
                  <div className="faq-btn-group">
                    <button className="faq-edit-btn" onClick={() => navigate(`/faq/edit/${faq.faqno}`)}>
                      수정
                    </button>
                    <button className="faq-delete-btn" onClick={() => handleDelete(faq.faqno)}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
