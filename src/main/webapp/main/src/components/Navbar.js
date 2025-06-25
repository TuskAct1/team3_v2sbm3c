import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.role === 'admin';  // 관리자 여부

  return (
    <nav className="navbar">
      <ul>
        {/* 공통 메뉴 */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
        <li><Link to="/board/list_all">게시판</Link></li>

        {user ? (
          <>
            <li><Link to="/todaki">토닥이</Link></li>
            <li><Link to="/self-check">자가진단</Link></li>
            <li><Link to="/plant">반려식물</Link></li>

            <li><Link to="/diary">일기</Link></li>
            <li><Link to="/product">포인트 상점</Link></li>


            {/* 관리자 전용 메뉴 */}
            {isAdmin && (
              <>
                <li><Link to="/admin/member-list">회원 리스트</Link></li>
                <li><Link to="/admin/settings">관리 설정</Link></li>
                <li><Link to="/product">포인트 상점</Link></li>
              </>
            )}

            {/* 사용자 이메일 + 로그아웃 */}
            <li className="nav-user-info" style={{ display: 'inline' }}>
              <Link
                to="/mypage"
                className={isAdmin ? "nav-user-email admin" : "nav-user-email"}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {user.email || user.id} {isAdmin ? "관리자님" : "님"}
              </Link>{' '}
              <span
                className="nav-link-logout"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
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
