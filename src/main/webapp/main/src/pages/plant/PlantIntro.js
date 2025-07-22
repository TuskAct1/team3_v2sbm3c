// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./PlantIntro.css"; // 아래 CSS 참고

// const messages = [
//   "안녕하세요! 반려식물 키우기에 오신 걸 환영합니다 🌱",
//   "이곳에서는 식물을 키우며 즐거운 시간을 보낼 수 있어요.",
//   "물, 비료, 햇빛을 주면서 식물이 자라는 걸 지켜보세요.",
//   "식물이 열매를 맺으면 스티커를 받아 실물 선물로 교환할 수 있어요!",
//   "그럼, 나만의 식물을 키우러 가볼까요? 🍓"
// ];

// const PlantIntro = () => {
//   const [step, setStep] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setStep((prev) => {
//         if (prev < messages.length - 1) {
//           return prev + 1;
//         } else {
//           clearInterval(interval);
//           setTimeout(() => {
//             localStorage.setItem("hasSeenIntro", "true");
//             navigate("/plant");
//           }, 2000); // 마지막 메시지 2초 후 이동
//           return prev;
//         }
//       });
//     }, 2500); // 메시지 간격

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return (
//     <div className="intro-container">
//       <div className="plant-image">
//         <img src="/images/plant/seed.png" alt="씨앗" />
//       </div>
//       <div className="speech-bubble">
//         {messages[step]}
//       </div>
//     </div>
//   );
// };

// export default PlantIntro;
import React from 'react';
import './PlantIntro.css'; // 스타일을 여기에

const PlantIntro = ({ onNext }) => {
  return (
    <div className="plant-intro">
      <h2>오늘부터 돈나무를 키워보세요!</h2>
      <p>매일 물만 줘도 현금을 받아요!</p>
      <img src="/images/plant_intro.png" alt="인트로" />
      <button onClick={onNext}>지금 시작할래요!</button>
    </div>
  );
};

export default PlantIntro;
