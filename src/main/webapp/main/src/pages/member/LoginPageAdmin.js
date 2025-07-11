import React, { useRef, useState, useEffect } from "react";
import './LoginPage.css'; // ✅ 공통 CSS 사용

const LoginPageAdmin = () => {
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
    const savedId = localStorage.getItem("admin_saved_id");
    const savedPasswd = localStorage.getItem("admin_saved_passwd");
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
      ? localStorage.setItem("admin_saved_id", form.id)
      : localStorage.removeItem("admin_saved_id");

    form.passwd_save
      ? localStorage.setItem("admin_saved_passwd", form.passwd)
      : localStorage.removeItem("admin_saved_passwd");

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id, passwd: form.passwd }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify({
          adminno: data.user.adminno,
          email: data.user.email,
          id: data.user.id || data.user.email,
          role: "admin",
        }));
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        window.location.href = redirectPath || "/";
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("서버 오류: " + error.message);
    }
  };

  return (
    <>
      {/* ✅ 상단 링크 */}
      <div className="login-page-global-links">
        <a href="#" onClick={() => window.location.reload()}>새로고침</a>
        <a href="/admin_signup">관리자 가입</a>
        <a href="/login">일반 로그인</a>
      </div>

      {/* ✅ 관리자 로그인 화면 */}
      <div className="login-wrapper">
        <div className="login-box">
          {/* 왼쪽 입력 + 버튼 */}
          <div className="login-left">
            <h3>관리자 로그인</h3>
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
                  id="id_save"
                />
                <label htmlFor="id_save">아이디 저장</label>

                <input
                  type="checkbox"
                  name="passwd_save"
                  checked={form.passwd_save}
                  onChange={handleChange}
                  id="passwd_save"
                  style={{ marginLeft: "16px" }}
                />
                <label htmlFor="passwd_save">비밀번호 저장</label>
              </div>

              <div className="login-find-links">
                <a href="/find_id">아이디 찾기</a>
                <span>|</span>
                <a href="/find_passwd">비밀번호 찾기</a>
                <span>|</span>
                <a href="/admin_signup">관리자 가입</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPageAdmin;
