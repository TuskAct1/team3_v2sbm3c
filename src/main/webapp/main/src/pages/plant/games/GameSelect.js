import React, { useState } from 'react';
import MemoryGame from './MemoryGame';
import ClickGame from './ClickGame';

const GameSelect = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [totalPoint, setTotalPoint] = useState(0);

  const handleComplete = (earnedPoint) => {
    alert(`${earnedPoint} 포인트를 획득했어요!`);
    setTotalPoint(prev => prev + earnedPoint);
    setSelectedGame(null); // 다시 게임 선택 화면으로
  };

  if (selectedGame === 'memory') return <MemoryGame onComplete={handleComplete} />;
  if (selectedGame === 'click') return <ClickGame onComplete={handleComplete} />;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🎮 미니게임 선택</h2>
      <p>총 획득 포인트: {totalPoint}P</p>
      <button onClick={() => setSelectedGame('memory')} style={{ margin: '1rem', padding: '1rem' }}>
        🧠 기억력 게임
      </button>
      <button onClick={() => setSelectedGame('click')} style={{ margin: '1rem', padding: '1rem' }}>
        👆 클릭 게임
      </button>
    </div>
  );
};

export default GameSelect;
