import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState('');
  const memberno = localStorage.getItem("memberno");
  const navigate = useNavigate();

  useEffect(() => {
  axios.get("/api/quiz/random")
    .then(res => {
      console.log("퀴즈 객체 응답:", res.data);  // 👈 여기 확인!
      setQuiz(res.data);
    })
    .catch(() => alert("퀴즈 불러오기 실패"));
}, []);

  const handleAnswer = async (option) => {
    setSelected(option);
    setAnswered(true);

    const isCorrect = option === quiz.answer;

    if (isCorrect) {
      alert("정답입니다! 포인트 +10 🎉");

      try {
        await axios.post("/api/point/adjust", {
          memberno,
          pointChange: 10
        });

        await axios.post("/api/plant/increase-growth", {
          memberno,
          value: 2
        });

        await axios.post("/api/quiz/log", { memberno });

        setTimeout(() => {
          navigate('/plant', {
            state: {
              praise: "🎉 정답이에요! 포인트가 올라갔어요!"
            }
          });
        }, 1000);
      } catch (err) {
        alert("포인트 또는 성장도 증가 실패");
      }
    } else {
      alert("오답이에요. 정답은 '" + quiz.answer + "'입니다.");
    }
  };

  if (!quiz) {
    return <div>퀴즈 불러오는 중...</div>;
  }

  return (
    <div className="quiz-container">
      <h2>🌱 오늘의 퀴즈</h2>
      <p>{quiz.question}</p>
      <ul>
        {[quiz.option1, quiz.option2, quiz.option3, quiz.option4].map((opt, idx) => (
          <li key={idx}>
            <button
              className={`option-btn ${answered && opt === quiz.answer ? 'correct' : ''} ${answered && opt === selected && opt !== quiz.answer ? 'wrong' : ''}`}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizPage;
