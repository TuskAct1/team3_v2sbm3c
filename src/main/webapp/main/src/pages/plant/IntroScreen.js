// ✅ 2. IntroScreen.js
import React from 'react';
import './IntroScreen.css';

const IntroScreen = ({ onNext }) => (
  <div className="intro-screen">
    <h2>오늘부터 돈나무를 키워보세요!</h2>
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