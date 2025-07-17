import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 추가
import { ChevronDown, ChevronUp } from "lucide-react";

import FaqSearchBar from "./FaqSearchBar";

function FaqPage() {
  const [faqAll, setFaqAll] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/faq/list').then(res => {
      setFaqAll(res.data);
      setFaqList(res.data); 
    });
    
  }, []);

  // 검색 및 카테고리 필터 함수
  const handleSearch = (query) => {
    let filtered = faqAll;
    if (query) {
      filtered = filtered.filter(f =>
        f.question.includes(query) ||
        (f.answer && f.answer.includes(query))
      );
    }
    setFaqList(filtered);
  };

  // 토글 핸들러
  const handleToggle = idx => {
    setOpenIdx(idx === openIdx ? null : idx);
  };

  // 등록 버튼 클릭 이벤트 핸들러
  const handleWrite = () => {
    navigate('/faq/create');
  };

  // 삭제 이벤트 핸들러
  const handleDelete = async (faqno) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      await axios.delete(`/faq/${faqno}`);
      // 삭제 후 새로고침 또는 리스트에서 해당 faqno 삭제
      setFaqList(prev => prev.filter(faq => faq.faqno !== faqno));
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-12">
      <FaqSearchBar onSearch={handleSearch} />

      {/* 헤더: 총 N건 + 등록버튼 우측 정렬 */}
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="text-xl font-bold">총 {faqList.length}건</div>
        <button
          onClick={handleWrite}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
        >
          등록
        </button>
      </div>

      {/* FAQ 리스트 */}
      <div className="max-w-3xl mx-auto mt-12">
      {faqList.map((faq, idx) => (
        <div key={faq.faqno} className="border-b last:border-none">
          <button
            type="button"
            className={`flex w-full items-center justify-between px-6 py-5 transition text-left ${openIdx === idx ? "bg-blue-50" : "hover:bg-gray-50"}`}
            onClick={() => handleToggle(idx)}
          >
            <div>
              {faq.category &&
                <div className="text-sm font-semibold text-blue-600 mb-2">{faq.category}</div>
              }
              <div className="flex items-center gap-2 font-bold text-base">
                <span className="bg-gray-200 rounded-full px-2 py-0.5 text-gray-700 text-xs">Q</span>
                {faq.question}
              </div>
            </div>
            <span>
              {openIdx === idx ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
            </span>
          </button>

          {/* 아코디언: 답변/이미지 노출 */}
          {openIdx === idx && (
            <div className="bg-white px-8 py-7 text-gray-800">
              <div className="flex items-center gap-2 font-semibold mb-2 text-blue-700 text-lg">
                <span className="bg-blue-100 rounded-full px-2 py-0.5 text-blue-700 text-base">A.</span>
              </div>
              <div className="mb-6 whitespace-pre-line text-[1.08rem] leading-relaxed">
                {faq.answer}
              </div>
              {/* 이미지 미리보기 */}
              {faq.files && faq.files.length > 0 && (
                <div className="space-y-4 mt-6">
                  {faq.files.map(f => (
                    <div key={f.fileno}>
                      <img
                        src={`/faq/storage/${f.savedname}`}
                        alt={f.filename}
                        className="w-[320px] max-w-full rounded-lg border shadow mb-1"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* 삭제버튼 관리자만 보이게 할 경우 1 -> admin 관련으로 변경 */}
              {1 && (
                <button
                  className="text-red-600 mt-4 px-3 py-1 border border-red-500 rounded hover:bg-red-50"
                  onClick={() => handleDelete(faq.faqno)}>
                  삭제
                </button>
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
