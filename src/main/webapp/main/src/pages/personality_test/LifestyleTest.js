// src/pages/lifestyle_test/LifestyleTest.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifestyleTest.css';  // 💚 고유 스타일 CSS
import axios from 'axios';

function LifestyleTest() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      text: '하루 중 가장 활력이 넘치는 시간대는 언제인가요?',
      options: ['아침 (6~10시)', '점심 이후 (11~15시)', '저녁 (16~20시)', '밤늦게 (21시 이후)'],
    },
    {
      id: 2,
      text: '하루 중 가장 즐거운 활동은 무엇인가요?',
      options: ['산책이나 가벼운 운동', '책 읽기, 음악 듣기', '요리, 정리정돈 등 손 쓰는 활동', '사람들과 이야기하기'],
    },
    {
      id: 3,
      text: '최근 가장 해보고 싶은 활동은 무엇인가요?',
      options: ['새로운 취미 시작', '건강 관리', '추억 정리', '가족이나 친구와 소통'],
    },
    {
      id: 4,
      text: '하루 중 가장 지루하거나 무기력한 시간은 언제인가요?',
      options: ['오전', '오후', '저녁', '없다'],
    },
    {
      id: 5,
      text: '혼자 있는 시간은 어떤가요?',
      options: ['혼자가 편하다', '가끔 외롭다', '사람들과 함께 있는 걸 좋아한다', '누군가와 꼭 함께 있어야 한다'],
    },
    {
      id: 6,
      text: '생활 방식은 어떤 편인가요?',
      options: ['계획적으로 움직이는 편', '기분 따라 움직인다', '계획 + 융통성 혼합', '잘 모르겠다'],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleOptionSelect = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:9093/lifestyle_test/submit', finalAnswers);
      navigate('/lifestyle_test/result', {
        state: { result: res.data }
      });
    } catch (err) {
      console.error('❌ 결과 전송 실패:', err);
      alert('결과를 가져오는 데 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lifestyle-test-container">
      <h2 className="lifestyle-test-title">🛋️ 나의 생활 스타일 진단</h2>

      <p className="lifestyle-test-progress">
        질문 {currentQuestionIndex + 1} / {totalQuestions}
      </p>

      <div className="lifestyle-test-progress-bar">
        <div
          className="lifestyle-test-progress-fill"
          style={{
            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
          }}
        ></div>
      </div>

      {loading ? (
        <div className="lifestyle-test-loading-box">✨ 결과를 불러오는 중입니다...</div>
      ) : (
        <>
          <div className="lifestyle-test-question-card">
            <p className="lifestyle-test-question-text">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </p>

            <div className="lifestyle-test-option-list">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="lifestyle-test-option-button"
                  onClick={() => handleOptionSelect(opt)}
                  disabled={loading}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LifestyleTest;
