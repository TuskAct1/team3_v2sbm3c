// ✅ 2. IntroScreen.js
import React from 'react';
import './IntroScreen.css';

const IntroScreen = ({ onNext }) => (
  <div className="intro-screen">
    <h2>오늘부터 반려식물를 키워보세요!</h2>
    <img src="/plant/images/plant-intro.png" alt="intro" className="intro-img" />
    <ul className="intro-list">
      <li>✔️ 매일 출석만 해도 <span className="point">포인트</span>를 드려요</li>
      <li>✔️ 다양한 <span className="quiz">퀴즈와 게임</span>으로 포인트를 얻을 수 있어요</li>
      <li>✔️ <span className="highlight">스티커 10개</span> 모으면 키운 식물을 보내드려요</li>
    </ul>
    <button className="start-button" onClick={onNext}>지금 시작할래요!</button>
  </div>
);

export default IntroScreen;
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import React, { useEffect } from 'react';
// import './IntroScreen.css';

// function IntroScreen() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const memberno = localStorage.getItem('memberno');
    
//     // ✅ 이미 식물이 있다면 MainPage로 이동
//     fetch(`/api/plant/member/${memberno}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data && data.plant_name) {
//           localStorage.setItem('hasSeenIntro', 'true');
//           navigate('/plant/main'); // 이미 식물이 있는 경우
//         } else {
//           // 없으면 5초 후 다음 단계로 이동
//           const timer = setTimeout(() => {
//             navigate('/plant/seed-select');
//           }, 5000);
//           return () => clearTimeout(timer);
//         }
//       })
//       .catch(err => {
//         console.error("식물 여부 확인 실패:", err);
//         navigate('/plant/main'); // 오류 시 기본적으로 메인으로
//       });
//   }, [navigate]);

//   return (
//     <div className="intro-screen">
//       <h1>나만의 반려식물을 키워보세요!</h1>
//       <p>곧 시작합니다...</p>
//     </div>
//   );
// }

// export default IntroScreen;
