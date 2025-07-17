// MemoryResult.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { memoryResultData } from './MemoryData';
import './MemoryResult.css'; // ✅ 변경된 스타일 파일명

function MemoryResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalScore } = location.state || { totalScore: 0 };

  const result = memoryResultData.find(r =>
    totalScore >= r.range[0] && totalScore <= r.range[1]
  );

  return (
    <div className="memoryresult-container">
      <h1 className="memoryresult-title">🧠 기억력 자가진단 결과</h1>
      <div className="memoryresult-card">
        <h2 className="memoryresult-score" style={{ color: result.color }}>
          {result.level} - 총점 {totalScore}점
        </h2>
        <p className="memoryresult-main-message">{result.message}</p>
        <p className="memoryresult-detail">{result.detail}</p>

        <h3 className="memoryresult-tip-title">💡 기억력 관리 팁</h3>
        <ul className="memoryresult-tip-list">
          {result.tips.map((tip, idx) => (
            <li key={idx}>✔️ {tip}</li>
          ))}
        </ul>

        <div className="memoryresult-buttons">
          <button className="memoryresult-btn green" onClick={() => navigate('/memory_test')}>
            다시 검사하기
          </button>
          <button className="memoryresult-btn gray" onClick={() => navigate('/personality_test')}>
            자가진단 홈
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryResult;