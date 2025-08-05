// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './QuizPage.css';

// const QuizPage = ({ onBack }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [answered, setAnswered] = useState(false);
//   const [selected, setSelected] = useState('');
//   const memberno = localStorage.getItem("memberno");
//   const navigate = useNavigate();

//   useEffect(() => {
//   axios.get("/api/quiz/random")
//     .then(res => {
//       console.log("퀴즈 객체 응답:", res.data);  // 👈 여기 확인!
//       setQuiz(res.data);
//     })
//     .catch(() => alert("퀴즈 불러오기 실패"));
// }, []);


//   // const handleAnswer = async (option) => {
//   //   setSelected(option);
//   //   setAnswered(true);

//   //   const isCorrect = option === quiz.answer;

//   //   if (isCorrect) {
//   //     alert("정답입니다! 포인트 +10 🎉");

//   //     try {
//   //       await axios.post("/api/point/adjust", {
//   //         memberno,
//   //         pointChange: 10
//   //       });

//   //       await axios.post("/api/plant/increase-growth", {
//   //         memberno,
//   //         value: 2
//   //       });

//   //       await axios.post("/api/quiz/log", { memberno });

//   //       setTimeout(() => {
//   //         navigate('/plant', {
//   //           state: {
//   //             praise: "🎉 정답이에요! 포인트가 올라갔어요!"
//   //           }
//   //         });
//   //       }, 1000);
//   //     } catch (err) {
//   //       alert("포인트 또는 성장도 증가 실패");
//   //     }
//   //   } else {
//   //     alert("오답이에요. 정답은 '" + quiz.answer + "'입니다.");
//   //   }
//   // };

//   // if (!quiz) {
//   //   return <div>퀴즈 불러오는 중...</div>;
//   // }

//   const handleAnswer = async (opt) => {
//     setSelected(opt);
//     setAnswered(true);
//     const isCorrect = opt === quiz.answer;

//     if (isCorrect) {
//       await axios.post('/api/point/adjust', { memberno: quiz.memberno, pointChange: 10 });
//       await axios.post('/api/plant/increase-growth', { memberno: quiz.memberno, value: 2 });
//       await axios.post('/api/quiz/log', { memberno: quiz.memberno });
//       alert('정답! +10P, +2% 성장');
//     } else {
//       alert(`오답! 정답은 "${quiz.answer}"이에요.`);
//     }

//     // 1초 후 메인 메뉴로 복귀
//     setTimeout(onBack, 1000);
//   };

//  return (
//     <div className="quiz-container">
//       <h3>오늘의 퀴즈</h3>
//       <p>{quiz.question}</p>
//       <div className="grid grid-cols-2 gap-2">
//         {[quiz.option1, quiz.option2, quiz.option3, quiz.option4].map(opt => (
//           <button
//             key={opt}
//             onClick={() => handleAnswer(opt)}
//             disabled={answered}
//             className={`quiz-btn
//               ${answered && opt === quiz.answer ? 'correct' : ''}
//               ${answered && opt === selected && opt !== quiz.answer ? 'wrong' : ''}
//             `}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//       <button onClick={onBack} className="back-btn">돌아가기</button>
//     </div>
//   );
// };

// export default QuizPage;     
// src/pages/plant/quiz/QuizPage.js

// src/pages/plant/quiz/QuizPage.js
// src/pages/plant/quiz/QuizPage.js// src/pages/plant/quiz/QuizPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizPage.css';

export default function QuizPage({ onBack }) {
  const [memberno, setMemberno] = useState(null);
  const [quiz, setQuiz]         = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState('');

  // 👉 1) 마운트 시 session 또는 localStorage 에서 memberno 가져오기
  useEffect(() => {
    axios.get('http://121.78.128.139:9093/api/quiz/session')
      .then(res => {
        setMemberno(res.data.memberno);
      })
      .catch(() => {
        const stored = Number(localStorage.getItem('memberno'));
        setMemberno(isNaN(stored) ? null : stored);
      });
  }, []);

  useEffect(() => {
    axios.get('http://121.78.128.139:9093/api/quiz/random')  // 👉 절대 URL로 변경
      .then(res => setQuiz(res.data))
      .catch(() => alert('퀴즈 불러오기 실패'));
  }, []);

  if (!quiz) {
    return <div className="quiz-loading">퀴즈 불러오는 중…</div>;
  }

  const handleAnswer = async (opt) => {
    setSelected(opt);
    setAnswered(true);

    if (opt === quiz.answer) {
      try {
        if (memberno == null) {
          alert('사용자 정보를 불러올 수 없습니다.');
          return;
        }

        // ✅ 포인트 지급
        await axios.post(
          'http://121.78.128.139:9093/api/point/adjust',
          { memberno, pointChange: 10 },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // ✅ 퀴즈 로그 기록
        await axios.post(
          'http://121.78.128.139:9093/api/quiz/log',
          { memberno },
          { headers: { 'Content-Type': 'application/json' } }
        );

        alert('정답입니다! +10P');
      } catch (err) {
        console.error('❌ 처리 오류', err.response?.data || err.message);
        alert('오류 발생');
      }
    } else {
      alert(`오답입니다. 정답은 "${quiz.answer}"`);
    }

    setTimeout(onBack, 1000);
  };


  return (
    <div className="quiz-card">
      <h2 className="quiz-title">오늘의 퀴즈</h2>
      <p className="quiz-question">{quiz.question}</p>

      <div className="quiz-options">
        {[quiz.option1, quiz.option2, quiz.option3, quiz.option4].map((opt, i) => (
          <button
            key={i}
            className={`
              option-btn
              ${answered && opt === quiz.answer ? 'correct' : ''}
              ${answered && opt === selected && opt !== quiz.answer ? 'wrong' : ''}
            `}
            onClick={() => handleAnswer(opt)}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>

      <button className="back-btn" onClick={onBack}>
        돌아가기
      </button>
    </div>
  );
}
