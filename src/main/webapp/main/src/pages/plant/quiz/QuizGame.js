// src/pages/plant/QuizGame.js
import React, { useState } from 'react';

const quizData = [
  {
    question: "이 과일의 이름은 무엇일까요?",
    image: "/images/quiz/apple.png",
    choices: ["사과", "배", "복숭아"],
    answer: "사과",
  },
  {
    question: "다음 숫자를 기억하세요: 351",
    choices: ["351", "315", "513"],
    answer: "351",
  },
  {
    question: "속담을 완성하세요: 가는 말이 고와야 ○○○ ○○다",
    choices: ["오는 말이 곱", "마음이 곱", "밥이 맛있"],
    answer: "오는 말이 곱",
  },
];

const QuizGame = ({ onSuccess }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (choice) => {
    const correct = quizData[current].answer;
    if (choice === correct) {
      alert("정답입니다! 🎉 포인트 +10, 성장도 +5");
      setScore(score + 1);
    } else {
      alert("아쉬워요! 다시 도전해보세요~");
    }

    const next = current + 1;
    if (next < quizData.length) {
      setCurrent(next);
    } else {
      onSuccess(score); // 부모에게 성공 결과 전달
    }
  };

  const q = quizData[current];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🧠 두뇌 퀴즈</h2>
      <p>{q.question}</p>
      {q.image && <img src={q.image} alt="quiz" width="200" />}
      <div style={{ marginTop: "10px" }}>
        {q.choices.map((c, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(c)}
            style={{ margin: "5px", fontSize: "18px", padding: "10px 20px" }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizGame;
