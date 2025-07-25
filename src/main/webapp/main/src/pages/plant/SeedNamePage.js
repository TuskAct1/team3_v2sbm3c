import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeedNamePage.css'; // CSS 분리

const SeedNamePage = () => {
  const [plantName, setPlantName] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const seed = localStorage.getItem('selectedSeed');
    if (!seed) {
      navigate('/plant'); // 선택 없을 경우 되돌리기
    } else {
      setSelectedSeed(seed);
    }
  }, [navigate]);

  const handleNext = () => {
    if (plantName.trim()) {
      localStorage.setItem('plantName', plantName.trim());
      navigate('/plant/main'); // 메인 페이지로 이동
    }
  };

  const getSeedImage = () => {
    if (selectedSeed === 'tomato') return '/plant/images/tomato.png';
    if (selectedSeed === 'strawberry') return '/plant/images/strawberry.png';
    return '';
  };

  return (
    <div className="seed-name-wrapper">
      <h2 className="title">이름을 정해주세요!</h2>

      <div className="seed-image-container">
        <img src={getSeedImage()} alt={`${selectedSeed} 이미지`} className="seed-image" />
        <p className="seed-label">{selectedSeed === 'tomato' ? '토마토 씨앗' : '딸기 씨앗'}</p>
      </div>

      <div className="input-area">
        <label htmlFor="plant-name">이름</label>
        <input
          id="plant-name"
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="ex) 토닥이"
        />
      </div>

      <button className="next-button" onClick={handleNext} disabled={!plantName.trim()}>
        다음
      </button>
    </div>
  );
};

export default SeedNamePage;
