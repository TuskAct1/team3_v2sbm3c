import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // useLocation: 전달받은 데이터(state)를 꺼내기 위한 React Router 훅
import './SeniorTestResult.css'; // 스타일 파일

function SeniorTestResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 상태에서 score와 message 꺼내기
  const { score, message } = location.state || {};

  // 잘못된 접근일 경우 (예: 새로고침해서 state가 없는 경우)
  if (score === undefined || !message) {
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

  // 점수가 10점 이상이면 위험 메시지 스타일
  const isWarning = score >= 10;

  return (
    <div className="result-container">
      <div className={`result-box ${isWarning ? 'danger' : 'safe'}`}>
        <h2 className="result-score">🧾 총 점수: {score}점</h2>

        {/* ✅ 긴 안내 메시지 출력 (DB 저장된 result 말고, navigate로 넘긴 message 사용) */}
        <p className="result-message">{message}</p>

        <button
          className="result-home-btn"
          onClick={() => navigate('/personality_test')}
        >
          심리테스트로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SeniorTestResult;
