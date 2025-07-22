// src/components/Layout.js
import React, { useEffect, useState } from 'react'; // ✅ useState 추가!
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButton from './FloatingButton';
import Breadcrumb from './Breadcrumb';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [categoryno, setCategoryno] = useState(null);

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
        {/* ✅ 브레드크럼 여기에 추가 */}
        {!shouldHideElements && <Breadcrumb categoryno={categoryno} />}
        <Outlet context={{ setCategoryno }} />
      </div>
      {!shouldHideElements && <Footer />}
      {!shouldHideElements && <FloatingButton />}
    </div>
  );
};

export default Layout;
