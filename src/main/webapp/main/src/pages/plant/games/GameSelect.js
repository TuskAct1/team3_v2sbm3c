
// import './GameSelect.css';

// import React, { useState } from 'react';
// import MemoryGame from './MemoryGame';
// import ClickGame from './ClickGame';

// const GameSelect = ({ onComplete }) => {
//   const [selectedGame, setSelectedGame] = useState(null);

//   // 게임 완료 혹은 취소 시 호출
//   const handleComplete = (earnedPoint) => {
//     // 1) 내부 알림
//     alert(`${earnedPoint} 포인트를 획득했어요!`);
//     // 2) 부모 콜백 호출 → MainPage 에서 백엔드 반영, 리로드, mode='menu'
//     onComplete(earnedPoint);
//     // 3) 선택 화면으로 돌아올 필요 없이 MainPage 에서 메뉴로 복귀하므로 생략
//   };

//   // ➊ 기억력 게임 화면
//   if (selectedGame === 'memory') {
//     return (
//       <div className="game-wrapper">
//         <button onClick={() => handleComplete(0)}>메인으로 돌아가기</button>
//         <MemoryGame onComplete={handleComplete} />
//       </div>
//     );
//   }

//   // ➋ 클릭 게임 화면
//   if (selectedGame === 'click') {
//     return (
//       <div className="game-wrapper">
//         <button onClick={() => handleComplete(0)}>메인으로 돌아가기</button>
//         <ClickGame onComplete={handleComplete} />
//       </div>
//     );
//   }

//   // ➌ 게임 선택 화면
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <h2>🎮 미니게임 선택</h2>
//       <button onClick={() => setSelectedGame('memory')} style={{ margin: '1rem', padding: '1rem' }}>
//         🧠 기억력 게임
//       </button>
//       <button onClick={() => setSelectedGame('click')} style={{ margin: '1rem', padding: '1rem' }}>
//         👆 클릭 게임
//       </button>
//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={() => handleComplete(0)}>메인으로 돌아가기</button>
//       </div>
//     </div>
//   );
// };

// export default GameSelect;

import './GameSelect.css';

import React, { useState } from 'react';
import MemoryGame from './MemoryGame';
import ClickGame from './ClickGame';

const GameSelect = ({ onComplete }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleComplete = (earnedPoint) => {
    alert(`${earnedPoint} 포인트를 획득했어요!`);
    onComplete(earnedPoint);
  };

  if (selectedGame === 'memory') {
    return (
      <div className="game-wrapper">
        <button className="game-back-button" onClick={() => handleComplete(0)}>
          메인으로 돌아가기
        </button>
        <MemoryGame onComplete={handleComplete} />
      </div>
    );
  }

  if (selectedGame === 'click') {
    return (
      <div className="game-wrapper">
        <button className="game-back-button" onClick={() => handleComplete(0)}>
          메인으로 돌아가기
        </button>
        <ClickGame onComplete={handleComplete} />
      </div>
    );
  }

  // 🔧 여기부터 CSS 적용 구조
  return (
    <div className="game-wrapper">
      <div className="game-card">
        <h2>🎮 미니게임 선택</h2>

        <button
          className="game-button"
          onClick={() => setSelectedGame('memory')}
        >
          🧠 기억력 게임
        </button>

        <button
          className="game-button"
          onClick={() => setSelectedGame('click')}
        >
          👆 클릭 게임
        </button>

        <button
          className="game-back-button"
          onClick={() => handleComplete(0)}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default GameSelect;
