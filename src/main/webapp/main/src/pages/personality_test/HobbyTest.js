// ✅ SeniorHobbyTest.js - 질문 한 장씩 / 수동 제출 / 카드 외부 결과보기 버튼 (질문 없이)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HobbyTest.css';
import './LifestyleTest.css'; // 진행률/버튼 스타일

const questions = [
  "혼자 있는 시간이 편하고 좋다.",
  "손으로 무언가를 만들거나 조립하는 게 재미있다.",
  "산책이나 걷기 같은 가벼운 운동을 좋아한다.",
  "다른 사람들과 함께 활동하거나 이야기하는 게 즐겁다.",
  "내 감정이나 생각을 글이나 그림으로 표현하고 싶을 때가 있다.",
  "뭔가에 집중하다 보면 시간 가는 줄 모를 때가 있다.",
  "색깔이나 소품, 분위기 꾸미는 걸 좋아한다.",
  "규칙적인 활동을 잘 해내는 편이다.",
  "요리나 정리처럼 실생활에 필요한 활동에서 기쁨을 느낀다.",
  "무대나 사람 앞에서 내 이야기를 나누는 것도 재미있다."
];

const options = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '아니다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' }
];

const resultTypes = {
  A: {
    title: "조용한 힐링형",
    hobbies: ["정원 가꾸기", "클래식 감상", "다도", "명상"],
    desc: "조용히 나를 돌아보며 시간을 보내는 게 잘 맞아요."
  },
  B: {
    title: "집중 몰입형",
    hobbies: ["캘리그라피", "퍼즐", "수채화", "DIY 공예"],
    desc: "무언가를 만들고 집중하는 순간이 행복한 당신!"
  },
  C: {
    title: "생활 실용형",
    hobbies: ["요리", "걷기 루틴", "정리수납", "레시피북 만들기"],
    desc: "생활 속에서 기쁨을 찾는 타입이에요."
  },
  D: {
    title: "사람 중심형",
    hobbies: ["합창단", "웃음치료", "동아리 활동", "탁구"],
    desc: "사람들과 함께하는 시간에서 에너지를 얻는 분이에요!"
  },
  E: {
    title: "감성 표현형",
    hobbies: ["회상 일기", "사연 쓰기", "추억 음악", "포토북"],
    desc: "감정과 기억을 표현하고 나누는 걸 좋아하는 감성가예요."
  },
  F: {
    title: "도전 성장형",
    hobbies: ["스마트폰 배우기", "악기", "외국어", "영상 만들기"],
    desc: "배우는 것과 도전에서 활력을 얻는 스타일입니다."
  }
};

const calculateResult = (scores) => {
  const typeScores = {
    A: scores[0] + scores[4] + scores[6],
    B: scores[1] + scores[5] + scores[7],
    C: scores[2] + scores[8],
    D: scores[3] + scores[9],
    E: scores[4] + scores[5] + scores[6],
    F: scores[7] + scores[8] + scores[9]
  };
  return resultTypes[Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0][0]];
};

function SeniorHobbyTest() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [isDone, setIsDone] = useState(false); // ✅ 제출 준비 상태

  const handleSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setIsDone(true); // 마지막 문항까지 응답 → 질문 숨기고 버튼만
    }
  };

  const handleSubmit = () => {
    const res = calculateResult(answers);
    setResult(res);
  };

  // ✅ 진행률 계산 - 마지막일 경우 100%로 표시
  const displayQ = isDone ? questions.length : current + 1;
  const progressPercent = isDone
    ? 100
    : Math.round((current / questions.length) * 100);

  return (
    <div className="senior-hobby-container">
      <h1 className="senior-hobby-title">🎯 나에게 어울리는 취미 찾기</h1>

      {/* ✅ 진행률 표시 */}
      {!result && (
        <>
          <p className="lifestyle-test-progress">
            문항 {displayQ} / {questions.length}
          </p>
          <div className="lifestyle-test-progress-bar">
            <div
              className="lifestyle-test-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </>
      )}

      {/* ✅ 질문 카드 or 결과버튼 */}
      {!result ? (
        !isDone ? (
          <div className="senior-hobby-question-card">
            <p className="senior-hobby-question-text">
              {displayQ}. {questions[current]}
            </p>

            <div className="senior-hobby-option-label-row">
              {options.map((opt) => (
                <div key={opt.value} className="senior-hobby-option-label">{opt.label}</div>
              ))}
            </div>

            <div className="senior-hobby-circle-row">
              {options.map((opt) => (
                <label key={opt.value} className="senior-hobby-circle-option">
                  <input
                    type="radio"
                    name={`q${current}`}
                    value={opt.value}
                    checked={answers[current] === opt.value}
                    onChange={() => handleSelect(opt.value)}
                  />
                  <div className="senior-hobby-circle">{opt.value}</div>
                </label>
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
        )
      ) : (
        <div className="senior-hobby-result-box">
          <h2>✅ 당신은 <span className="text-green-700">{result.title}</span>입니다!</h2>
          <p>{result.desc}</p>

          <div className="mt-4">
            <p className="font-medium">🎈 추천 취미</p>
            <ul>
              {result.hobbies.map((hobby, idx) => (
                <li key={idx}>🌿 {hobby}</li>
              ))}
            </ul>
          </div>

          <div className="senior-hobby-result-button-group">
            <button
              onClick={() => {
                setResult(null);
                setAnswers([]);
                setCurrent(0);
                setIsDone(false); // 상태 초기화
              }}
              className="reset-btn"
            >
              다시 하기
            </button>
            <button
              onClick={() => navigate('/personality_test')}
              className="back-btn"
            >
              자가진단 홈
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeniorHobbyTest;
