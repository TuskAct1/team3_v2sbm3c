import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InquiryCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 예: 로그인한 회원 아이디(localStorage 등)
  // const userId = localStorage.getItem("user") || "";
  const memberno = String(JSON.parse(localStorage.getItem('user') || '{}').memberno);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const res = await fetch("/inquiry/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno, title, content }),
    });
    if (res.ok) {
      alert("문의가 등록되었습니다.");
      navigate("/inquiry");
    } else {
      alert("문의 등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">1:1 문의 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="border rounded-md w-full px-3 py-2"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="문의 제목"
            maxLength={100}
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            className="border rounded-md w-full px-3 py-2 h-36 resize-none"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            maxLength={2000}
            required
          />
        </div>
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700"
          type="submit"
        >
          문의 등록
        </button>
      </form>
    </div>
  );
}

export default InquiryCreatePage;
