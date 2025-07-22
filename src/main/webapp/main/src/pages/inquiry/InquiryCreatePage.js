import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './InquiryCreatePage.css'; // 고유 스타일 추가

function InquiryCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
    <div className="inquiry-create-wrap">
      <h2 className="inquiry-create-title">1:1 문의 작성</h2>
      <form className="inquiry-create-form" onSubmit={handleSubmit}>
        <div className="inquiry-form-group">
          <input
            className="inquiry-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="문의 제목"
            maxLength={100}
            required
          />
        </div>
        <div className="inquiry-form-group">
          <textarea
            className="inquiry-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            maxLength={2000}
            required
          />
        </div>
        <button
          className="inquiry-submit-btn"
          type="submit"
        >
          문의 등록
        </button>
      </form>
    </div>
  );
}

export default InquiryCreatePage;
