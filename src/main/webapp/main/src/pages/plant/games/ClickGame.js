import React, { useState, useEffect } from 'react';

const ClickGame = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 게임 시간 10초

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete(score); // 완료 시 점수 전달
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>👆 클릭 게임</h2>
      <p>10초 안에 최대한 클릭해보세요!</p>
      <button
        onClick={() => setScore(score + 1)}
        style={{ padding: '1rem 2rem', fontSize: '1.5rem' }}
      >
        클릭!
      </button>
      <p>남은 시간: <strong>{timeLeft}</strong>초</p>
      <p>점수: <strong>{score}</strong></p>
    </div>
  );
};

export default ClickGame;
