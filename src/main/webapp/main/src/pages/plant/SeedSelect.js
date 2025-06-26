import React from 'react';
import { usePlantContext } from './PlantContext';
// import '../styles/plant/SeedSelect.css'; // 스타일 분리 (선택사항)
import '../../styles/plant/SeedSelect.css';

const SeedSelect = () => {
  const { setPlantType } = usePlantContext();

  const handleSelect = (type) => {
    setPlantType(type); // 'sweet_potato' 또는 'potato'
  };

  return (
    <div className="seed-select-container">
      <h2>씨앗을 선택해주세요 🌱</h2>
      <div className="seed-buttons">
        <button onClick={() => handleSelect('sweet_potato')}>
          <img src="/img/sweet_potato_seed.png" alt="고구마 씨앗" />
          <div>고구마</div>
        </button>
        <button onClick={() => handleSelect('potato')}>
          <img src="/img/potato_seed.png" alt="감자 씨앗" />
          <div>감자</div>
        </button>
      </div>
    </div>
  );
};

export default SeedSelect;
