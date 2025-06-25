// src/pages/plant/WeatherFetcher.js
import axios from 'axios';

export const fetchWeather = async () => {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // 🔑 필수!
  const lat = 37.5665; // 서울 (혹은 사용자 위치)
  const lon = 126.9780;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.weather[0].main; // "Clear", "Clouds", "Rain", "Snow" 등
  } catch (error) {
    console.error('날씨 정보를 가져오는 데 실패했습니다:', error);
    return 'Clear'; // 기본값
  }
};
