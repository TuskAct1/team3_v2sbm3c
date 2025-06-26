// src/pages/personality_test/LifestyleResult.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LifestyleResult.css';
import axios from 'axios';

function LifestyleResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  // ✅ 문자열 또는 객체 안의 result 필드에서 텍스트 추출
  const resultText = typeof result === 'string'
    ? result
    : result?.result ?? '';

  // ✅ 줄 단위로 나눈 결과 배열 (공백 제거)
  const resultLines = resultText
    .split('\n')  // 줄 단위로 나눔
    .map(line => line.trim())  // 앞뒤 공백 제거
    .filter(line => line !== '');  // 빈 줄 제거

  // ✅ 마지막 줄이 응원 메시지인지 판단 (시간 패턴이 아니면 응원 메시지로 간주)
  const lastLine = resultLines[resultLines.length - 1];
  const hasCheerMessage = lastLine && !/^\d{1,2}:\d{2}/.test(lastLine);

  // ✅ 응원 메시지 제외한 루틴 항목 추출
  const routineItems = resultLines
    .slice(0, hasCheerMessage ? -1 : undefined)
    .map(line => {
      const [time, ...activity] = line.split(' ');
      return { time, activity: activity.join(' ') };
    });

  // 🧾 결과 저장 함수
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:9093/lifestyle_test/save', {
        memberno: 1, // TODO: 로그인 연동 시 변경
        result: resultText
      });
      alert('📝 루틴이 저장되었어요!');
    } catch (err) {
      console.error('❌ 저장 실패:', err);
    }
  };

  // 🔁 다시 검사하기
  const handleRetry = () => {
    navigate('/lifestyle_test');
  };

  // 🔙 심리테스트 메인으로 이동
  const handleBack = () => {
    navigate('/personality_test');
  };

  return (
    <div className="lifestyle-result-container">
      <h2 className="result-title">🌿 GPT 맞춤 루틴 결과</h2>

      {routineItems.length > 0 ? (
        <div className="timeline">
          {routineItems.map((item, idx) => (
            <div className="timeline-item" key={idx}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-content">{item.activity}</div>
            </div>
          ))}

          {hasCheerMessage && (
            <div className="timeline-item">
              <div className="timeline-time">응원의 말</div>
              <div className="timeline-content">{lastLine}</div>
            </div>
          )}
        </div>
      ) : (
        <p className="error-msg">❌ 결과를 불러올 수 없습니다.</p>
      )}

      <div className="btn-group">
        <button className="retry-btn" onClick={handleRetry}>🔁 다시 생성하기</button>
        <button className="save-btn" onClick={handleSave}>🧾 결과 저장하기</button>
        <button className="back-btn" onClick={handleBack}>🔙 심리테스트로 돌아가기</button>
      </div>
    </div>
  );
}

export default LifestyleResult;
