// 📁 src/pages/plant/RemainingCount.js
import React from 'react';
import './RemainingCount.css';

const RemainingCount = ({ used = 0, limit = Infinity }) => {
  // 제한이 무한(Infinity)이면 "제한 없음" 표시
  if (limit === Infinity) {
    return <div className="remaining-count unlimited">제한 없음</div>;
  }

  // 남은 횟수: 음수는 0으로 클램프
  const remaining = Math.max(limit - used, 0);
  const isUsedUp = remaining === 0;

  return (
    <div className={`remaining-count ${isUsedUp ? 'used-up' : ''}`}>
      {remaining}번 남음
    </div>
  );
};

export default RemainingCount;
