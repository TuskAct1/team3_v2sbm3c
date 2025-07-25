import React, { useState } from 'react';
import axios from 'axios';

function AdminQuizUpload() {
  const [form, setForm] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/quiz/admin/add', form);
    alert("퀴즈가 등록되었습니다!");
    setForm({question: '', option1: '', option2: '', option3: '', option4: '', answer: ''});
  };

  return (
    <div className="admin-quiz-upload">
      <h2>퀴즈 등록</h2>
      <form onSubmit={handleSubmit}>
        <input name="question" placeholder="질문" value={form.question} onChange={handleChange} required />
        <input name="option1" placeholder="선택지 1" value={form.option1} onChange={handleChange} required />
        <input name="option2" placeholder="선택지 2" value={form.option2} onChange={handleChange} required />
        <input name="option3" placeholder="선택지 3" value={form.option3} onChange={handleChange} required />
        <input name="option4" placeholder="선택지 4" value={form.option4} onChange={handleChange} required />
        <input name="answer" placeholder="정답" value={form.answer} onChange={handleChange} required />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default AdminQuizUpload;
