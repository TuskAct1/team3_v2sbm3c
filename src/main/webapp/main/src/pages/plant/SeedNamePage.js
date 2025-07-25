// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './SeedNamePage.css'; // CSS 분리

// const SeedNamePage = () => {
//   const [plantName, setPlantName] = useState('');
//   const [selectedSeed, setSelectedSeed] = useState('');
//   const navigate = useNavigate();
//   const memberno = localStorage.getItem('memberno'); // 추가
//   const user = JSON.parse(localStorage.getItem("user")); // 로그인한 사용자
//   const plant_name = localStorage.getItem(`plantName_${memberno}`); // 식물 이름 
//   const plant_seed = localStorage.getItem(`selectedSeed_${memberno}`);  // 식물 씨앗

//   const [form, setForm] = useState({
//     plant_type: "",
//     plant_name: ""
//   });
  
//   useEffect(() => {
//     const seed = localStorage.getItem('selectedSeed');
//     if (!seed) {
//       navigate('/plant'); // 선택 없을 경우 되돌리기
//     } else {
//       setSelectedSeed(seed);
//     }
//   }, [navigate]);

//   const handleNext = () => {
//     if (plantName.trim()) {
//       // localStorage.setItem('plantName', plantName.trim());
//       const memberno = localStorage.getItem('memberno'); // 추가
//       localStorage.setItem(`plantName_${memberno}`, plantName);
      
//       axios.post("/api/plant/create", {
//       memberno: user.memberno,
//       plant_name: plant_name,
//       plant_type: plant_seed
//       })
//       .then(res => {
//         console.log("✅ 서버 응답:", res.data); // 🔍 이 줄 추가
//         if (res.data === 1) {
//           alert("식물이 생성되었습니다!");
//           navigate('/plant/main'); // 메인 페이지로 이동
//         } else {
//           alert("생성 실패");
//         }
//       })
//       .catch(err => {
//         console.error("❌ 서버 오류:", err);
//       });
//     }
//   };

//   const getSeedImage = () => {
//     if (selectedSeed === 'tomato') return '/plant/images/tomato.png';
//     if (selectedSeed === 'strawberry') return '/plant/images/strawberry.png';
//     return '';
//   };

//   return (
//     <div className="seed-name-wrapper">
//       <h2 className="title">이름을 정해주세요!</h2>

//       <div className="seed-image-container">
//         <img src={getSeedImage()} alt={`${selectedSeed} 이미지`} className="seed-image" />
//         <p className="seed-label">{selectedSeed === 'tomato' ? '토마토 씨앗' : '딸기 씨앗'}</p>
//       </div>

//       <div className="input-area">
//         <label htmlFor="plant-name">이름</label>
//         <input
//           id="plant-name"
//           type="text"
//           value={plantName}
//           onChange={(e) => setPlantName(e.target.value)}
//           placeholder="ex) 토닥이"
//         />
//       </div>

//       <button className="next-button" onClick={handleNext} disabled={!plantName.trim()}>
//         다음
//       </button>
//     </div>
//   );
// };

// export default SeedNamePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeedNamePage.css';

const SeedNamePage = () => {
  const [plantName, setPlantName] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('');
  const navigate = useNavigate();
  const memberno = localStorage.getItem('memberno');
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const seed = localStorage.getItem(`selectedSeed_${memberno}`);
    if (!seed) {
      navigate('/plant'); // 선택 없을 경우 Intro로
    } else {
      setSelectedSeed(seed);
    }
  }, [navigate, memberno]);

  const handleNext = async () => {
    if (!plantName.trim()) return;

    localStorage.setItem(`plantName_${memberno}`, plantName);

    try {
      // 🔍 식물 존재 여부 체크
      const checkRes = await axios.get(`/api/plant/exists/${memberno}`);
      const exists = checkRes.data;

      if (exists) {
        alert("이미 반려식물이 있습니다.");
        navigate('/plant/main');
        return;
      }

      // ✅ 식물 생성
      const createRes = await axios.post("/api/plant/create", {
        memberno: user.memberno,
        plant_name: plantName,
        plant_type: selectedSeed
      });

      if (createRes.data === 1) {
        alert("식물이 생성되었습니다!");
        navigate('/plant/main');
      } else {
        alert("식물 생성 실패");
      }
    } catch (err) {
      console.error("❌ 식물 생성 중 오류:", err);
      alert("서버 오류로 식물 생성에 실패했습니다.");
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
