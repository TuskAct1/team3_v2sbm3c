// 📁 src/pages/MainPage.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function MainPage() {
  const [searchParams] = useSearchParams(); // 🔍 URL 쿼리스트링 파라미터 가져오기

  useEffect(() => {
    // ✅ 소셜 로그인 후 전달받은 쿼리스트링에서 정보 추출
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const provider = searchParams.get("provider");
    const memberno = searchParams.get("memberno");

    // ✅ 필수 정보가 있을 경우에만 localStorage에 저장
    if (email && memberno) {
      const user = {
        email,
        mname: name,  // ✅ 이름을 'mname'으로 저장! → Navbar에서 name 대신 mname으로 표시 가능
        provider,
        memberno: parseInt(memberno, 10),
      };

      // ✅ localStorage에 저장
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ 로그인 유저 저장:", user);

      // ✅ URL에서 쿼리스트링 제거 (새로고침)
      window.location.replace("/");
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
