import React, { useRef, useState, useEffect } from "react";
import './SignupForm.css';
import './LoginPageAdmin.css';

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
        window.location.href =  "/";
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("서버 오류: " + error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <h2 className="signup-title">관리자 로그인</h2>
      <p className="signup-subtitle">
        오른손케어 관리자 페이지에 접속합니다.<br />
        등록된 계정으로 로그인해주세요.
      </p>

      <form className="signup-card" onSubmit={handleLogin}>
        {/* 아이디 */}
        <div className="form-group">
          <label>아이디(이메일)</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            onKeyPress={(e) => handleKeyPress(e, passwdRef)}
            placeholder="admin@example.com"
          />
          {idMsg && <p className="email-message invalid">{idMsg}</p>}

          {/* ✅ 아이디 저장 체크박스 */}
          <div className="checkbox-inline-row">
            <input
              type="checkbox"
              name="id_save"
              checked={form.id_save}
              onChange={handleChange}
              id="id_save"
            />
            <label htmlFor="id_save">아이디 저장</label>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="passwd"
            value={form.passwd}
            onChange={handleChange}
            ref={passwdRef}
            onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
            placeholder="비밀번호 입력"
          />
          {passwdMsg && <p className="email-message invalid">{passwdMsg}</p>}

          {/* ✅ 비밀번호 저장 체크박스 */}
          <div className="checkbox-inline-row">
            <input
              type="checkbox"
              name="passwd_save"
              checked={form.passwd_save}
              onChange={handleChange}
              id="passwd_save"
            />
            <label htmlFor="passwd_save">비밀번호 저장</label>
          </div>
        </div>

        <button type="submit" ref={btnSendRef} className="submit-btn">
          로그인
        </button>

        <div className="login-find-links">
          <a href="/find_passwd">비밀번호 찾기</a>
          <span>|</span>
          <a href="/admin_signup">관리자 가입</a>
          <span>|</span>
          <a href="/login">일반 로그인</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPageAdmin;
