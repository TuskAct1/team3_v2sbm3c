// 📁 src/pages/MainPage.js
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function MainPage() {
  const [searchParams] = useSearchParams();           // 🔍 URL 쿼리스트링에서 값 가져오기
  const navigate = useNavigate();                     // 🔁 페이지 이동용

  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const provider = searchParams.get("provider");
    const memberno = searchParams.get("memberno");

    if (email && memberno) {
      const user = {
        email,
        mname: name || "소셜사용자",
        provider: provider || "social",
        memberno: parseInt(memberno, 10),
      };

      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ 소셜 로그인 유저 저장:", user);

      // ✅ URL에서 쿼리 제거 후 강제 새로고침
      window.location.replace("/"); // 새로고침 → Navbar에서 user 인식됨
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>토닥이에 오신 걸 환영합니다 🤗</h1>
      <p>지친 하루, 토닥이와 함께 이야기해봐요.</p>
    </div>
  );
}

export default MainPage;
