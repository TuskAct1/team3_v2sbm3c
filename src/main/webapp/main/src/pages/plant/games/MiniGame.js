// src/pages/plant/MiniGame.js
import React, { useEffect, useState } from 'react';
import './MiniGame.css';

const MiniGame = ({ onSuccess }) => {
  const buttons = ['🔴', '🟢', '🔵', '🟡'];
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState('ready'); // ready, show, input, result

  // 새로운 순서 생성
  const generateSequence = () => {
    const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setStep('show');
    setUserInput([]);
  };

  // 순서 보여주기
  useEffect(() => {
    if (step === 'show') {
      let i = 0;
      const interval = setInterval(() => {
        highlightButton(sequence[i]);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => setStep('input'), 1000);
        }
      }, 1000);
    }
  }, [step]);

  const [highlighted, setHighlighted] = useState(null);

  const highlightButton = (idx) => {
    setHighlighted(idx);
    setTimeout(() => setHighlighted(null), 500);
  };

  // 사용자의 입력 처리
  const handleClick = (idx) => {
    if (step !== 'input') return;
    const newInput = [...userInput, idx];
    setUserInput(newInput);
    if (sequence[newInput.length - 1] !== idx) {
      alert("틀렸어요! 다시 도전해보세요.");
      setStep('ready');
      return;
    }
    if (newInput.length === sequence.length) {
      alert("정답입니다! 🎉 포인트 +10, 성장도 +5");
      onSuccess(); // 성공 콜백
      setStep('ready');
    }
  };

  return (
    <div className="mini-game-container">
      <h2>🎯 순서 기억하기</h2>
      <p>{step === 'ready' && "시작 버튼을 눌러 순서를 확인하세요"}
         {step === 'show' && "순서를 보여주는 중... 기억하세요!"}
         {step === 'input' && "기억한 순서대로 눌러보세요!"}
      </p>

      <div className="button-grid">
        {buttons.map((label, idx) => (
          <button
            key={idx}
            className={`memory-btn ${highlighted === idx ? 'highlighted' : ''}`}
            onClick={() => handleClick(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 'ready' && (
        <button className="start-btn" onClick={generateSequence}>게임 시작</button>
      )}
    </div>
  );
};

export default MiniGame;
