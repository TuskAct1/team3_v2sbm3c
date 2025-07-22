// ✅ 3. LoadingScreen.js
import React, { useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onNext }) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 1500);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="loading-screen">
      <img src="/plant/images/loading.gif" alt="로딩 중" className="loading-img" />
      <p>로딩 중입니다...</p>
    </div>
  );
};

export default LoadingScreen;