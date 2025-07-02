import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ 컴포넌트 마운트 시 localStorage에서 로그인 정보 불러오기
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
  }, []);

  // ✅ 로그아웃 핸들러
  const handleLogout = () => {
    const provider = user?.provider;

    // 1️⃣ localStorage 및 상태 초기화
    localStorage.removeItem("user");
    setUser(null);

    // 2️⃣ provider별 로그아웃 처리
    if (provider === 'kakao') {
      // ✅ 카카오 로그아웃 (공식 로그아웃 URL 사용)
      window.location.href =
        `https://kauth.kakao.com/oauth/logout?client_id=1e23d0af915f9a717a72c55859c76e12&logout_redirect_uri=http://localhost:3000/login`;

    } else if (provider === 'google') {
      // ✅ 구글은 완전한 로그아웃이 어려워서 로그인 화면으로만 리디렉트
      window.location.href = 'http://localhost:3000/login';

    } else if (provider === 'naver') {
      // ✅ 네이버 로그아웃 (세션 제거 유도)

      // 🔸 1. 네이버 로그아웃 창 열기 (팝업)
      const logoutPopup = window.open("https://nid.naver.com/nidlogin.logout", "_blank", "width=500,height=600");

      // 🔸 2. 0.5초 후 해당 창 닫고 → 로그인 페이지로 이동
      setTimeout(() => {
        if (logoutPopup && !logoutPopup.closed) {
          logoutPopup.close(); // ❌ 팝업창 자동으로 닫기
        }
        window.location.href = '/login';
      }, 500); // 약간의 여유 시간 후 이동
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
            {/* 🔓 로그인한 사용자만 접근 가능한 메뉴 */}
            <li><Link to="/todaki">토닥이</Link></li>
            <li><Link to="/plant">반려식물</Link></li>
            <li><Link to="/diary">일기</Link></li>
            <li><Link to="/product">포인트 상점</Link></li>

            {/* 🔐 관리자 전용 메뉴 */}
            {isAdmin && (
              <>
                <li><Link to="/admin/member-list">회원 리스트</Link></li>
                <li><Link to="/admin/settings">관리 설정</Link></li>
              </>
            )}

            {/* 😊 로그인 유저 이름 + 로그아웃 버튼 */}
            <li className="nav-user-info">
              <Link to={isAdmin ? "/admin/mypage" : "/mypage"} className={isAdmin ? "nav-user-email admin" : "nav-user-email"}>
                {user.mname || user.nickname || user.email || user.id} {isAdmin ? "관리자님" : "님"}
              </Link>
              <span onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '8px', color: '#007700' }}>
                로그아웃
              </span>
            </li>
          </>
        ) : (
          <>
            {/* 👤 비로그인 상태 메뉴 */}
            <li><Link to="/signup">회원가입</Link></li>
            <li><Link to="/login">로그인</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
