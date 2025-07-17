// src/components/Layout.js
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButton from './FloatingButton';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  // ✅ 특정 경로에선 숨김 처리
  const hiddenRoutes = [/^\/playlist_song\/list\/\d+$/]; // 정규표현식: 숫자 playlistno
  const shouldHideElements = hiddenRoutes.some((regex) =>
    regex.test(location.pathname)
  );

  // ✅ 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout-wrapper">
      {!shouldHideElements && <Navbar />}
      <div className="layout-container">
        <Outlet />
      </div>
      {!shouldHideElements && <Footer />}
      {!shouldHideElements && <FloatingButton />}
    </div>
  );
};

export default Layout;
