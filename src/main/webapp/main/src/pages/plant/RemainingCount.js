// 📁 src/pages/plant/RemainingCount.js
import React from 'react';
import './RemainingCount.css';

const RemainingCount = ({ used = 0, limit }) => {
  if (limit === Infinity) {
    return <div className="remaining-count unlimited">제한 없음</div>;
  }

  const remaining = limit - used;
  const isMaxed = remaining <= 0;

  return (
    <div className={`remaining-count ${isMaxed ? 'used-up' : ''}`}>
      {remaining}번 남음
    </div>
  );
};

export default RemainingCount;
