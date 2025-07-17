import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SeniorTestResult.css';

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
    moodClass = "twoweek-mood-good";
  } else if (score <= 9) {
    resultText = "가벼운 우울증";
    emoji = "🙂";
    moodClass = "twoweek-mood-light";
  } else if (score <= 14) {
    resultText = "중간 정도 우울증";
    emoji = "😐";
    moodClass = "twoweek-mood-mid";
  } else if (score <= 19) {
    resultText = "중간 정도 우울증 (약물 치료 고려)";
    emoji = "😟";
    moodClass = "twoweek-mood-severe";
  } else {
    resultText = "심한 우울증 (즉각적인 치료 요함)";
    emoji = "😢";
    moodClass = "twoweek-mood-critical";
  }

  return (
    <div className="twoweek-result-container">
      <div className={`twoweek-result-card ${moodClass}`}>
        <div className="twoweek-result-emoji">{emoji}</div>
        <h2 className="twoweek-result-title">나의 우울증 진단 결과는?</h2>

        <p className="twoweek-result-score">총 점수: <strong>{score}점</strong></p>
        <p className="twoweek-result-message">🩺 판정 결과: <strong>{resultText}</strong></p>

        <button className="twoweek-back-button" onClick={() => navigate('/personality_test')}>
          자가진단 홈
        </button>
      </div>
    </div>
  );
};

export default TwoweekResult;
