import React from 'react';
import '../styles/PlantPage.css';

function PlantPage() {
  return (
    <div className="plant-container">
      <img
        src="/static/images/minighlim.jpg"
        alt="식물"
        className="plant-image"
      />

      <h1 className="plant-title">행복한 식물</h1>

      <div className="text-center">
        <div className="text-2xl font-bold mb-1">키운 지 30일</div>
        <div className="text-sm">경험치 30</div>
      </div>

      <div className="status-container">
        {/* 성장 */}
        <div className="status-box">
          <p>🌱 성장</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner blue" style={{ width: '50%' }}>
              50%
            </div>
          </div>
        </div>

        {/* 건강 */}
        <div className="status-box">
          <p>💚 건강</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner green" style={{ width: '70%' }}>
              70%
            </div>
          </div>
        </div>

        {/* 수분 */}
        <div className="status-box">
          <p>💧 수분</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner purple" style={{ width: '60%' }}>
              60%
            </div>
          </div>
        </div>

        {/* 햇빛 */}
        <div className="status-box">
          <p>☀️ 햇빛</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner yellow" style={{ width: '80%' }}>
              80%
            </div>
          </div>
        </div>

        {/* 영양 */}
        <div className="status-box">
          <p>🍃 영양</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner red" style={{ width: '40%' }}>
              40%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantPage;
