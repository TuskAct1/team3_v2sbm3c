// MemoryTest.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryQuestions, options } from './MemoryData';
import './MemoryTest.css';

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

  return (
    <div className="memory-test-container">
      <h2>🧠 기억력 자가진단 테스트</h2>
      <p className="question-count">{currentQ + 1} / {memoryQuestions.length}</p>
      <div className="question-card">
        <p>{memoryQuestions[currentQ].text}</p>
        <div className="options">
          {options.map((opt) => (
            <button key={opt.score} onClick={() => handleAnswer(opt.score)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemoryTest;
