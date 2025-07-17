// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // 푸터 전용 스타일

function Footer() {
  return (
    <section className="footer-section">
      <h3>토닥 서비스에 대해 궁금하세요?</h3>
      <div className="footer-buttons">
          <Link to="/inquiry">
            <button>1:1 문의</button>
          </Link>
          <Link to="/faq">
            <button>자주묻는 질문</button>
          </Link>
      </div>
      <div className="footer-info">
        <p><strong>INFO.</strong></p>
        <p>주식회사 토닥 대표: 임광환, 하정우, 이승현, 안철훈, 조희민 | 사업자등록번호: 000-00-00000</p>
        <p>주소: 서울특별시 종로구 솔데스크 512호</p>
        <p>광고/제휴 문의: todak@gmail.com</p>
      </div>
    </section>
  );
}

export default Footer;
