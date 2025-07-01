import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Twoweek.css'; // 스타일은 별도 작성

// 🔹 PHQ-9 우울증 검사 문항
const questionList = [
  "일을 하는 것에 대한 흥미나 재미가 거의 없다.",
  "기분이 가라앉는 느낌이 들고, 우울함 또는 절망감을 느낀다.",
  "잠들기 어렵고 자꾸 잠에서 깨거나, 혹은 너무 많이 잔다.",
  "피로감 또는 기력이 저하된다.",
  "식욕이 저하되거나 과식을 한다.",
  "자신이 실패자라 느끼거나, 자신이나 가족에게 실망감을 준다.",
  "신문을 읽거나 TV를 볼 때 집중하기 어렵다.",
  "남들이 알아챌 정도로 말이나 행동이 느려지거나, 너무 초조하거나 안절부절한다.",
  "죽는 것이 낫겠다는 등의 생각을 하거나 또는 자해 시도를 한다."
];

const TwoweekQuestionnaire = () => {
  const [answers, setAnswers] = useState(Array(9).fill(null)); // 🔸 9개 문항에 대한 응답값 저장
  const [missingIndexes, setMissingIndexes] = useState([]);    // 🔸 미응답 문항 추적용
  const navigate = useNavigate();
  const questionRefs = useRef([]);                             // 🔸 문항 위치 스크롤용
  const synthRef = useRef(window.speechSynthesis);             // 🔸 음성 읽기 지원 객체

  // ✅ 문항 읽어주는 기능 (시니어 접근성 지원)
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저에서는 음성 지원을 사용할 수 없습니다.");
      return;
    }

    synthRef.current.cancel(); // 기존 읽기 중지
    const utter = new SpeechSynthesisUtterance(text); // 새로 읽기
    utter.lang = 'ko-KR';
    synthRef.current.speak(utter);
  };

  // ✅ 선택지 클릭 시 응답 업데이트
  const handleSelect = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // 선택한 문항은 missing에서 제거
    setMissingIndexes(prev => prev.filter(i => i !== index));
  };

  // ✅ 제출 버튼 클릭 시 동작
  const handleSubmit = async () => {
    // 🔸 응답 안 한 문항 찾아서 처리
    const missing = answers.map((a, i) => a === null ? i : null).filter(i => i !== null);

    if (missing.length > 0) {
      setMissingIndexes(missing); // 강조 표시용
      alert(`응답하지 않은 문항이 ${missing.length}개 있습니다.`);
      questionRefs.current[missing[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 🔸 총점 계산
    const totalScore = answers.reduce((acc, val) => acc + val, 0);

    // 🔸 결과 문구 판별
    let resultText = "";
    if (totalScore <= 4) resultText = "우울증 아님";
    else if (totalScore <= 9) resultText = "가벼운 우울증";
    else if (totalScore <= 14) resultText = "중간 정도 우울증";
    else if (totalScore <= 19) resultText = "중간 정도 우울증 (약물 고려)";
    else resultText = "심한 우울증 (즉각적인 치료 요함)";

    try {
      // ✅ 로그인한 사용자 정보 가져오기
      const user = JSON.parse(localStorage.getItem("user"));
      const memberno = user?.memberno;

      // 🔒 로그인 정보 없으면 저장 막기
      if (!memberno) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      // ✅ 서버에 검사 결과 저장
      await axios.post('http://localhost:9093/twoweek_test/create', {
        memberno: memberno,     // 로그인한 사용자 번호
        score: totalScore,      // 점수
        result: resultText      // 결과 텍스트
      });

      // ✅ 결과 페이지로 이동 (점수 전달)
      navigate('/twoweek_test/result', { state: { totalScore } });

    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("결과 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="twoweek-container">
      <h1>🧠 우울증 자가진단 (PHQ-9)</h1>
      <p className="twoweek-subtext">최근 2주간의 상태를 문항별로 체크해 주세요.</p>

      {/* 🔹 문항 출력 */}
      <div className="question-area">
        {questionList.map((q, i) => {
          const isMissing = missingIndexes.includes(i);
          return (
            <div
              key={i}
              className={`question-block ${isMissing ? 'missing' : ''}`}
              ref={el => questionRefs.current[i] = el}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p className={`question-text ${isMissing ? 'highlight-missing' : ''}`}>
                  {i + 1}. {q}
                </p>
                {/* 🔊 음성 읽기 버튼 */}
                <button
                  type="button"
                  className="speak-btn"
                  onClick={() => handleSpeak(`${q}`)}
                >
                  📢
                </button>
              </div>

              {/* 🔸 선택지 0~3 */}
              <div className="radio-group">
                {[0, 1, 2, 3].map(val => (
                  <label key={val} className="radio-option">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={val}
                      checked={answers[i] === val}
                      onChange={() => handleSelect(i, val)}
                    />
                    {['전혀 아님', '며칠 동안', '일주일 이상', '거의 매일'][val]}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔘 결과 제출 버튼 */}
      <button className="submit-btn" onClick={handleSubmit}>
        결과 보기
      </button>
    </div>
  );
};

export default TwoweekQuestionnaire;
