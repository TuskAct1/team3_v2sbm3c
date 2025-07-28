import React from 'react';
import './SettingsPage.css';
import { FaChevronRight, FaArrowUp } from 'react-icons/fa';

function SettingsPage() {
  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <div className="setting-item">
          <span>서비스 이용약관</span>
          <FaChevronRight />
        </div>
        <div className="setting-item">
          <span>개인정보 처리방침</span>
          <FaChevronRight />
        </div>
        <div className="setting-item">
          <span>마케팅 정보 수신 동의</span>
          <FaChevronRight />
        </div>
      </div>

      <div className="settings-footer">
        <span className="footer-link">회원탈퇴</span>
        <span className="footer-link">로그아웃</span>
      </div>

      <div className="floating-buttons">
        <div className="chatbot-icon">🧡</div>
        <button className="inquiry-button">
          <span>1:1 문의하기</span>
          <span className="bubble-icon">💬</span>
        </button>
        <button className="top-button"><FaArrowUp /></button>
      </div>
    </div>
  );
}

export default SettingsPage;
