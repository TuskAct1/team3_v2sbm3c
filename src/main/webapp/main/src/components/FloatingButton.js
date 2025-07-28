// FloatingButton.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaTimes, FaArrowUp } from 'react-icons/fa';
import './FloatingButton.css';
import todakiImg from '../assets/todaki.png';
import playlistImg from '../assets/playlist.png';
import plantImg from '../assets/plant.png';
import calendarImg from '../assets/calendar.png';

function FloatingMenu() {
  // ─── Hook 호출부 (조건 없이 최상단) ─────────────────────────
  const navigate = useNavigate();
  const { pathname } = useLocation();    // 전역 location 아님!
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const menuRef = useRef(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // 스크롤 감지
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── 챗봇 화면에서 렌더 스킵 ───────────────────────────────────
  if (pathname.startsWith('/todaki') || pathname.startsWith('/chat')) {
    return null;
  }

  // ─── 핸들러 ────────────────────────────────────────────────
  const toggleMenu = () => setOpen(o => !o);
  const handleNavigate = to => {
    setOpen(false);
    navigate(to);
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ─── JSX ────────────────────────────────────────────────────
  return (
    <div className="floating-container" ref={menuRef}>
      {open && (
        <div className="floating-menu">
          <div className="floating-item" onClick={() => handleNavigate('/playlist/list')}>
            <span className="floating-label">플레이리스트</span>
            <div className="floating-icon-btn"><img src={playlistImg} alt="플레이리스트" /></div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/plant')}>
            <span className="floating-label">반려식물</span>
            <div className="floating-icon-btn"><img src={plantImg} alt="반려식물" /></div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/calendar')}>
            <span className="floating-label">캘린더</span>
            <div className="floating-icon-btn"><img src={calendarImg} alt="캘린더" /></div>
          </div>
          <div className="floating-item" onClick={() => handleNavigate('/todaki')}>
            <span className="floating-label">토닥이</span>
            <div className="floating-icon-btn"><img src={todakiImg} alt="토닥이" /></div>
          </div>
        </div>
      )}

      <div className={`floating-main-btn ${open ? 'open' : ''}`} onClick={toggleMenu}>
        {open ? <FaTimes /> : <FaPlus />}
      </div>

      {showScrollTop && (
        <div className="scroll-top-btn" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </div>
  );
}

export default FloatingMenu;
