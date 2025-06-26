import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Twoweek.css';

const TwoweekResult = () => {
  const { state } = useLocation();                  // 전달된 상태 받기
  const navigate = useNavigate();                   // 페이지 이동용
  const score = state?.totalScore ?? 0;             // 총 점수

  // 점수에 따른 결과 메시지 및 이모지
  let resultText = "";
  let emoji = "";

  if (score <= 4) {
    resultText = "우울증 아님";
    emoji = "😊";
  } else if (score <= 9) {
    resultText = "가벼운 우울증";
    emoji = "🙂";
  } else if (score <= 14) {
    resultText = "중간 정도 우울증";
    emoji = "😐";
  } else if (score <= 19) {
    resultText = "중간 정도 우울증 (약물 치료 고려)";
    emoji = "😟";
  } else {
    resultText = "심한 우울증 (즉각적인 치료 요함)";
    emoji = "😢";
  }

  // ✅ 위험 점수일 경우 'danger' 클래스 추가
  const cardClassName = `result-card ${score >= 14 ? 'danger' : ''}`;

  return (
    <div className="twoweek-result-container">
      {/* 결과 카드 (조건부 danger 클래스) */}
      <div className={cardClassName}>
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
