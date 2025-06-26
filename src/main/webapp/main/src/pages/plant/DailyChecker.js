import { useEffect } from 'react';
import { usePlantContext } from './PlantContext';
import { getTodayDate } from './utils/dateUtil';

const DailyChecker = () => {
  const {
    lastAccess, setLastAccess,
    point, setPoint,
    freshness, setFreshness,
  } = usePlantContext();

  useEffect(() => {
    const today = getTodayDate();

    // 처음 접속 or 날짜가 바뀌었을 경우
    if (!lastAccess || lastAccess !== today) {
      // 포인트 -1 (최소 0)
      const newPoint = Math.max(0, point - 1);
      setPoint(newPoint);

      // 싱싱함 -10 (최소 0)
      const newFreshness = Math.max(0, freshness - 10);
      setFreshness(newFreshness);

      // 오늘 날짜로 갱신
      setLastAccess(today);

      // localStorage에도 저장 (새로고침에도 유지되도록)
      localStorage.setItem('plant_lastAccess', today);
    }
  }, [lastAccess, point, freshness, setLastAccess, setPoint, setFreshness]);

  return null;
};

export default DailyChecker;
