// ✅ MemoryTest.js - 기억력 테스트 (진행률 + 독립 클래스 + 스타일 개선)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryQuestions, options } from './MemoryData';
import './MemoryTest.css'; // ✅ 새 CSS 적용

function MemoryTest() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ + 1 < memoryQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, v) => sum + v, 0);
      navigate('/memory_test/result', { state: { totalScore } });
    }
  };

  const progressPercent = Math.round((currentQ / memoryQuestions.length) * 100);

  return (
    <div className="memorytest-container">
      <h2 className="memorytest-title">🧠 기억력 자가진단 테스트</h2>

      {/* ✅ 진행률 바 */}
      <div className="memorytest-progress-bar">
        <div className="memorytest-progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p className="memorytest-progress-text">{currentQ + 1} / {memoryQuestions.length}</p>

      {/* ✅ 질문 카드 */}
      <div className="memorytest-question-card">
        <p className="memorytest-question-text">{memoryQuestions[currentQ].text}</p>
        <div className="memorytest-options">
          {options.map((opt) => (
            <button
              key={opt.score}
              onClick={() => handleAnswer(opt.score)}
              className="memorytest-option-btn"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemoryTest;