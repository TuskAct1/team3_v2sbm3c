import React from 'react';
import { usePlantContext } from './PlantContext';

const PlantDisplay = () => {
  const {
    plantName,
    point,
    freshness,
    weather,
  } = usePlantContext();

  // ⚠️ growth_level이 DB에서 오면 따로 받아와도 되고, point로 대체 가능
  // 여기선 포인트로 시뮬레이션
  const growth = point;

  const getPlantImage = () => {
    if (freshness <= 0 || growth <= 0) {
      return '/img/plant_dead.png';
    } else if (growth <= 20) {
      return '/img/plant_baby.png';
    } else if (growth <= 50) {
      return '/img/plant_middle.png';
    } else if (growth <= 100) {
      return '/img/plant_adult.png';
    } else {
      return '/img/plant_flower.png';
    }
  };

  const getGrowthLabel = () => {
    if (growth <= 20) return '🌱 새싹 단계';
    if (growth <= 50) return '🌿 성장 중';
    if (growth <= 100) return '🌳 잘 자라고 있어요!';
    return '🌸 꽃이 피었어요!';
  };

  const getFreshnessText = () => {
    if (freshness >= 80) return '싱싱함 🍀';
    if (freshness >= 50) return '보통 🌿';
    if (freshness >= 20) return '약간 시듦 🍂';
    return '시듦 🥀';
  };

  return (
    <div className="plant-display" style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🌱 {plantName}와 함께하는 오늘</h2>

      <img
        src={getPlantImage()}
        alt="식물 이미지"
        style={{ width: '200px', height: '200px', margin: '20px auto' }}
      />

      <div style={{ fontSize: '18px', marginTop: '20px' }}>
        <p><strong>성장 상태:</strong> {getGrowthLabel()}</p>
        <p><strong>포인트:</strong> {point}점</p>
        <p><strong>싱싱함:</strong> {freshness}% ({getFreshnessText()})</p>
        <p><strong>오늘의 날씨:</strong> {weather === 'clear' ? '☀️ 맑음' : weather === 'rain' ? '🌧️ 비' : `🌤️ ${weather}`}</p>
      </div>
    </div>
  );
};

export default PlantDisplay;
