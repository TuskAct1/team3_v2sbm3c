// MemoryResult.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { memoryResultData } from './MemoryData';
import './MemoryTest.css';

function MemoryResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalScore } = location.state || { totalScore: 0 };

  const result = memoryResultData.find(r =>
    totalScore >= r.range[0] && totalScore <= r.range[1]
  );

  return (
    <div className="memory-result-container">
      <h1>🧠 기억력 자가진단 결과</h1>
      <div className="result-card">
        <h2 style={{ color: result.color }}>
          {result.level} - 총점 {totalScore}점
        </h2>
        <p className="main-message">{result.message}</p>
        <p className="detail">{result.detail}</p>

        <h3>💡 기억력 관리 팁</h3>
        <ul className="tips-list">
          {result.tips.map((tip, idx) => (
            <li key={idx}>✔️ {tip}</li>
          ))}
        </ul>

        <div className="result-buttons">
          <button onClick={() => navigate('/memory_test')}>🔁 다시 검사하기</button>
          <button onClick={() => navigate('/personality_test')}>🔙 심리테스트로 돌아가기</button>
        </div>
      </div>
    </div>
  );
}

export default MemoryResult;
