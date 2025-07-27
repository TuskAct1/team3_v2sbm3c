// src/components/SeedSelect.js
import React, { useState } from 'react';
import './SeedSelect.css';

const SeedSelect = ({ onComplete }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (seed) => {
    setSelected(seed);
    console.log('✅ 씨앗 선택됨:', seed);
  };

  const handleNext = () => {
    if (selected) {
      onComplete(selected);
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

      <button
        className="seed-button"
        onClick={handleNext}
        disabled={!selected}
      >
        씨앗 선택 완료!
      </button>
    </div>
  );
};

export default SeedSelect;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ 라우팅 이동용
// import './SeedSelect.css';


// const SeedSelect = () => {
//   const [selected, setSelected] = useState(null);
//   const navigate = useNavigate();
//   const memberno = localStorage.getItem('memberno');

//   const handleSelect = (seed) => {
//     setSelected(seed);
//     // 저장은 선택 완료 시에!
//     console.log('✅ 씨앗 선택됨:', seed);
//   };

//   const handleNext = () => {
//     if (selected) {
//       localStorage.setItem(`selectedSeed_${memberno}`, selected);
//       console.log('✅ 씨앗 선택 완료, 이름 설정 페이지로 이동합니다');
//       navigate('/seed-name');
//     }
//   };


//   return (
//     <div className="seed-select">
//       <h2>씨앗을 선택해보세요!</h2>
//       <div className="seed-options">
//         <div
//           className={`seed ${selected === 'tomato' ? 'active' : ''}`}
//           onClick={() => handleSelect('tomato')}
//         >
//           <img src="/plant/images/tomato.png" alt="토마토" />
//           <p>토마토 씨앗</p>
//         </div>
//         <div
//           className={`seed ${selected === 'strawberry' ? 'active' : ''}`}
//           onClick={() => handleSelect('strawberry')}
//         >
//           <img src="/plant/images/strawberry.png" alt="딸기" />
//           <p>딸기 씨앗</p>
//         </div>
//       </div>

//       <button className="seed-button" onClick={handleNext} disabled={!selected}>
//         씨앗 선택 완료!
//       </button>
//     </div>
//   );
// };

// export default SeedSelect;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './SeedSelect.css';


// function SeedSelect() {
//   const [selectedSeed, setSelectedSeed] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const memberno = localStorage.getItem("memberno");

//     // ✅ 이미 식물이 있다면 건너뛰기
//     fetch(`/api/plant/member/${memberno}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data && data.plant_name) {
//           localStorage.setItem('hasSeenIntro', 'true');
//           navigate('/plant/main');
//         }
//       })
//       .catch((err) => {
//         console.error("식물 확인 실패", err);
//         navigate('/plant/main'); // 오류 시에도 우선 메인으로 보냄
//       });
//   }, [navigate]);

//   const handleNext = () => {
//     if (selectedSeed) {
//       const memberno = localStorage.getItem("memberno");
//       localStorage.setItem(`selectedSeed_${memberno}`, selectedSeed);
//       navigate("/plant/seed-name");
//     }
//   };

//   return (
//     <div className="seed-select">
//       <h2>원하는 씨앗을 골라주세요</h2>
//       <div className="seed-options">
//         <div
//           className={`seed-option ${selectedSeed === 'strawberry' ? 'selected' : ''}`}
//           onClick={() => setSelectedSeed('strawberry')}
//         >
//           <img src="/plant/images/strawberry.png" alt="딸기" />
//           <p>딸기</p>
//         </div>
//         <div
//           className={`seed-option ${selectedSeed === 'tomato' ? 'selected' : ''}`}
//           onClick={() => setSelectedSeed('tomato')}
//         >
//           <img src="/plant/images/tomato.png" alt="토마토" />
//           <p>토마토</p>
//         </div>
//       </div>
//       <button onClick={handleNext} disabled={!selectedSeed}>다음</button>
//     </div>
//   );
// }

// export default SeedSelect;
