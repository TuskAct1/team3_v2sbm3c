import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FaqCreatePage.css"; // 고유 스타일 추가

function FaqCreatePage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [files, setFiles] = useState([]);
  const [adminno, setAdminno] = useState(1); // 관리자 번호 (예시)
  const navigate = useNavigate();

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('question', question);
    formData.append('answer', answer);
    formData.append('adminno', adminno);
    files.forEach(file => formData.append('files', file));

    await axios.post('/faq/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("FAQ 등록 완료!");
    navigate('/faq');
  };

  return (
    <form onSubmit={handleSubmit} className="faq-create-form">
      <h2 className="faq-create-title">FAQ 등록</h2>

      <div className="faq-create-field">
        <label className="faq-create-label">질문</label>
        <input
          className="faq-create-input"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="faq-create-field">
        <label className="faq-create-label">답변</label>
        <textarea
          className="faq-create-textarea"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="faq-create-field">
        <label className="faq-create-label">사진 첨부 (여러 장)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <div className="faq-create-preview">
            {files.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="faq-create-thumb"
              />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="faq-createform-btn">등록</button>
    </form>
  );
}

export default FaqCreatePage;
