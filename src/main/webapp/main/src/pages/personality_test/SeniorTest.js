import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeniorTest.css';

const questionList = [
  { id: 1, text: '현재의 생활에 대체적으로 만족하십니까?', reverse: true },
  { id: 2, text: '요즘 들어 활동량이나 의욕이 많이 떨어지셨습니까?', reverse: false },
  { id: 3, text: '자신이 헛되이 살고 있다고 느끼십니까?', reverse: false },
  { id: 4, text: '생활이 지루하게 느껴질 때가 많습니까?', reverse: false },
  { id: 5, text: '평소 기분은 좋은 편이십니까?', reverse: true },
  { id: 6, text: '자신에게 불길한 일이 생길 것 같아 불안하십니까?', reverse: false },
  { id: 7, text: '대체로 마음이 즐거운 편이십니까?', reverse: true },
  { id: 8, text: '의욕이 없고 삶이 절망적이라는 느낌이 자주 드십니까?', reverse: false },
  { id: 9, text: '바깥에 나가기가 싫고 집에만 있고 싶습니까?', reverse: false },
  { id: 10, text: '비슷한 나이의 다른 노인들보다 기억력이 더 나쁘다고 느낍니까?', reverse: false },
  { id: 11, text: '현재 살아 있다는 것이 즐겁게 생각 되십니까?', reverse: true },
  { id: 12, text: '지금의 내 자신이 아무 쓸모없는 사람이라고 느끼십니까?', reverse: false },
  { id: 13, text: '기력이 좋은 편이 십니까?', reverse: true },
  { id: 14, text: '지금 자신의 처지가 아무런 희망도 없다고 느끼십니까?', reverse: false },
  { id: 15, text: '자신이 다른 사람들의 처지보다 더 못한다고 생각하십니까?', reverse: false },
];

function SeniorTest() {
  const [answers, setAnswers] = useState({});  // 사용자가 체크한 응답들
  const [unansweredIds, setUnansweredIds] = useState([]);  // 미응답 문항 ID들
  const questionRefs = useRef([]);  // 문항 줄에 스크롤할 수 있게 DOM 저장
  const synthRef = useRef(window.speechSynthesis);  // 음성 재생 제어
  const navigate = useNavigate();  // 페이지 이동

  // 🔹 사용자가 선택한 답을 answers에 저장. 미응답 문항 목록에서 해당 문항 제거
  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));  
    setUnansweredIds(prev => prev.filter(unId => unId !== id));
  };

  // 🔹 음성 읽기 기능
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저에서는 음성 지원을 사용할 수 없습니다.");
      return;
    }
    synthRef.current.cancel(); // 이전 음성 취소
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    synthRef.current.speak(utter);
  };

  // 🔹 제출 처리
  const handleSubmit = async () => {
    const newUnanswered = questionList  // 미응답 문항 강조
      .filter(q => !answers[q.id])  
      .map(q => q.id);  

    // ❗ 미응답 문항 있을 경우 강조 표시
    if (newUnanswered.length > 0) {
      setUnansweredIds(newUnanswered);
      const firstRef = questionRefs.current[newUnanswered[0]];
      if (firstRef) {
        firstRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      alert(`응답하지 않은 문항이 ${newUnanswered.length}개 있습니다.`);
      return;
    }

    // 🔸 점수 계산
    let score = 0;
    questionList.forEach(q => {
      const answer = answers[q.id];
      if (q.reverse) {
        if (answer === 'no') score += 1;  // reverse=true → '아니오'가 1점
      } else {
        if (answer === 'yes') score += 1;  // reverse=false → '예'가 1점
      }
    });

    // ✅ 요약 결과만 DB 저장용으로 사용
    const summaryText =
      score >= 10
        ? '⚠️ 현재 우울감이 높게 나타났어요.'
        : '😊 현재로서는 우울감이 낮은 편입니다.';

    // ✅ 긴 메시지는 결과 페이지 출력용으로만 사용
    const message =
      score >= 10
        ? '⚠️ 현재 우울감이 높게 나타났어요.\n\nAI 친구 토닥이가 곁에서 먼저 이야기를 들어줄게요.\n필요하다면 정신건강 전문가의 상담도 함께 받아보는 걸 추천드려요.'
        : '😊 현재로서는 우울감이 낮은 편입니다.\n\n앞으로도 토닥이와 함께 건강한 마음을 지켜나가요!';

    try {
      const response = await axios.post('http://localhost:9093/personality_test/create', {  // ← 백엔드에서 ResponseEntity 응답 옴

        personalitytestno: 0,
        memberno: 1,
        score: score,
        result: summaryText  // ✅ DB에는 요약 텍스트만 저장
      });

      if (response.status === 200) {  // 등록 성공한 상태
        // 🔸 결과 페이지로 이동하면서 긴 메시지 함께 전달
        navigate('/senior_test/result', { state: { score, message } });
      }
    } catch (err) {
      console.error('저장 실패', err);
      alert('결과 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="questionnaire-container">
      <h1 className="questionnaire-title">노인우울증 검사 (SGDS-K)</h1>

      <table className="questionnaire-table">
        <thead>
          <tr>
            <th className="center-th">문항</th>
            <th className="question-th">질문</th>
            <th className="center-th">예</th>
            <th className="center-th">아니오</th>
          </tr>
        </thead>
        <tbody>
          {questionList.map((q, idx) => (
            <tr key={q.id} ref={el => (questionRefs.current[q.id] = el)}>
              <td className="center-td">{idx + 1}</td>
              <td className={`left-td ${unansweredIds.includes(q.id) ? 'unanswered-question' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{q.text}</span>
                  <button
                    type="button"
                    className="speak-btn"
                    onClick={() => handleSpeak(`${q.text}`)}
                    title="문항 읽기"
                  >
                    📢
                  </button>
                </div>
              </td>
              <td
                className={`selectable-td ${answers[q.id] === 'yes' ? 'selected-td' : ''}`}
                onClick={() => handleChange(q.id, 'yes')}
              >
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value="yes"
                  checked={answers[q.id] === 'yes'}
                  onChange={() => handleChange(q.id, 'yes')}
                  style={{ pointerEvents: 'none' }}
                />
              </td>
              <td
                className={`selectable-td ${answers[q.id] === 'no' ? 'selected-td' : ''}`}
                onClick={() => handleChange(q.id, 'no')}
              >
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value="no"
                  checked={answers[q.id] === 'no'}
                  onChange={() => handleChange(q.id, 'no')}
                  style={{ pointerEvents: 'none' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center' }}>
        <button className="questionnaire-submit-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </div>
    </div>
  );
}

export default SeniorTest;
