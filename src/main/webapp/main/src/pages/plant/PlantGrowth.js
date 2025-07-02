import React, { useState } from 'react';
import {
  insertGrowthLog,
  updateGrowth,
  updateMemberPoint
} from '../../api/plantApi';

const PlantGrowth = ({ plantno, memberno }) => {
  const [todayUsed, setTodayUsed] = useState(0); // 오늘 사용 횟수 (예: 물 1/2회)

  const handleUseItem = async (item) => {
    if (todayUsed >= 2) {
      alert('오늘은 더 이상 사용할 수 없습니다.');
      return;
    }

    const itemPoint = item.point; // -5P
    const growthAmount = item.growth; // +1%
    const itemName = item.name; // "물"

    try {
      // 1. 포인트 차감
      await updateMemberPoint({ memberno, pointChange: -itemPoint });

      // 2. 성장률 증가
      await updateGrowth({ plantno, growthPercent: growthAmount });

      // 3. 성장 로그 기록
      await insertGrowthLog({
        plantno,
        memberno,
        item_name: itemName,
        growth_percent: growthAmount
      });

      setTodayUsed(todayUsed + 1);
      alert(`${itemName} 사용 완료! 성장률 +${growthAmount}%`);
    } catch (err) {
      console.error(err);
      alert('아이템 사용 실패');
    }
  };

  const itemList = [
    { name: '물', point: 5, growth: 1 },
    { name: '비료', point: 10, growth: 2 }
    // 필요 시 다른 아이템도 추가
  ];

  return (
    <div>
      <h3>아이템 사용 (오늘 사용: {todayUsed}/2회)</h3>
      {itemList.map((item) => (
        <button key={item.name} onClick={() => handleUseItem(item)}>
          {item.name} (-{item.point}P / +{item.growth}% 성장)
        </button>
      ))}
    </div>
  );
};

export default PlantGrowth;
