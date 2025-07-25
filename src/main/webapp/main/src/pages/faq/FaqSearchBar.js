import React, { useState } from "react";
import { Search } from "lucide-react";
import "./FaqSearchBar.css"; // 고유 스타일 추가

const keywordList = [
  "토닥이", "심리", "상담", "이용 요금"
];

function FaqSearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleInput = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyword = (k) => {
    setInput(k);
    onSearch(k);
  };

  return (
    <div className="faq-search-wrap">
      <div className="faq-search-subtitle">자주묻는 질문</div>
      <div className="faq-search-title">
        궁금하신 점이 있나요?<br />키워드로 검색해보세요
      </div>

      {/* 검색창 */}
      <div className="faq-search-input-wrap">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={input}
          onChange={handleInput}
          className="faq-search-input"
        />
        <button className="faq-search-btn">
          <Search size={24} />
        </button>
      </div>

      {/* 키워드 버튼 */}
      <div className="faq-keyword-list">
        {keywordList.map(k => (
          <button
            key={k}
            onClick={() => handleKeyword(k)}
            className="faq-keyword-btn"
          >
            #{k}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FaqSearchBar;
