// ✅ MemoryTest.js - lifestyle 스타일 구조 + 진행률 바 100% 버그 수정 + 수동 제출
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryQuestions, options } from './MemoryData';
import './LifestyleTest.css'; // ✅ 스타일 재사용

function MemoryTest() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);         // 현재 질문 인덱스
  const [answers, setAnswers] = useState([]);          // 사용자의 응답
  const [isDone, setIsDone] = useState(false);         // 모든 문항 완료 여부

  // ✅ 각 선택지 클릭 시 실행되는 함수
  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQ + 1 < memoryQuestions.length) {
      setCurrentQ(currentQ + 1); // 다음 문항으로 이동
    } else {
      setIsDone(true); // 마지막 문항까지 완료되면 버튼만 보여줌
    }
  };

  // ✅ 결과 제출
  const handleSubmit = () => {
    const totalScore = answers.reduce((sum, v) => sum + v, 0);
    navigate('/memory_test/result', { state: { totalScore } });
  };

  // ✅ 진행률 계산 (마지막 문항 완료 시 100% 되도록 처리)
  const displayQ = isDone ? memoryQuestions.length : currentQ + 1;
  const progressPercent = isDone
    ? 100
    : Math.round((currentQ / memoryQuestions.length) * 100);

  return (
    <div className="lifestyle-test-container">
      <h2 className="lifestyle-test-title">🧠 기억력 자가진단 테스트</h2>

      {/* ✅ 현재 몇 번째 문항인지 + 진행률 바 */}
      <p className="lifestyle-test-progress">
        문항 {displayQ} / {memoryQuestions.length}
      </p>
      <div className="lifestyle-test-progress-bar">
        <div
          className="lifestyle-test-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!isDone ? (
        // ✅ 질문 카드 표시
        <div className="lifestyle-test-question-card">
          <p className="lifestyle-test-question-text">
            {memoryQuestions[currentQ].text}
          </p>
          <div className="lifestyle-test-option-list">
            {options.map((opt) => (
              <button
                key={opt.score}
                onClick={() => handleAnswer(opt.score)}
                className="lifestyle-test-option-button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // ✅ 결과 보기 버튼만 표시 (질문 카드 없음)
        <div className="lifestyle-test-loading-box">
          <button
            className="lifestyle-test-option-button"
            onClick={handleSubmit}
          >
            결과 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryTest;
