import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 라우팅 이동용
import './SeedSelect.css';

const SeedSelect = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // ✅ 훅 사용

  const handleSelect = (seed) => {
    setSelected(seed);
    localStorage.setItem('selectedSeed', seed); // ✅ 선택한 씨앗 저장
    console.log("✅ 씨앗 선택됨:", seed);
  };

  const handleNext = () => {
    if (selected) {
      console.log("✅ 씨앗 선택 완료, 이름 설정 페이지로 이동합니다");
      navigate('/seed-name'); // ✅ 이름 정하기 페이지로 이동
    }
  };

  return (
    <div className="seed-select">
      <h2>씨앗을 선택해보세요!</h2>
      <div className="seed-options">
        <div
          className={`seed ${selected === 'tomato' ? 'active' : ''}`}
          onClick={() => handleSelect('tomato')}
        >
          <img src="/plant/images/tomato.png" alt="토마토" />
          <p>토마토 씨앗</p>
        </div>
        <div
          className={`seed ${selected === 'strawberry' ? 'active' : ''}`}
          onClick={() => handleSelect('strawberry')}
        >
          <img src="/plant/images/strawberry.png" alt="딸기" />
          <p>딸기 씨앗</p>
        </div>
      </div>

      <button className="seed-button" onClick={handleNext} disabled={!selected}>
        씨앗 선택 완료!
      </button>
    </div>
  );
};

export default SeedSelect;
