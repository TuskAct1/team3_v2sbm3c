import React, { useState } from "react";
import axios from "axios";

function FaqCreatePage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [files, setFiles] = useState([]);
  const [adminno, setAdminno] = useState(1); // 예시 (관리자 번호)

  const handleFileChange = e => setFiles([...e.target.files]);

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
    // 목록 이동 등
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10">
      <div className="mb-4">
        <label>질문</label>
        <input className="border p-2 w-full" value={question} onChange={e => setQuestion(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label>답변</label>
        <textarea className="border p-2 w-full" value={answer} onChange={e => setAnswer(e.target.value)} required rows={4} />
      </div>
      <div className="mb-4">
        <label>사진 첨부 (여러 장)</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">등록</button>
    </form>
  );
}

export default FaqCreatePage;
