// src/pages/LoginPage.js
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./LoginPage.css";

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
      passwd: savedPasswd || "",
      id_save: !!savedId,
      passwd_save: !!savedPasswd,
    }));

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

    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일) 입력은 필수입니다.");
      return;
    }
    if (form.passwd.trim().length === 0) {
      setPasswdMsg("비밀번호 입력은 필수입니다.");
      return;
    }

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

      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("로그인 성공!");

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectPath || "/";
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
      <div className="login-page-global-links">
        <a href="#" onClick={() => window.location.reload()}>새로고침</a>
        <a href="/signup">회원 가입</a>
        <a href="/admin_login">관리자 로그인</a>
      </div>

      <div className="login-wrapper">
        <div className="login-box">
          {/* 왼쪽 입력 + 버튼 */}
          <div className="login-left">
            <h3>로그인</h3>
            <form onSubmit={handleLogin} className="login-form-container">
              <div className="login-inline-row">
                <div className="login-input-block">
                  <input
                    type="text"
                    name="id"
                    value={form.id}
                    placeholder="아이디(이메일)"
                    onChange={handleChange}
                    onKeyPress={(e) => handleKeyPress(e, passwdRef)}
                  />
                  <input
                    type="password"
                    name="passwd"
                    value={form.passwd}
                    placeholder="비밀번호"
                    onChange={handleChange}
                    ref={passwdRef}
                    onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
                  />
                </div>

                <button type="submit" ref={btnSendRef} className="login-inline-btn">
                  로그인
                </button>
              </div>

              {idMsg && <span className="span_warning">{idMsg}</span>}
              {passwdMsg && <span className="span_warning">{passwdMsg}</span>}

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  name="id_save"
                  checked={form.id_save}
                  onChange={handleChange}
                />
                <label htmlFor="id_save">아이디 저장</label>

                <input
                  type="checkbox"
                  name="passwd_save"
                  checked={form.passwd_save}
                  onChange={handleChange}
                  style={{ marginLeft: "16px" }}
                />
                <label htmlFor="passwd_save">비밀번호 저장</label>
              </div>

              <div className="login-find-links">
                <a href="/find_id">아이디 찾기</a>
                <span>|</span>
                <a href="/find_passwd">비밀번호 찾기</a>
                <span>|</span>
                <a href="/signup">회원 가입</a>
              </div>
            </form>
          </div>

          {/* 가운데 "또는" */}
          <div className="login-divider-wrapper">
            <div className="login-divider">또는</div>
          </div>

          {/* 오른쪽 소셜 로그인 */}
          <div className="login-right">
            <div className="social-login-box">
              <h4>소셜 계정으로 로그인</h4>
              <div className="social-login-buttons">
                <a href="http://localhost:9093/oauth2/authorization/kakao?prompt=login">
                  <img src="/images/kakao_login_medium_narrow.png" alt="카카오 로그인" className="social-login-image" />
                </a>
                <a href="http://localhost:9093/oauth2/authorization/google?prompt=select_account">
                  <img src="/images/web_light_sq_SI@1x.png" alt="구글 로그인" className="social-login-image" />
                </a>
                <a href="http://localhost:9093/oauth2/authorization/naver?prompt=login">
                  <img src="/images/btnG_naver.png" alt="네이버 로그인" className="social-login-image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;