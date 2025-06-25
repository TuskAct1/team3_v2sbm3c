// src/pages/plant/WeatherBackground.js
import React, { useEffect, useState } from 'react';
import { fetchWeather } from './WeatherFetcher';
import '../../styles/plant/WeatherBackground.css';

const WeatherBackground = () => {
  const [weather, setWeather] = useState('Clear');

  useEffect(() => {
    const getWeather = async () => {
      const currentWeather = await fetchWeather();
      setWeather(currentWeather);
    };

    getWeather();
  }, []);

  const weatherVideoMap = {
    Clear: '/images/weather/clear.mp4',
    Clouds: '/images/weather/clouds.mp4',
    Rain: '/images/weather/rain.mp4',
    Snow: '/images/weather/snow.mp4',
  };

  const selectedVideo = weatherVideoMap[weather] || '/images/weather/clear.mp4';

  return (
    <div className="weather-background">
      <video autoPlay loop muted className="weather-video">
        <source src={selectedVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default WeatherBackground;
