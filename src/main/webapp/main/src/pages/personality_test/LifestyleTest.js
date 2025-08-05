import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifestyleTest.css';  // 💚 고유 스타일 CSS
import axios from 'axios';

function LifestyleTest() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 문항 번호
  const [answers, setAnswers] = useState({}); // 사용자 응답 저장 객체
  const [loading, setLoading] = useState(false); // 결과 가져오는 중 상태
  const [isDone, setIsDone] = useState(false); // 마지막 문항까지 완료 여부

  const questions = [
    {
      id: 1,
      text: '아침에 일어나면 가장 먼저 하는 일은 무엇인가요?',
      options: ['물 마시기', 'TV/스마트폰 켜기', '스트레칭이나 산책', '다시 눕거나 멍 때리기'],
    },
    {
      id: 2,
      text: '아침 식사는 주로 어떻게 하시나요?',
      options: ['정해진 시간에 매일 챙겨 먹는다', '배고프면 먹는다', '거의 거른다', '누군가 챙겨줄 때만 먹는다'],
    },
    {
      id: 3,
      text: '하루 중 가장 활력이 느껴지는 시간대는 언제인가요?',
      options: ['아침 6~10시', '점심 11~14시', '오후 15~18시', '저녁 이후'],
    },
    {
      id: 4,
      text: '요즘 가장 즐겁다고 느끼는 시간은 언제인가요?',
      options: ['혼자 조용히 있을 때', '가족과 통화할 때', '무언가에 집중할 때', '밖에 나가 있을 때'],
    },
    {
      id: 5,
      text: '가장 지루하거나 무기력하다고 느끼는 시간은?',
      options: ['오전', '오후', '저녁', '그런 시간 없다'],
    },
    {
      id: 6,
      text: '하루 중 몸을 가장 많이 움직이는 시간대는?',
      options: ['오전', '오후', '저녁', '거의 움직이지 않는다'],
    },
    {
      id: 7,
      text: '혼자 있는 시간이 길면 어떤 기분이 드나요?',
      options: ['괜찮다, 익숙하다', '가끔 외롭다', '마음이 허전하다', '답답하고 우울하다'],
    },
    {
      id: 8,
      text: '가장 자주 하는 여가 활동은 무엇인가요?',
      options: ['TV 시청/스마트폰', '산책이나 운동', '책, 라디오, 음악 감상', '가족이나 친구와 연락'],
    },
    {
      id: 9,
      text: '요즘 가장 해보고 싶은 활동은 무엇인가요?',
      options: ['새로운 취미 배우기', '건강 관리 시작하기', '추억 정리', '가족이나 친구와 소통'],
    },
    {
      id: 10,
      text: '하루 일과는 어떤 방식으로 움직이나요?',
      options: ['계획적으로 움직인다', '기분에 따라 움직인다', '반반 섞여 있다', '정해진 일과 없이 흐른다'],
    },
    {
      id: 11,
      text: '최근 일주일간 외출 빈도는 어떤가요?',
      options: ['매일 외출', '일주일에 2~3번', '한 번 정도', '거의 안 나감'],
    },
    {
      id: 12,
      text: '주변에 자주 연락하거나 만나는 사람이 있나요?',
      options: ['매일 연락하는 가족이나 친구 있음', '가끔 연락하는 사람 있음', '거의 없음', '연락하고 싶은데 어렵다'],
    },
    {
      id: 13,
      text: '다음 중 가장 자주 사용하는 기기는 무엇인가요?',
      options: ['스마트폰', 'TV', '라디오', '기기 사용 안함'],
    },
    {
      id: 14,
      text: '잠들기 전 보통 무엇을 하시나요?',
      options: ['TV/스마트폰 보기', '책이나 라디오', '가족과 통화', '바로 잠든다'],
    },
    {
      id: 15,
      text: '최근 일주일 동안 자주 느낀 감정은 무엇인가요?',
      options: ['기쁨, 감사', '지루함, 무기력', '불안, 걱정', '외로움'],
    },
    {
      id: 16,
      text: '가장 원하는 생활 루틴 방향은 무엇인가요?',
      options: ['규칙적인 생활', '활동적인 생활', '마음이 편안한 생활', '사람들과 어울리는 생활'],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleOptionSelect = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    // 다음 질문으로 이동
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsDone(true); // ✅ 마지막 문항 응답 완료 → 결과 보기 버튼 노출
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://121.78.128.139:9093/lifestyle_test/submit', answers);
      navigate('/lifestyle_test/result', {
        state: { result: res.data } // GPT 결과를 다음 페이지에 넘김
      });
    } catch (err) {
      console.error('❌ 결과 전송 실패:', err);
      alert('결과를 가져오는 데 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((currentQuestionIndex + (isDone ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="lifestyle-test-container">
      <h2 className="lifestyle-test-title">🛋️ 생활 루틴 맞춤 추천</h2>

      <p className="lifestyle-test-progress">
        문항 {Math.min(currentQuestionIndex + 1, totalQuestions)} / {totalQuestions}
      </p>

      <div className="lifestyle-test-progress-bar">
        <div
          className="lifestyle-test-progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {loading ? (
        <div className="lifestyle-test-loading-box">✨ 결과를 불러오는 중입니다...</div>
      ) : (
        <>
          {!isDone ? (
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
        </>
      )}
    </div>
  );
}

export default LifestyleTest;
