import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FaqPage.css"; // 고유 CSS 추가

function FaqAnswerEditPage() {
  const { faqno } = useParams();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(""); // 보기용
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/faq/${faqno}`)
      .then(res => {
        setQuestion(res.data.faq.question);
        setAnswer(res.data.faq.answer || "");
      });
  }, [faqno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/faq/${faqno}/answer`, { answer });
      alert("답변이 수정되었습니다.");
      navigate("/faq");
    } catch (err) {
      alert(err.response?.data || "수정 실패");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-md border"
    >
      <div className="mb-6">
        <label className="block font-semibold text-gray-600 mb-2">질문</label>
        <div className="bg-gray-50 p-3 rounded text-gray-800 border">{question}</div>
      </div>
      <div className="mb-8">
        <label className="block font-semibold text-gray-600 mb-2">답변</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="답변을 입력하세요"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          답변 수정
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold"
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default FaqAnswerEditPage;
