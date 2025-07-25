// FloatingMenu.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes, FaArrowUp } from 'react-icons/fa';
import './FloatingButton.css';
import todakiImg from '../assets/todaki.png'; // 상대경로에 맞게 수정
import playlistImg from '../assets/playlist.png'; // 상대경로에 맞게 수정
import plantImg from '../assets/plant.png'; // 상대경로에 맞게 수정
import calendarImg from '../assets/calendar.png'; // 상대경로에 맞게 수정

function FloatingMenu() {
  const [open, setOpen] = useState(false);            // 플로팅 메뉴 열림 여부
  const [showScrollTop, setShowScrollTop] = useState(false); // 위로가기 버튼 표시 여부
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // ✅ 메뉴 토글 함수
  const toggleMenu = () => {
    setOpen(!open);
  };

  // ✅ 메뉴 클릭 시 닫고 이동하는 함수
  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  // ✅ 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // ✅ 스크롤 감지 → 위로가기 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ 맨 위로 부드럽게 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-container" ref={menuRef}>
      {/* ✅ 플로팅 메뉴 항목들 */}
      {open && (
        <div className="floating-menu">
          <div className="floating-item" onClick={() => handleNavigate('/playlist/list')}>
            <span className="floating-label">플레이리스트</span>
            <div className="floating-icon-btn">
              <img
                src={playlistImg}
                alt="플레이리스트"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/plant')}>
            <span className="floating-label">반려식물</span>
            <div className="floating-icon-btn">
              <img
                src={plantImg}
                alt="반려식물"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/calendar')}>
            <span className="floating-label">캘린더</span>
            <div className="floating-icon-btn">
              <img
                src={calendarImg}
                alt="캘린더"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/todaki')}>
            <span className="floating-label">토닥이</span>
            <div className="floating-icon-btn">
              <img
                src={todakiImg}
                alt="토닥이"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ 플로팅 메인 버튼 (열기/닫기) */}
      <div className={`floating-main-btn ${open ? 'open' : ''}`} onClick={toggleMenu}>
        {open ? <FaTimes /> : <FaPlus />}
      </div>

      {/* ✅ 위로 가기 버튼 */}
      {showScrollTop && (
        <div className="scroll-top-btn" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </div>
  );
}

export default FloatingMenu;
