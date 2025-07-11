import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TwoweekResult.css';

const TwoweekResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const score = state?.totalScore ?? 0;

  let resultText = "";
  let emoji = "";
  let moodClass = "";

  if (score <= 4) {
    resultText = "우울증 아님";
    emoji = "😊";
    moodClass = "mood-good";
  } else if (score <= 9) {
    resultText = "가벼운 우울증";
    emoji = "🙂";
    moodClass = "mood-light";
  } else if (score <= 14) {
    resultText = "중간 정도 우울증";
    emoji = "😐";
    moodClass = "mood-mid";
  } else if (score <= 19) {
    resultText = "중간 정도 우울증 (약물 치료 고려)";
    emoji = "😟";
    moodClass = "mood-severe";
  } else {
    resultText = "심한 우울증 (즉각적인 치료 요함)";
    emoji = "😢";
    moodClass = "mood-critical";
  }

  return (
    <div className="twoweek-result-container">
      <div className={`result-card ${moodClass}`}>
        <div className="result-emoji">{emoji}</div>
        <h2 className="result-title">나의 우울증 진단 결과는?</h2>
        
        <p className="result-score">총 점수: <strong>{score}점</strong></p>
        <p className="result-message">🩺 판정 결과: <strong>{resultText}</strong></p>

        <button className="back-button" onClick={() => navigate('/personality_test')}>
          심리테스트로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default TwoweekResult;
