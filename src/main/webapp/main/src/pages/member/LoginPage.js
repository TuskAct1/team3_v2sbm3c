import axios from "axios";
import "./SignupForm.css";
import React, { useEffect, useRef, useState } from "react";

const LoginPage = () => {
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    id_save: false,
    passwd_save: false,
  });

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
      id_save: !!savedId,
      passwd: savedPasswd || "",
      passwd_save: !!savedPasswd,
    }));

    window.scrollTo({ top: 0 });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 아이디 저장 체크박스
    if (name === "id_save") {
      if (checked) {
        const savedId = localStorage.getItem("saved_id") || "";
        setForm((prev) => ({
          ...prev,
          id_save: true,
          id: savedId,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          id_save: false,
          id: "",
        }));
      }
      return;
    }

    // 비밀번호 저장 체크박스
    if (name === "passwd_save") {
      if (checked) {
        const savedPasswd = localStorage.getItem("saved_passwd") || "";
        setForm((prev) => ({
          ...prev,
          passwd_save: true,
          passwd: savedPasswd,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          passwd_save: false,
          passwd: "",
        }));
      }
      return;
    }

    // 일반 입력값
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
    } else {
      setIdMsg("");
    }
    if (!form.passwd.trim()) {
      setPasswdMsg("비밀번호를 입력해주세요.");
      return;
    } else {
      setPasswdMsg("");
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

      // ✅ 필수! memberno 따로 저장
      localStorage.setItem("memberno", response.data.user.memberno);

      // 선택적으로 user 전체 저장
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
        <h1 className="signup-title">로그인</h1>
        <p className="signup-subtitle">토닥에 오신 것을 환영합니다 😊</p>
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
              autoComplete="username"
            />
            {idMsg && <p className="email-message invalid">{idMsg}</p>}
          </div>
          <div className="login-save-checkbox checkbox-under-id">
            <label>
              <input
                type="checkbox"
                name="id_save"
                checked={form.id_save}
                onChange={handleChange}
              />
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
              autoComplete="current-password"
            />
            {passwdMsg && <p className="email-message invalid">{passwdMsg}</p>}
          </div>
          <div className="login-save-checkbox checkbox-under-passwd">
            <label>
              <input
                type="checkbox"
                name="passwd_save"
                checked={form.passwd_save}
                onChange={handleChange}
              />
              비밀번호 저장
            </label>
          </div>

          <button type="submit" ref={btnSendRef} className="sign-submit-btn">
            로그인
          </button>
        </form>

        <div className="login-find-links" style={{ marginTop: "12px", textAlign: "center" }}>
          <a href="/find_passwd">비밀번호 찾기</a> <span style={{ margin: "0 8px" }}>|</span>
          <a href="/signup">회원 가입</a> <span style={{ margin: "0 8px" }}>|</span>
          <a href="/admin_login">관리자 로그인</a>
          <div className="login-divider-wrapper">
            <div className="login-divider">또는</div>
          </div>
          <hr style={{ margin: "24px 0" }} />
          <div style={{ textAlign: "center" }}>
            <h4 style={{ marginBottom: "12px" }}>소셜 로그인</h4>
            <div className="social-login-buttons">
              <a
                href="http://localhost:9093/oauth2/authorization/kakao?prompt=login"
                className="kakao social-login-button"
              >
                <span className="social-content">
                  <img src="/images/kakao-icon.png" alt="Kakao" className="social-icon" />
                  Kakao로 시작하기
                </span>
              </a>
              <a
                href="http://localhost:9093/oauth2/authorization/naver?prompt=login"
                className="naver social-login-button"
              >
                <span className="social-content">
                  <img src="/images/naver-icon.png" alt="Naver" className="social-icon" />
                  Naver로 시작하기
                </span>
              </a>
              <a
                href="http://localhost:9093/oauth2/authorization/google?prompt=select_account"
                className="google social-login-button"
              >
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
