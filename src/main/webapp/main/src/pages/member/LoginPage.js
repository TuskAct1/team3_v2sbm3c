import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import './SocialLoginButtons.css'; // 소셜 로그인 이미지 버튼 스타일

// 메뉴 라인 컴포넌트
const MenuLine = () => (
  <div style={{ borderBottom: "2px solid #222", margin: "10px 0 16px 0", width: "100%" }} />
);
const MenuLine2 = () => (
  <div style={{ borderBottom: "1px solid #222", margin: "1px 0 16px 0", width: "100%" }} />
);

const LoginPage = () => {
  // 입력값을 상태로 저장
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    id_save: false,
    passwd_save: false,
  });
  
  // LoginPage.js 파일 안쪽에 추가(상단 useState 등 포함)
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);

  // 아이디 찾기용
  const [findIdEmail, setFindIdEmail] = useState('');
  const [findIdResult, setFindIdResult] = useState('');

  // 비밀번호 찾기용
  const [findPwId, setFindPwId] = useState('');
  const [findPwResult, setFindPwResult] = useState('');


  const [idMsg, setIdMsg] = useState("");
  const [idMsgClass, setIdMsgClass] = useState("");
  const [passwdMsg, setPasswdMsg] = useState("");

  const passwdRef = useRef();      // 엔터 누를 때 다음으로 이동하기 위한 참조
  const btnSendRef = useRef();     // 로그인 버튼 참조

  // ✅ 페이지 로드 시 localStorage에서 저장된 아이디/비번 가져오기
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

  // ✅ 입력 변경 처리 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 엔터 키 눌렀을 때 다음 입력창으로 포커스 이동
  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter" && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // ✅ 로그인 버튼 클릭 시 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    // 필수 입력 확인
    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일) 입력은 필수입니다.");
      setIdMsgClass("span_warning");
      return;
    }
    if (form.passwd.trim().length === 0) {
      setPasswdMsg("비밀번호 입력은 필수입니다.");
      return;
    }

    // ✅ 저장 여부에 따라 localStorage에 저장/삭제
    if (form.id_save) {
      localStorage.setItem("saved_id", form.id);
    } else {
      localStorage.removeItem("saved_id");
    }

    if (form.passwd_save) {
      localStorage.setItem("saved_passwd", form.passwd);
    } else {
      localStorage.removeItem("saved_passwd");
    }

    // ✅ 서버에 로그인 요청
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

  // 취소 버튼 (이전 페이지로 이동)
  const handleCancel = () => {
    window.history.back();
  };

  // 회원가입 버튼
  const handleSignup = () => {
    window.location.href = "/signup";
  };

  // 아이디 찾기 요청 함수
  const handleFindId = async () => {
    if (!findIdEmail) return alert("이메일을 입력하세요");
    try {
      const res = await axios.post("/api/members/find-id", { email: findIdEmail });
      setFindIdResult(res.data.id || "해당 정보로 가입된 아이디가 없습니다.");
    } catch {
      setFindIdResult("아이디 찾기에 실패했습니다.");
    }
  };

  // 비밀번호 찾기 요청 함수
  const handleFindPw = async () => {
    if (!findPwId) return alert("이메일을 입력하세요.");
    try {
      const res = await axios.post("/api/members/find-password", {
        id: findPwId
      });
      setFindPwResult(res.data.msg || "임시 비밀번호가 이메일로 전송되었습니다.");
    } catch {
      setFindPwResult("비밀번호 찾기 실패");
    }
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
        {/* 🔹 아이디 입력 */}
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
            /> 아이디 저장
          </label>
          <span id="id_msg" className={idMsgClass}>{idMsg}</span>
        </div>

        {/* 🔹 비밀번호 입력 */}
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

        {/* 🔹 버튼들 */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <button type="button" className="btn btn-link"
            onClick={() => setShowFindId(true)}>
            아이디 찾기
          </button>
          <button type="button" className="btn btn-link"
            onClick={() => setShowFindPw(true)}>
            비밀번호 찾기
          </button>
        </div>

        {/* 🔹 소셜 로그인 이미지 */}
        <div style={{ marginTop: '20px' }}>
          <h4>또는 소셜 계정으로 로그인</h4>
          <div className="social-login-container">
            <a href="http://localhost:9093/oauth2/authorization/kakao?prompt=login">
              <img
                src="/images/kakao_login_medium_narrow.png"
                alt="카카오 로그인"
                className="social-login-image"
              />
            </a>
            <a href="http://localhost:9093/oauth2/authorization/google?prompt=select_account">
              <img
                src="/images/web_light_sq_SI@1x.png"
                alt="구글 로그인"
                className="social-login-image"
              />
            </a>
            <a href="http://localhost:9093/oauth2/authorization/naver?prompt=login">
              <img
                src="/images/btnG_naver.png"
                alt="네이버 로그인"
                className="social-login-image"
              />
            </a>
          </div>
        </div>
      </form>

      {/* 아이디 찾기 모달 */}
      {showFindId && (
        <div className="modal-bg">
          <div className="modal">
            <h3>아이디 찾기</h3>
            <input
              type="email"
              placeholder="가입한 이메일 입력"
              value={findIdEmail}
              onChange={e => setFindIdEmail(e.target.value)}
            />
            <button onClick={handleFindId}>아이디 찾기</button>
            <button onClick={() => { setShowFindId(false); setFindIdResult(""); }}>닫기</button>
            {findIdResult && <div style={{marginTop:10}}>{findIdResult}</div>}
          </div>
        </div>
      )}
      {/* 비밀번호 찾기 모달 */}
      {showFindPw && (
        <div className="modal-bg">
          <div className="modal">
            <h3>비밀번호 찾기</h3>
            <input
              type="text"
              placeholder="아이디 입력"
              value={findPwId}
              onChange={e => setFindPwId(e.target.value)}
            />
            <button onClick={handleFindPw}>비밀번호 찾기</button>
            <button onClick={() => { setShowFindPw(false); setFindPwResult(""); }}>닫기</button>
            {findPwResult && <div style={{marginTop:10}}>{findPwResult}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
