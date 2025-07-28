import React from 'react';
import './GameSelect.css';

const GameSelect = ({ onSelectMemory, onSelectClick, onBack }) => {
  return (
      <div className="game-card">
        <div className="game-option">
           <h2>🎮미니게임 선택</h2>
        </div>

        <button className="game-button" onClick={onSelectMemory}>
          🧠 기억력 게임
        </button>

        <button className="game-button" onClick={onSelectClick}>
          👉 클릭 게임
        </button>

        <button className="game-back" onClick={onBack}>
          메인으로 돌아가기
        </button>
      </div>

  );
};

export default GameSelect;
