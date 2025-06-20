import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/todaki">토닥이</Link></li>
        <li><Link to="/self-check">자가진단</Link></li>
        <li><Link to="/plant">반려식물</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
        <li><Link to="/board">게시판</Link></li>
        <li><Link to="/signup">회원가입</Link></li>
        <li><Link to="/login">로그인</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;