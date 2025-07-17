// // SignupPageAdmin.js
// import React, { useRef, useState } from "react";

// // 메뉴라인 컴포넌트
// const MenuLine = () => (
//   <div
//     style={{
//       borderBottom: "2px solid #222",
//       margin: "24px 0 16px 0",
//       width: "100%",
//     }}
//   />
// );

// const SignupPageAdmin = () => {
//   const [form, setForm] = useState({
//     id: "",
//     passwd: "",
//     passwd2: "",
//     aname: "",
//   });

//   const [idMsg, setIdMsg] = useState("");
//   const [idMsgClass, setIdMsgClass] = useState("");
//   const [passwd2Msg, setPasswd2Msg] = useState("");

//   const idRef = useRef();
//   const passwdRef = useRef();
//   const passwd2Ref = useRef();
//   const anameRef = useRef();
//   const btnSendRef = useRef();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleKeyPress = (e, nextRef) => {
//     if (e.key === "Enter" && nextRef?.current) {
//       nextRef.current.focus();
//     }
//   };

//   const checkID = async () => {
//     if (form.id.trim().length === 0) {
//       setIdMsg("아이디(이메일) 입력은 필수 입니다.");
//       setIdMsgClass("span_warning");
//       return;
//     }

//     setIdMsg(<img src="/images/progress.gif" alt="로딩 중" style={{ width: "5%" }} />);
//     setIdMsgClass("");

//     try {
//       const res = await fetch(`/api/admin/check-email?email=${encodeURIComponent(form.id)}`);
//       const data = await res.json();

//       console.log("✅ check-email 응답:", data); // 여기를 확인하세요

//       if (data.available) {
//         setIdMsg("사용 가능한 아이디(이메일)입니다.");
//         setIdMsgClass("span_info");
//         passwdRef.current.focus();
//       } else {
//         setIdMsg("이미 사용중인 아이디(이메일)입니다.");
//         setIdMsgClass("span_warning");
//       }
//     } catch (error) {
//       setIdMsg("서버 오류가 발생했습니다.");
//       setIdMsgClass("span_warning");
//     }
//   };
// // SignupPageAdmin.js 내부 handleSubmit 함수 수정
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 필수 입력값 체크
//     if (form.id.trim().length === 0) {
//       setIdMsg("아이디(이메일) 입력은 필수 입니다.");
//       setIdMsgClass("span_warning");
//       return;
//     }
//     if (form.passwd !== form.passwd2) {
//       setPasswd2Msg("비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     if (form.aname.trim().length === 0) {
//       alert("이름을 입력해주세요.");
//       return;
//     }

//     // API 호출
//     try {
//       const response = await fetch("/api/admin/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: form.id,
//           password: form.passwd,
//           name: form.aname,
//         }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert("관리자 회원가입 성공!");
//         window.location.href = "/admin_login";
//       } else {
//         alert("회원가입 실패: " + result.message);
//       }
//     } catch (error) {
//       console.error("회원가입 요청 실패:", error);
//       alert("서버 통신 오류");
//     }
//   };

//   const handleCancel = () => {
//     setForm({ id: "", passwd: "", passwd2: "", aname: "" });
//     setIdMsg("");
//     setIdMsgClass("");
//     setPasswd2Msg("");
//   };

//   return (
//     <div style={{ width: "60%", margin: "0px auto" }}>
//       <div style={{ width: "100%", margin: "0 auto" }}>
//         <div style={{ fontSize: "1.6em", fontWeight: "bold", margin: "32px 0 8px 0" }}>
//           관리자 회원 가입
//         </div>
//         <MenuLine />
//         <aside style={{ textAlign: "right", marginBottom: "10px" }}>
//           <a href="#" onClick={() => window.location.reload()}>새로고침</a>
//           <span style={{ margin: "0 8px" }}>|</span>
//           <a href="/login">로그인</a>
//           <span style={{ margin: "0 8px" }}>|</span>
//           <a href="/signup">회원 가입</a>
//           <span style={{ margin: "0 8px" }}>|</span>
//           <a href="/admin/list">목록</a>
//         </aside>
//         <MenuLine />
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="id">아이디(이메일)*</label>
//           <input
//             type="text"
//             name="id"
//             id="id"
//             value={form.id}
//             ref={idRef}
//             autoFocus
//             placeholder="예) admin@example.com"
//             className="form-control form-control-sm"
//             style={{ width: "50%" }}
//             onChange={handleChange}
//             onKeyPress={(e) => handleKeyPress(e, passwdRef)}
//           />
//           <button
//             type="button"
//             onClick={checkID}
//             className="btn btn-primary btn-sm"
//             style={{ marginTop: 4 }}
//           >
//             중복확인
//           </button>
//           <span className={idMsgClass}>{idMsg}</span>
//         </div>

