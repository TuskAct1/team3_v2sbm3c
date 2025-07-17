import React, { useState } from "react";
import { Search } from "lucide-react";

const keywordList = [
  "요양등급", "챗봇문의", "신청서", "등급", "의사소견서", "센터매칭"
];

function FaqSearchBar({ onSearch}) {
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
    <div className="max-w-3xl mx-auto mt-10 text-center">
      <div className="text-blue-700 font-semibold mb-2 text-lg">자주묻는 질문</div>
      <div className="text-3xl font-bold mb-8">궁금하신 점이 있나요?<br/>키워드로 검색해보세요</div>

      {/* 검색창 */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={input}
          onChange={handleInput}
          className="w-full px-6 py-4 rounded-full border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button className="absolute right-5 top-1/2 -translate-y-1/2">
          <Search size={24} />
        </button>
      </div>

      {/* 키워드 버튼 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {keywordList.map(k => (
          <button
            key={k}
            onClick={() => handleKeyword(k)}
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100"
          >#{k}</button>
        ))}
      </div>
    </div>
  );
}

export default FaqSearchBar;
