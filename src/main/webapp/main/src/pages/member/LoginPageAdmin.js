import React, { useRef, useState, useEffect } from "react";

// 구분선 컴포넌트
const MenuLine = () => (
  <div style={{ borderBottom: "2px solid #222", margin: "10px 0 16px 0", width: "100%" }} />
);
const MenuLine2 = () => (
  <div style={{ borderBottom: "1px solid #222", margin: "1px 0 16px 0", width: "100%" }} />
);

const LoginPageAdmin = () => {
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    id_save: false,
    passwd_save: false,
  });

  const [idMsg, setIdMsg] = useState("");
  const [idMsgClass, setIdMsgClass] = useState("");
  const [passwdMsg, setPasswdMsg] = useState("");

  const passwdRef = useRef();
  const btnSendRef = useRef();

  // ✅ 페이지 로드 시 저장된 값 불러오기
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

  // ✅ 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 엔터 키 → 다음 입력 포커스
  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter" && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // ✅ 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    // 필수 입력 확인
    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일) 입력은 필수 입니다. 아이디(이메일)는 3자이상 권장합니다.");
      setIdMsgClass("span_warning");
      return;
    } else {
      setIdMsg("");
      setIdMsgClass("");
    }

    if (form.passwd.trim().length === 0) {
      setPasswdMsg("비밀번호 입력은 필수 입니다. 비밀번호는 8자이상 권장합니다.");
      return;
    } else {
      setPasswdMsg("");
    }

    // ✅ 저장 여부에 따라 localStorage 처리
    if (form.id_save) {
      localStorage.setItem("admin_saved_id", form.id);
    } else {
      localStorage.removeItem("admin_saved_id");
    }

    if (form.passwd_save) {
      localStorage.setItem("admin_saved_passwd", form.passwd);
    } else {
      localStorage.removeItem("admin_saved_passwd");
    }

    // ✅ 로그인 요청
    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          passwd: form.passwd,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("user", JSON.stringify({
          adminno: data.user.adminno,
          email: data.user.email,
          id: data.user.id || data.user.email,
          role: "admin"
        }));

        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectPath;
        } else {
          window.location.href = "/";
        }
      } else {
        const errorText = await response.text();
        alert("로그인 실패: " + errorText);
      }
    } catch (error) {
      alert("서버 오류 발생: " + error.message);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSignup = () => {
    window.location.href = "/admin_signup";
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <div style={{ width: "100%", margin: "0 auto" }}>
        <div style={{ fontSize: "1.6em", fontWeight: "bold", margin: "32px 0 8px 0" }}>
          관리자 로그인
        </div>
        <MenuLine />
        <aside style={{ textAlign: "right", marginBottom: "10px" }}>
          <a href="#" onClick={() => window.location.reload()}>새로고침</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/signup">회원 가입</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/login">로그인</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/admin_signup">관리자 가입</a>
        </aside>
        <MenuLine2 />
      </div>

      <form id="frm" onSubmit={handleLogin}>
        <div>
          <label htmlFor="id">아이디(이메일)*</label>
          <input
            type="text"
            name="id"
            id="id"
            value={form.id}
            autoFocus
            placeholder="아이디(이메일)"
            className="form-control form-control-sm"
            style={{ width: "100%" }}
            onChange={handleChange}
            onKeyPress={(e) => handleKeyPress(e, passwdRef)}
          />
          <label>
            <input
              type="checkbox"
              name="id_save"
              id="id_save"
              checked={form.id_save}
              onChange={handleChange}
              value="Y"
            /> 아이디 저장
          </label>
          <span id="id_msg" className={idMsgClass}>{idMsg}</span>
        </div>

        <div className="form-group">
          <label htmlFor="passwd">비밀번호*</label>
          <input
            type="password"
            name="passwd"
            id="passwd"
            value={form.passwd}
            required
            placeholder="비밀번호"
            className="form-control form-control-sm"
            style={{ width: "100%" }}
            onChange={handleChange}
            ref={passwdRef}
            onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
          />
          <label>
            <input
              type="checkbox"
              name="passwd_save"
              id="passwd_save"
              checked={form.passwd_save}
              onChange={handleChange}
              value="Y"
            /> 비밀번호 저장
          </label>
          <span id="passwd_msg" className="span_warning">{passwdMsg}</span>
        </div>

        <div className="content_body_bottom">
          <button
            type="submit"
            id="btn_send"
            className="btn btn-secondary btn-sm"
            ref={btnSendRef}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary btn-sm"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSignup}
            className="btn btn-secondary btn-sm"
          >
            관리자 가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPageAdmin;