//         <div className="form-group">
//           <label htmlFor="passwd">비밀번호*</label>
//           <input
//             type="password"
//             name="passwd"
//             id="passwd"
//             value={form.passwd}
//             ref={passwdRef}
//             required
//             placeholder="비밀번호"
//             className="form-control form-control-sm"
//             style={{ width: "30%" }}
//             onChange={handleChange}
//             onKeyPress={(e) => handleKeyPress(e, passwd2Ref)}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="passwd2">비밀번호 확인*</label>
//           <input
//             type="password"
//             name="passwd2"
//             id="passwd2"
//             value={form.passwd2}
//             ref={passwd2Ref}
//             required
//             placeholder="비밀번호 확인"
//             className="form-control form-control-sm"
//             style={{ width: "30%" }}
//             onChange={handleChange}
//             onKeyPress={(e) => handleKeyPress(e, anameRef)}
//           />
//           <span className="span_warning">{passwd2Msg}</span>
//         </div>

//         <div className="form-group">
//           <label htmlFor="aname">이름*</label>
//           <input
//             type="text"
//             name="aname"
//             id="aname"
//             value={form.aname}
//             ref={anameRef}
//             required
//             placeholder="이름"
//             className="form-control form-control-sm"
//             style={{ width: "30%" }}
//             onChange={handleChange}
//             onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
//           />
//         </div>

//         <div style={{ marginTop: 12 }}>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             ref={btnSendRef}
//             style={{ marginRight: "10px" }}
//           >
//             가입
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={handleCancel}
//           >
//             취소
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignupPageAdmin;
import React, { useRef, useState } from "react";
import './SignupForm.css'; // ✅ 기존 사용자용 CSS 활용

const SignupPageAdmin = () => {
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    passwd2: "",
    aname: "",
  });
  const [idMsg, setIdMsg] = useState("");
  const [idMsgClass, setIdMsgClass] = useState("");
  const [passwd2Msg, setPasswd2Msg] = useState("");

  const idRef = useRef();
  const passwdRef = useRef();
  const passwd2Ref = useRef();
  const anameRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "passwd2") {
      if (value !== form.passwd) {
        setPasswd2Msg("비밀번호가 일치하지 않습니다.");
      } else {
        setPasswd2Msg("비밀번호가 일치합니다.");
      }
    }
  };

  const checkID = async () => {
    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일)를 입력해주세요.");
      setIdMsgClass("invalid");
      return;
    }

    try {
      const res = await fetch(`/api/admin/check-email?email=${encodeURIComponent(form.id)}`);
      const data = await res.json();

      if (data.available) {
        setIdMsg("사용 가능한 이메일입니다.");
        setIdMsgClass("valid");
      } else {
        setIdMsg("이미 사용 중인 이메일입니다.");
        setIdMsgClass("invalid");
      }
    } catch (error) {
      setIdMsg("서버 오류가 발생했습니다.");
      setIdMsgClass("invalid");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.passwd || !form.aname) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (form.passwd !== form.passwd2) {
      setPasswd2Msg("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.id,
          password: form.passwd,
          name: form.aname,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("관리자 회원가입 성공!");
        window.location.href = "/admin_login";
      } else {
        alert("회원가입 실패: " + result.message);
      }
    } catch (error) {
      alert("서버 통신 오류");
    }
  };

  return (
    <div className="signup-page-full">
      <div className="signup-wrapper">
        <h2 className="signup-title">관리자 회원가입</h2>
        <p className="signup-subtitle">
          관리자 계정을 등록하여<br />
          서비스 운영에 참여하세요.
        </p>

        <form className="signup-card" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>관리자 정보 입력</h3>

          <div className="form-group">
            <label>아이디(이메일)*</label>
            <div className="form-row">
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="예: admin@example.com"
              />
              <button type="button" onClick={checkID}>중복확인</button>
            </div>
            {idMsg && <p className={`email-message ${idMsgClass}`}>{idMsg}</p>}
          </div>

          <div className="form-group">
            <label>비밀번호*</label>
            <input
              type="password"
              name="passwd"
              value={form.passwd}
              onChange={handleChange}
              placeholder="비밀번호"
            />
          </div>

          <div className="form-group">
            <label>비밀번호 확인*</label>
            <input
              type="password"
              name="passwd2"
              value={form.passwd2}
              onChange={handleChange}
              placeholder="비밀번호 확인"
            />
            {passwd2Msg && (
              <p className={`email-message ${form.passwd === form.passwd2 ? 'valid' : 'invalid'}`}>
                {passwd2Msg}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>이름*</label>
            <input
              type="text"
              name="aname"
              value={form.aname}
              onChange={handleChange}
              placeholder="이름"
            />
          </div>

          <button type="submit" className="submit-btn">가입완료</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPageAdmin;
