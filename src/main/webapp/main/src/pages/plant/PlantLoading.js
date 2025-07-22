import React, { useEffect } from 'react';

const PlantLoading = ({ onNext }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1500); // 1.5초 후 자동 전환
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="plant-loading">
      <p>로딩 중...</p>
      <img src="/images/plant_loading.gif" alt="로딩" />
    </div>
  );
};

export default PlantLoading;
