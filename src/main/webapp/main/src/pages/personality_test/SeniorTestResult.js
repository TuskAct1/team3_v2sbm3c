// ✅ SeniorTestResult.js - 노인 우울증 자가진단 결과 페이지
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SeniorTestResult.css'; // ✅ 공통 결과 스타일 사용

function SeniorTestResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, message } = location.state || {};

  // ✅ 유효하지 않은 접근 처리
  if (score === undefined || !message) {
    return (
      <div className="twoweek-result-container">
        <div className="twoweek-result-card twoweek-mood-critical">
          <div className="twoweek-result-emoji">⚠️</div>
          <h2 className="twoweek-result-title">잘못된 접근입니다</h2>
          <button className="twoweek-back-button" onClick={() => navigate('/')}>
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  // ✅ 점수별 분위기 색상 클래스
  let moodClass = '';
  if (score < 5) moodClass = 'twoweek-mood-good';
  else if (score < 10) moodClass = 'twoweek-mood-mid';
  else moodClass = 'twoweek-mood-critical';

  return (
    <div className="twoweek-result-container">
      <div className={`twoweek-result-card ${moodClass}`}>
        <div className="twoweek-result-emoji">📘</div>
        <h2 className="twoweek-result-title">나의 검사 결과는?</h2>

        <p className="twoweek-result-score">
          총 점수: <strong>{score}점</strong>
        </p>

        {/* ✅ 줄바꿈 반영된 메시지 출력 */}
        <p className="twoweek-result-message">
          {message.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        <button className="twoweek-back-button" onClick={() => navigate('/personality_test')}>
          자가진단 홈
        </button>
      </div>
    </div>
  );
}

export default SeniorTestResult;
