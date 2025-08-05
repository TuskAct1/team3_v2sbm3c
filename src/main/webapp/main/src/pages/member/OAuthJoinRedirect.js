// ✅ 로그인 후 자동으로 호출되는 리디렉션 페이지
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OAuthJoinRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://121.78.128.139:9093/api/oauth/me', { withCredentials: true })
      .then((res) => {
        const user = res.data;
        console.log("✅ 사용자 정보:", user);

        // 👉 여기서 user 정보 저장해야 나중에 Navbar 등에서 로그인 상태 인식 가능
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/"); // 로그인 후 메인페이지 등으로 이동
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 불러오기 실패", err);
        navigate("/login");
      });
  }, []);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthJoinRedirect;
