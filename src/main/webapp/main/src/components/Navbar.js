import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=1e23d0af915f9a717a72c55859c76e12&logout_redirect_uri=http://localhost:3000/login`;

  // ✅ 처음 마운트될 때만 로그인 상태 확인
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ user 파싱 실패", err);
      }
    }
  }, []); // 👈 빈 배열! 딱 1번만 실행됨

  const handleLogout = () => {
    const provider = user?.provider;

    localStorage.removeItem("user");
    setUser(null);

    if (provider === 'kakao') {
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=1e23d0af915f9a717a72c55859c76e12&logout_redirect_uri=http://localhost:3000/login`;
    } else if (provider === 'google') {
      // 구글은 단순히 로그인 상태만 해제 (세션/로컬에서)
      window.location.href = 'http://localhost:3000/login';
    } else {
      // 일반 로그인 (내 서버 기준 로그아웃만)
      navigate('/login');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/playlist/list">🎵 플레이리스트</Link></li>
        <li><Link to="/personality_test">심리테스트</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
        <li><Link to="/board/list_all/all/1">게시판</Link></li>
        <li><Link to="/notice/list">공지사항</Link></li>

        {user ? (
          <>
            <li><Link to="/todaki">토닥이</Link></li>
            <li><Link to="/plant">반려식물</Link></li>
            <li><Link to="/diary">일기</Link></li>
            <li><Link to="/product">포인트 상점</Link></li>

            {isAdmin && (
              <>
                <li><Link to="/admin/member-list">회원 리스트</Link></li>
                <li><Link to="/admin/settings">관리 설정</Link></li>
              </>
            )}

            <li className="nav-user-info">
              <Link to="/mypage" className={isAdmin ? "nav-user-email admin" : "nav-user-email"}>
                {user.mname || user.nickname || user.email || user.id} {isAdmin ? "관리자님" : "님"}
              </Link>{' '}
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                로그아웃
              </span>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/signup">회원가입</Link></li>
            <li><Link to="/login">로그인</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
