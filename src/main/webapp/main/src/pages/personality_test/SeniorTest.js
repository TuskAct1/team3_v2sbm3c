// ✅ SeniorTest.js - 노인 우울증 자가진단
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeniorTest.css';

const questions = [
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
  const [answers, setAnswers] = useState({});
  const [unanswered, setUnanswered] = useState([]);
  const questionRefs = useRef([]);
  const navigate = useNavigate();
  const synthRef = useRef(window.speechSynthesis);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setUnanswered(prev => prev.filter(i => i !== id));
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      alert('음성 재생이 지원되지 않습니다.');
      return;
    }
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    synthRef.current.speak(utter);
  };

  const handleSubmit = async () => {
    const unansweredList = questions.filter(q => !answers[q.id]).map(q => q.id);
    if (unansweredList.length > 0) {
      setUnanswered(unansweredList);
      const firstRef = questionRefs.current[unansweredList[0]];
      if (firstRef) firstRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      alert(`응답하지 않은 문항이 ${unansweredList.length}개 있습니다.`);
      return;
    }

    let score = 0;
    questions.forEach(q => {
      const a = answers[q.id];
      if (q.reverse && a === 'no') score++;
      else if (!q.reverse && a === 'yes') score++;
    });

    const summary = score >= 10
      ? '⚠️ 현재 우울감이 높게 나타났어요.'
      : '😊 현재로서는 우울감이 낮은 편입니다.';

    const detail = score >= 10
      ? '⚠️ 현재 우울감이 높게 나타났어요.\n\nAI 친구 토닥이가 곁에서 먼저 이야기를 들어줄게요.\n필요하다면 전문가의 상담도 추천드려요.'
      : '😊 현재로서는 우울감이 낮은 편입니다.\n\n앞으로도 토닥이와 함께 건강한 마음을 지켜나가요!';

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const memberno = user?.memberno;
      if (!memberno) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:9093/personality_test/create', {
        personalitytestno: 0,
        memberno,
        score,
        result: summary
      });

      navigate('/senior_test/result', { state: { score, message: detail } });
    } catch (err) {
      console.error(err);
      alert('결과 저장에 실패했어요.');
    }
  };

  return (
    <div className="senior-test-container">
      <h1 className="senior-test-title">노인우울증 검사 (SGDS-K)</h1>
      <table className="senior-test-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>질문</th>
            <th>예</th>
            <th>아니오</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={q.id} ref={el => (questionRefs.current[q.id] = el)}>
              <td>{idx + 1}</td>
              <td className={unanswered.includes(q.id) ? 'unanswered-cell' : ''}>
                <span>{q.text}</span>
                <button className="senior-test-speak-btn" onClick={() => handleSpeak(q.question)}>
                  🔊
                </button>
              </td>
              <td
                className={`clickable ${answers[q.id] === 'yes' ? 'selected-yes' : ''}`}
                onClick={() => handleChange(q.id, 'yes')}
              >
                예
              </td>
              <td
                className={`clickable ${answers[q.id] === 'no' ? 'selected-no' : ''}`}
                onClick={() => handleChange(q.id, 'no')}
              >
                아니오
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'center' }}>
        <button className="senior-test-submit-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </div>
    </div>
  );
}

export default SeniorTest;