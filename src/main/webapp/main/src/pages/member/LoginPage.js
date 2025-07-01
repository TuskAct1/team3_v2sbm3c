// loginpage.js2
import React, { useRef, useState } from "react";
import axios from "axios";

// 메뉴라인 컴포넌트
const MenuLine = () => (
  <div style={{ borderBottom: "2px solid #222", margin: "10px 0 16px 0", width: "100%" }} />
);
const MenuLine2 = () => (
  <div style={{ borderBottom: "1px solid #222", margin: "1px 0 16px 0", width: "100%" }} />
);

const LoginPage = () => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter" && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일) 입력은 필수입니다. 아이디(이메일)는 3자 이상 권장합니다.");
      setIdMsgClass("span_warning");
      return;
    }
    if (form.passwd.trim().length === 0) {
      setPasswdMsg("비밀번호 입력은 필수입니다. 비밀번호는 8자 이상 권장합니다.");
      return;
    }

    try {
      const response = await axios.post("/api/members/login", {
        id: form.id,
        passwd: form.passwd
      });
      // 로그인 성공 시 처리 (예: 토큰 저장, 메인 페이지 이동 등)
      localStorage.setItem("user", JSON.stringify(response.data.user)); // ← 이제 동작함
      alert("로그인 성공!");

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectPath || "/"; // 👈 로그인 후 다시 원래 페이지로 이동

    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <div style={{ width: "80%", margin: "0px auto" }}>
      <div style={{ width: "100%", margin: "0 auto" }}>
        <div style={{ fontSize: "1.6em", fontWeight: "bold", margin: "32px 0 8px 0" }}>로그인</div>
        <MenuLine />
        <aside style={{ textAlign: "right", marginBottom: "10px" }}>
          <a href="#" onClick={() => window.location.reload()}>새로고침</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/signup">회원 가입</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/admin_login">관리자 로그인</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href="/admin/list">목록</a>
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
            className="form-control fom-control-sm"
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
            />{" "}
            아이디 저장
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
            />{" "}
            비밀번호 저장
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
            회원 가입
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>또는 소셜 계정으로 로그인</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="http://localhost:9093/oauth2/authorization/kakao?prompt=login">
              <img src="/images/kakao_login_medium_narrow.png" alt="카카오 로그인" />
            </a>
            <a href="http://localhost:9093/oauth2/authorization/google?prompt=select_account">
              <img src="/images/google_login.png" alt="구글 로그인" />
            </a>
            <a href="http://localhost:9093/oauth2/authorization/naver?prompt=login">
              <img src="/images/naver_login.png" alt="네이버 로그인" />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
