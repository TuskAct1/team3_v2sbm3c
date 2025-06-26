import React, { useEffect } from 'react';
import { usePlantContext } from './PlantContext';

import IntroFade from './IntroFade';
import SeedSelect from './SeedSelect';
import NameForm from './NameForm';
import PlantGuide from './PlantGuide';
import PlantDisplay from './PlantDisplay';
import WeatherBackground from './WeatherBackground';
import { fetchWeather } from './WeatherFetcher';  // 함수 import
import DailyChecker from './DailyChecker';

const PlantPage = () => {
  const {
    hasPlant,
    plantType,
    plantName,
    guideViewed,
  } = usePlantContext();

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeather();
      console.log('🌤 날씨 정보:', data);
    };
    getWeather();
  }, []);

  if (!hasPlant) return <IntroFade />;
  if (!plantType) return <SeedSelect />;
  if (!plantName) return <NameForm />;
  if (!guideViewed) return <PlantGuide />;

  return (
    <div>
      <WeatherBackground />
      <PlantDisplay />
      <DailyChecker />
    </div>
  );
};

export default PlantPage;
