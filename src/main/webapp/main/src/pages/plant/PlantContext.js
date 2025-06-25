// PlantContext.js
import React, { createContext, useContext, useState } from 'react';

// 1. Context 생성
const PlantContext = createContext();

// 2. Provider 컴포넌트
export const PlantProvider = ({ children }) => {
  const [hasPlant, setHasPlant] = useState(false);             // 처음 진입 여부
  const [plantType, setPlantType] = useState('');              // 고구마 / 감자
  const [plantName, setPlantName] = useState('');              // 식물 이름
  const [point, setPoint] = useState(0);                       // 현재 포인트
  const [freshness, setFreshness] = useState(100);             // 싱싱함 (0 ~ 100)
  // const [lastAccess, setLastAccess] = useState('');            // 마지막 접속 날짜
  const [weather, setWeather] = useState('clear');             // 날씨 (clear, rain, etc.)
  const [guideViewed, setGuideViewed] = useState(false);       // 안내문 본 여부
  const [lastAccess, setLastAccess] = useState(() => {
    return localStorage.getItem('plant_lastAccess') || '';
  });
  
  return (
    <PlantContext.Provider value={{
      hasPlant, setHasPlant,
      plantType, setPlantType,
      plantName, setPlantName,
      point, setPoint,
      freshness, setFreshness,
      lastAccess, setLastAccess,
      weather, setWeather,
      guideViewed, setGuideViewed
    }}>
      {children}
    </PlantContext.Provider>
  );
};

// 3. usePlantContext() 훅으로 사용
export const usePlantContext = () => useContext(PlantContext);
