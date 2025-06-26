import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifestyleTest.css';      // 💚 시니어용 스타일 불러오기
import axios from 'axios';         // 📡 서버와 통신용

function LifestyleTest() {
  const navigate = useNavigate();  // 🔹 페이지 이동 함수

  // 🔸 현재 몇 번째 질문인지 저장
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // 🔸 각 질문에 대한 사용자의 답 저장
  const [answers, setAnswers] = useState({});

  // 🔸 결과 요청 중인지 확인하는 로딩 상태
  const [loading, setLoading] = useState(false);

  // 🔸 질문 목록 (id, 질문내용, 선택지)
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

  // 🔸 현재 질문 객체
  const currentQuestion = questions[currentQuestionIndex];

  /**
   * ✅ 사용자가 선택지를 클릭했을 때 실행
   * → 답변 저장하고 다음 질문으로 이동
   */
  const handleOptionSelect = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    // 마지막 질문이면 제출, 아니면 다음 질문
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(updatedAnswers); // 결과 전송
    }
  };

  /**
   * ✅ 답변을 서버에 전송하고 결과 페이지로 이동
   */
  const handleSubmit = async (finalAnswers) => {
    setLoading(true); // 로딩 시작
    try {
      const res = await axios.post('http://localhost:9093/lifestyle_test/submit', finalAnswers);

      // 📦 결과 페이지로 이동 (res.data에 루틴 결과 포함됨)
      navigate('/lifestyle_test/result', {
        state: { result: res.data }
      });
    } catch (err) {
      console.error('❌ 결과 전송 실패:', err);
      alert('결과를 가져오는 데 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="lifestyle-container">
      <h2 className="title">🛋️ 나의 생활 스타일 진단</h2>

      {/* ✅ 로딩 중일 때 표시 */}
      {loading ? (
        <div className="loading-box">✨ 결과를 불러오는 중입니다...</div>
      ) : (
        <>
          {/* ✅ 현재 질문 박스 */}
          <div className="question-card">
            <p className="question-text">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </p>

            {/* ✅ 선택지 버튼들 */}
            <div className="option-list">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="option-button"
                  onClick={() => handleOptionSelect(opt)}
                  disabled={loading}  // 중복 클릭 방지
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ 진행도 표시 */}
          <p className="progress">
            질문 {currentQuestionIndex + 1} / {questions.length}
          </p>
        </>
      )}
    </div>
  );
}

export default LifestyleTest;
