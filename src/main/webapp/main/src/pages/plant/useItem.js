import axios from 'axios';
import { usePoint } from './PointContext';

const useItem = (memberno, plantno, fetchGrowth) => {
  const { adjustPoint } = usePoint();

  const useItemEffect = async (item_type) => {
    const config = {
      물: { point: -5, growth: 1, limit: 2 },
      비료: { point: -10, growth: 2, limit: 1 },
      영양제: { point: -5, growth: 1, limit: Infinity },
    };

    const today = new Date().toISOString().slice(0, 10);
    const usedKey = `used_${item_type}_${today}`;
    const usedCount = Number(localStorage.getItem(usedKey)) || 0;

    if (usedCount >= config[item_type].limit) {
      alert(`${item_type}는 오늘 ${config[item_type].limit}회까지만 사용 가능합니다.`);
      return;
    }

    const success = await adjustPoint(config[item_type].point);
    if (!success) return;

    try {
      await axios.post('/api/plant/increase', {
        plantno,
        amount: config[item_type].growth,
        reason: item_type,
      });
      localStorage.setItem(usedKey, usedCount + 1);
      fetchGrowth(); // 성장도 갱신
    } catch (e) {
      console.error('성장 증가 실패', e);
    }
  };

  return { useItemEffect };
};

export default useItem;
