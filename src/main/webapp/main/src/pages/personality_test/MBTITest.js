// ✅ MBTITest.js - lifestyle 스타일 구조로 통일 + 진행률 버그 수정
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifestyleTest.css'; // ✅ lifestyle 스타일 재사용

const mbtiQuestions = [
  { id: 1, question: '누군가와 이야기하면 기분이 좋아진다', type: 'E' },
  { id: 2, question: '혼자 있는 시간이 마음이 편하다', type: 'I' },
  { id: 3, question: '처음 보는 사람과도 쉽게 이야기한다', type: 'E' },
  { id: 4, question: '사람 많은 자리는 좀 피곤하다', type: 'I' },
  { id: 5, question: '하루하루 눈앞의 일에 집중하는 편이다', type: 'S' },
  { id: 6, question: '앞으로 일어날 일을 자주 상상한다', type: 'N' },
  { id: 7, question: '과거의 경험이 지금을 살아가는 데 중요하다', type: 'S' },
  { id: 8, question: '가끔은 느낌이 더 믿음직할 때가 있다', type: 'N' },
  { id: 9, question: '무엇이 옳은가를 먼저 생각한다', type: 'T' },
  { id: 10, question: '상대방의 마음이 다치지 않게 하려고 한다', type: 'F' },
  { id: 11, question: '문제를 해결할 땐 이성적으로 생각하려 한다', type: 'T' },
  { id: 12, question: '마음이 따뜻한 사람이 좋다', type: 'F' },
  { id: 13, question: '계획을 세우면 마음이 놓인다', type: 'J' },
  { id: 14, question: '그때그때 기분 따라 움직이는 걸 좋아한다', type: 'P' },
  { id: 15, question: '준비를 철저히 해야 마음이 편하다', type: 'J' },
  { id: 16, question: '예상치 못한 일도 잘 받아들인다', type: 'P' },
];

function MBTITest() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (type) => {
    const currentQuestion = mbtiQuestions[currentQuestionIndex];
    setAnswers({ ...answers, [currentQuestion.id]: type });
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach((type) => {
      if (type) counts[type]++;
    });

    const EI = counts.E >= counts.I ? 'E' : 'I';
    const SN = counts.S >= counts.N ? 'S' : 'N';
    const TF = counts.T >= counts.F ? 'T' : 'F';
    const JP = counts.J >= counts.P ? 'J' : 'P';

    navigate('/mbti-result', { state: { mbti: EI + SN + TF + JP } });
  };

  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  const displayIndex = Math.min(currentQuestionIndex + 1, mbtiQuestions.length);
  const progressPercent = Math.min(
    Math.round((currentQuestionIndex / mbtiQuestions.length) * 100),
    100
  );

  return (
    <div className="lifestyle-test-container">
      <h2 className="lifestyle-test-title">🧩 MBTI 성격유형 테스트</h2>

      <p className="lifestyle-test-progress">
        문항 {displayIndex} / {mbtiQuestions.length}
      </p>
      <div className="lifestyle-test-progress-bar">
        <div
          className="lifestyle-test-progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {currentQuestionIndex < mbtiQuestions.length ? (
        <div className="lifestyle-test-question-card">
          <p className="lifestyle-test-question-text">
            {currentQuestion.question}
          </p>
          <div className="lifestyle-test-option-list">
            <button
              className="lifestyle-test-option-button"
              onClick={() => handleAnswer(currentQuestion.type)}
            >
              그렇다
            </button>
            <button
              className="lifestyle-test-option-button"
              onClick={() => handleAnswer('')}
            >
              아니다
            </button>
          </div>
        </div>
      ) : (
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

export default MBTITest;
