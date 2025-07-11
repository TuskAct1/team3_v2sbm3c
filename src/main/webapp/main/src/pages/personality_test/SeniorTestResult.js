// ✅ SeniorTestResult.js - 노인 우울증 자가진단 결과 페이지
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SeniorTestResult.css';

function SeniorTestResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, message } = location.state || {};

  if (score === undefined || !message) {
    return (
      <div className="senior-result-container">
        <div className="senior-result-box error">
          <h2 className="senior-result-error">잘못된 접근입니다.</h2>
          <button className="senior-result-btn" onClick={() => navigate('/')}>홈으로 이동</button>
        </div>
      </div>
    );
  }

  let moodTextClass = '';
  if (score < 5) moodTextClass = 'senior-text-good';
  else if (score < 10) moodTextClass = 'senior-text-mid';
  else moodTextClass = 'senior-text-danger';

  return (
    <div className="senior-result-container">
      <div className="senior-result-box">
        <h2 className="senior-result-title">📘 나의 검사 결과는?</h2>
        <p className={`senior-result-score ${moodTextClass}`}>
          총 점수: <strong>{score}점</strong>
        </p>
        <p className="senior-result-message">{message}</p>
        <button className="senior-result-btn" onClick={() => navigate('/personality_test')}>
          심리테스트로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SeniorTestResult;
