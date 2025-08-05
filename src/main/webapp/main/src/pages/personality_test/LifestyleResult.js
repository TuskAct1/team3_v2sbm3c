// src/pages/personality_test/LifestyleResult.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LifestyleResult.css';
import axios from 'axios';

function LifestyleResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result; // GPT에서 받은 결과

  const resultText = typeof result === 'string'
    ? result // result가 문자열이면 그대로 씀 
    : result?.result ?? ''; // result.result 형태면 그 안에서 꺼냄 (예외 처리용)

  // 줄 단위로 나눈 결과 배열 
  const resultLines = resultText
    .split('\n')  // 줄 단위로 나눔
    .map(line => line.trim())  // 앞뒤 공백 제거
    .filter(line => line !== '');  // 빈 줄 제거

  // 마지막 줄이 응원 메시지인지 판단 (시간 패턴이 아니면 응원 메시지로 간주)
  const lastLine = resultLines[resultLines.length - 1];
  const hasCheerMessage = lastLine && !/^\d{1,2}:\d{2}/.test(lastLine);

  const routineItems = resultLines // 응원 문장 빼고 루틴만 가져옴
    .slice(0, hasCheerMessage ? -1 : undefined)
    .map(line => {
      const [time, ...activity] = line.split(' '); // 시간과 활동을 분리해서 객체로 저장. 예: { time: '07:00', activity: '기상 및 스트레칭' }
      return { time, activity: activity.join(' ') };
    });

  // 결과 저장 함수 (로그인 연동)
  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const memberno = user?.memberno;

      if (!memberno) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      await axios.post('http://121.78.128.139:9093/lifestyle_test/save', {
        memberno: memberno,
        result: resultText
      });
      alert('📝 루틴이 저장되었어요!');
    } catch (err) {
      console.error('❌ 저장 실패:', err);
      alert('저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  // 다시 검사하기
  const handleRetry = () => {
    navigate('/lifestyle_test');
  };

  // 심리테스트 메인으로 이동
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
        <button className="result-retry-btn" onClick={handleRetry}>다시 생성하기</button>
        <button className="result-test-save-btn" onClick={handleSave}>결과 저장하기</button>
        <button className="result-back-btn" onClick={handleBack}>자가진단 홈</button>
      </div>
    </div>
  );
}

export default LifestyleResult;
