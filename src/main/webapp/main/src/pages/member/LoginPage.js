// // src/pages/LoginPage.js
// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import "./LoginPage.css";

// const LoginPage = () => {
//   const [form, setForm] = useState({
//     id: "",
//     passwd: "",
//     id_save: false,
//     passwd_save: false,
//   });

//   const [idMsg, setIdMsg] = useState("");
//   const [passwdMsg, setPasswdMsg] = useState("");

//   const passwdRef = useRef();
//   const btnSendRef = useRef();

//   useEffect(() => {
//     const savedId = localStorage.getItem("saved_id");
//     const savedPasswd = localStorage.getItem("saved_passwd");

//     setForm((prev) => ({
//       ...prev,
//       id: savedId || "",
//       passwd: savedPasswd || "",
//       id_save: !!savedId,
//       passwd_save: !!savedPasswd,
//     }));

//     // ✅ 로그인 페이지 진입 시 맨 위로 스크롤 이동
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleKeyPress = (e, nextRef) => {
//     if (e.key === "Enter" && nextRef?.current) {
//       nextRef.current.focus();
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (form.id.trim().length === 0) {
//       setIdMsg("아이디(이메일) 입력은 필수입니다.");
//       return;
//     }
//     if (form.passwd.trim().length === 0) {
//       setPasswdMsg("비밀번호 입력은 필수입니다.");
//       return;
//     }

//     form.id_save
//       ? localStorage.setItem("saved_id", form.id)
//       : localStorage.removeItem("saved_id");

//     form.passwd_save
//       ? localStorage.setItem("saved_passwd", form.passwd)
//       : localStorage.removeItem("saved_passwd");

//     try {
//       const response = await axios.post("/api/members/login", {
//         id: form.id,
//         passwd: form.passwd,
//       });

//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       alert("로그인 성공!");

//       const redirectPath = localStorage.getItem("redirectAfterLogin");
//       localStorage.removeItem("redirectAfterLogin");
//       window.location.href =  "/";
//     } catch (error) {
//       console.error("로그인 실패:", error);
//       alert("아이디 또는 비밀번호가 일치하지 않습니다.");
//     }
//   };

//   const handleCancel = () => {
//     window.history.back();
//   };

//   return (
//     <>
//       <div className="login-page-global-links">
//         <a href="#" onClick={() => window.location.reload()}>새로고침</a>
//         <a href="/signup">회원 가입</a>
//         <a href="/admin_login">관리자 로그인</a>
//       </div>

//       <div className="login-wrapper">
//         <div className="login-box">
//           {/* 왼쪽 입력 + 버튼 */}
//           <div className="login-left">
//             <h3>로그인</h3>
//             <form onSubmit={handleLogin} className="login-form-container">
//               <div className="login-inline-row">
//                 <div className="login-input-block">
//                   <input
//                     type="text"
//                     name="id"
//                     value={form.id}
//                     placeholder="아이디(이메일)"
//                     onChange={handleChange}
//                     onKeyPress={(e) => handleKeyPress(e, passwdRef)}
//                   />
//                   <input
//                     type="password"
//                     name="passwd"
//                     value={form.passwd}
//                     placeholder="비밀번호"
//                     onChange={handleChange}
//                     ref={passwdRef}
//                     onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
//                   />
//                 </div>

//                 <button type="submit" ref={btnSendRef} className="login-inline-btn">
//                   로그인
//                 </button>
//               </div>

//               {idMsg && <span className="span_warning">{idMsg}</span>}
//               {passwdMsg && <span className="span_warning">{passwdMsg}</span>}

//               <div className="checkbox-row">
//                 <input
//                   type="checkbox"
//                   name="id_save"
//                   checked={form.id_save}
//                   onChange={handleChange}
//                 />
//                 <label htmlFor="id_save">아이디 저장</label>

//                 <input
//                   type="checkbox"
//                   name="passwd_save"
//                   checked={form.passwd_save}
//                   onChange={handleChange}
//                   style={{ marginLeft: "16px" }}
//                 />
//                 <label htmlFor="passwd_save">비밀번호 저장</label>
//               </div>

//               <div className="login-find-links">
//                 <a href="/find_passwd">비밀번호 찾기</a>
//                 <span>|</span>
//                 <a href="/signup">회원 가입</a>
//               </div>
//             </form>
//           </div>

//           {/* 가운데 "또는" */}
//           <div className="login-divider-wrapper">
//             <div className="login-divider">또는</div>
//           </div>

//           {/* 오른쪽 소셜 로그인 */}
//           <div className="login-right">
//             <div className="social-login-box">
//               <h4>소셜 계정으로 로그인</h4>
//               <div className="social-login-buttons">
//                 <a href="http://localhost:9093/oauth2/authorization/kakao?prompt=login">
//                   <img src="/images/kakao_login_medium_narrow.png" alt="카카오 로그인" className="social-login-image" />
//                 </a>
//                 <a href="http://localhost:9093/oauth2/authorization/google?prompt=select_account">
//                   <img src="/images/web_light_sq_SI@1x.png" alt="구글 로그인" className="social-login-image" />
//                 </a>
//                 <a href="http://localhost:9093/oauth2/authorization/naver?prompt=login">
//                   <img src="/images/btnG_naver.png" alt="네이버 로그인" className="social-login-image" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./SignupForm.css"; // ✅ 회원가입과 같은 디자인 사용

const LoginPage = () => {
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    id_save: false,
    passwd_save: false,
  });

    // 상단 useState
  const [rememberId, setRememberId] = useState(false);
  const [rememberPw, setRememberPw] = useState(false);

  const handleIdRemember = (e) => {
    setRememberId(e.target.checked);
  };

  const handlePwRemember = (e) => {
    setRememberPw(e.target.checked);
  };

  const [idMsg, setIdMsg] = useState("");
  const [passwdMsg, setPasswdMsg] = useState("");

  const passwdRef = useRef();
  const btnSendRef = useRef();

  useEffect(() => {
    const savedId = localStorage.getItem("saved_id");
    const savedPasswd = localStorage.getItem("saved_passwd");

    setForm((prev) => ({
      ...prev,
      id: savedId || "",
      passwd: savedPasswd || "",
      id_save: !!savedId,
      passwd_save: !!savedPasswd,
    }));
    window.scrollTo({ top: 0 });

  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.id.trim()) {
      setIdMsg("아이디(이메일)를 입력해주세요.");
      return;
    }
    if (!form.passwd.trim()) {
      setPasswdMsg("비밀번호를 입력해주세요.");
      return;
    }

    // 저장
    form.id_save
      ? localStorage.setItem("saved_id", form.id)
      : localStorage.removeItem("saved_id");

    form.passwd_save
      ? localStorage.setItem("saved_passwd", form.passwd)
      : localStorage.removeItem("saved_passwd");

    try {
      const response = await axios.post("/api/members/login", {
        id: form.id,
        passwd: form.passwd,
      });

      // ✅ 여기에서 user 변수 선언
      const user = response.data.user;

      localStorage.setItem("memberno", user.memberno); // 이 줄이 필요해!!!
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("로그인 성공!");
      window.location.href = "/";
    } catch (error) {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };


  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="signup-page-full">
      <div className="signup-wrapper">
        <h2 className="signup-title">로그인</h2>
        <p className="signup-subtitle">오른손케어에 오신 것을 환영합니다 😊</p>
        <form className="signup-card" onSubmit={handleLogin}>
        {/* 아이디 입력 */}
        <div className="form-group">
          <label>아이디(이메일)</label>
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="예: user@example.com"
            onKeyPress={(e) => handleKeyPress(e, passwdRef)}
          />
          {idMsg && <p className="email-message invalid">{idMsg}</p>}
        </div>
        <div className="login-save-checkbox checkbox-under-id">
          <label>
            <input type="checkbox" checked={rememberId} onChange={handleIdRemember} />
            아이디 저장
          </label>
        </div>


        {/* 비밀번호 입력 */}
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="passwd"
            value={form.passwd}
            ref={passwdRef}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
          />
          {passwdMsg && <p className="email-message invalid">{passwdMsg}</p>}
        </div>
        <div className="login-save-checkbox checkbox-under-passwd">
        <label>
          <input type="checkbox" checked={rememberPw} onChange={handlePwRemember} />
          비밀번호 저장
        </label>
      </div>

          <button type="submit" ref={btnSendRef} className="submit-btn">
            로그인
          </button>
          </form>

          <div className="login-find-links" style={{ marginTop: "12px", textAlign: "center" }}>
            <a href="/find_passwd">비밀번호 찾기</a> <span style={{ margin: "0 8px" }}>|</span>
            <a href="/signup">회원 가입</a> <span style={{ margin: "0 8px" }}>|</span>
            <a href="/admin_login">관리자 로그인</a>
          {/* 가운데 "또는" */}
          <div className="login-divider-wrapper">
            <div className="login-divider">또는</div>
          </div>

          <hr style={{ margin: "24px 0" }} />

          <div style={{ textAlign: "center" }}>
            <h4 style={{ marginBottom: "12px" }}>소셜 로그인</h4>
              <div className="social-login-buttons">
                <a href="/oauth2/authorization/kakao" className="kakao social-login-button">
                  <span className="social-content">
                    <img src="/images/kakao-icon.png" alt="Kakao" className="social-icon" />
                    Kakao로 시작하기
                  </span>
                </a>

                <a href="/oauth2/authorization/naver" className="naver social-login-button">
                  <span className="social-content">
                    <img src="/images/naver-icon.png" alt="Naver" className="social-icon" />
                    Naver로 시작하기
                  </span>
                </a>

                <a href="/oauth2/authorization/google" className="google social-login-button">
                  <span className="social-content">
                    <img src="/images/google-icon.png" alt="Google" className="social-icon" />
                    Google로 시작하기
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
