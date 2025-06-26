import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SeniorTestResult.css'; // 스타일 따로

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, message } = location.state || {};

  // 잘못된 접근 처리
  if (score === undefined) {
    return (
      <div className="result-container">
        <div className="result-box">
          <h2 className="result-error">잘못된 접근입니다.</h2>
          <button className="result-home-btn" onClick={() => navigate('/')}>
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  const isWarning = score >= 10; // 10점 이상이면 위험

  return (
    <div className="result-container">
      <div className={`result-box ${isWarning ? 'danger' : 'safe'}`}>
        <h2 className="result-score">🧾 총 점수: {score}점</h2>
        <p className="result-message">{location.state.message}</p>
        <button className="result-home-btn" onClick={() => navigate('/personality_test')}>
          심리테스트로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Result;
