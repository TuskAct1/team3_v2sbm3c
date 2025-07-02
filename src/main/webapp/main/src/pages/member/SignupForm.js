// SignupForm.js
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import './SignupForm.css';

const SignupForm = ({ mode = 'signup', initialData = null, onCancel, onUpdated }) => {
  const [form, setForm] = useState({
    id: "",
    passwd: "",
    passwd2: "",
    mname: "",
    nickname: "",
    birthdate: "",
    gender: "",
    tel: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("/images/signup_image.png");
  const [avatarFile, setAvatarFile] = useState(null);

  const [guardians, setGuardians] = useState([]);
  const [guardianFormOpen, setGuardianFormOpen] = useState(false);

  const [idMsg, setIdMsg] = useState("");
  const [idMsgClass, setIdMsgClass] = useState("");
  const [passwd2Msg, setPasswd2Msg] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const [idLoading, setIdLoading] = useState(false);

  const passwdRef = useRef();
  const passwd2Ref = useRef();
  const mnameRef = useRef();
  const telRef = useRef();
  const btnDaumRef = useRef();
  const address2Ref = useRef();
  const btnSendRef = useRef();

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id || "",
        passwd: "",
        passwd2: "",
        mname: initialData.mname || "",
        nickname: initialData.nickname || "",
        birthdate: initialData.birthdate || "",
        gender: initialData.gender || "",
        tel: initialData.tel || "",
        zipcode: initialData.zipcode || "",
        address1: initialData.address1 || "",
        address2: initialData.address2 || "",
      });
      if (initialData.guardians) {
        setGuardians(initialData.guardians);
        setGuardianFormOpen(true);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (!window.daum) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const checkID = async () => {
    if (form.id.trim().length === 0) {
      setIdMsg("아이디(이메일) 입력은 필수입니다.");
      setIdMsgClass("span_warning");
      setIdAvailable(false);
      return;
    }
    try {
      setIdLoading(true);
      setIdMsg("");
      const response = await axios.get(`/api/members/check-id?id=${encodeURIComponent(form.id)}`);
      if (response.data.available) {
        setIdMsg("사용 가능한 아이디입니다");
        setIdMsgClass("span_info");
        setIdAvailable(true);
        passwdRef.current?.focus();
      } else {
        setIdMsg("이미 사용중인 아이디입니다");
        setIdMsgClass("span_warning");
        setIdAvailable(false);
      }
    } catch (error) {
      setIdMsg("서버 오류가 발생했습니다");
      setIdMsgClass("span_warning");
      setIdAvailable(false);
    } finally {
      setIdLoading(false);
    }
  };

  const handleDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address1: addr,
          address2: "",
        }));
        setTimeout(() => {
          address2Ref.current?.focus();
        }, 100);
      },
    }).open();
  };

  const handleGuardianChange = (idx, e) => {
    const { name, value } = e.target;
    setGuardians((prev) => {
      const next = [...prev];
      next[idx][name] = value;
      return next;
    });
  };

  const openGuardianForm = () => {
    setGuardianFormOpen(true);
    if (guardians.length === 0) {
      setGuardians([{ name: "", relationship: "", email: "", phone: "" }]);
    }
  };

  const addGuardian = () => {
    setGuardians([...guardians, { name: "", relationship: "", email: "", phone: "" }]);
  };

  const removeGuardian = (idx) => {
    if (guardians.length === 1) {
      setGuardians([]);
      setGuardianFormOpen(false);
    } else {
      setGuardians(guardians.filter((_, i) => i !== idx));
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const SignupPageHeader = () => (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <div style={{ fontSize: "1.6em", fontWeight: "bold", margin: "32px 0 8px 0" }}>
        회원 가입
      </div>
      <div style={{ borderBottom: "2px solid #222", margin: "10px 0 16px 0", width: "100%" }} />
      <aside style={{ textAlign: "right", marginBottom: "10px" }}>
        <a href="#" onClick={() => window.location.reload()}>새로고침</a>
        <span style={{ margin: "0 8px" }}>|</span>
        <a href="/login">로그인</a>
        <span style={{ margin: "0 8px" }}>|</span>
        <a href="/admin_signup">관리자 회원 가입</a>
        <span style={{ margin: "0 8px" }}>|</span>
        <a href="/admin_list">목록</a>
      </aside>
      <div style={{ borderBottom: "1px solid #222", margin: "1px 0 16px 0", width: "100%" }} />
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idAvailable) {
      alert("아이디 중복 확인을 완료해주세요");
      return;
    }
    if (form.passwd !== form.passwd2) {
      setPasswd2Msg("입력된 패스워드가 일치하지 않습니다.");
      passwdRef.current?.focus();
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (avatarFile) formData.append("profileFile", avatarFile);

      guardians.forEach((g, i) => {
        formData.append(`guardian${i+1}_name`, g.name);
        formData.append(`guardian${i+1}_relationship`, g.relationship);
        formData.append(`guardian${i+1}_email`, g.email);
        formData.append(`guardian${i+1}_phone`, g.phone);
      });

      formData.append("point", 0);
      formData.append("provider", "local");

      const res = await axios.post("/api/members/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("회원가입이 완료되었습니다!");
        window.location.href = "/login";
      } else {
        alert("회원가입 실패: " + (res.data.message || ""));
      }
    } catch (err) {
      console.error("회원가입 오류", err);
      alert("서버 오류");
    }
  };
  
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <SignupPageHeader />
        <div className="avatar-wrapper">
          <img src={avatarPreview} alt="미리보기" className="avatar-overlay" />
          <input
            type="file"
            id="avatar_url"
            className="avatar-input"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                  setAvatarPreview(event.target.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="avatar_url" className="choose-image-btn">프로필 이미지 선택</label>
        </div>

        <br/>
        {/* 아이디 입력 필드 */}
        <div className="form-group">
          <label htmlFor="id">아이디(이메일)*</label>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              name="id"
              id="id"
              value={form.id}
              placeholder="예) user1@gmail.com"
              className="form-control form-control-sm"
              style={{ width: "70%", marginRight: "10px" }}
              onChange={(e) => {
                handleChange(e);
                setIdAvailable(false); // 아이디 변경 시 상태 초기화
                setIdMsg(""); // 메시지 초기화
              }}
            />
            <button
              type="button"
              onClick={checkID}
              className="btn btn-secondary btn-sm"
              style={{ width: "30%" }}
            >
              중복 확인
            </button>
          </div>
          <span id="id_msg" className={idMsgClass}>
            {idMsg}
          </span>
        </div>
        {/* 비밀번호 */}
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
            style={{ width: "30%" }}
            onChange={handleChange}
            ref={passwdRef}
            onKeyPress={(e) => handleKeyPress(e, passwd2Ref)}
          />
        </div>
        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="passwd2">비밀번호 확인*</label>
          <input
            type="password"
            name="passwd2"
            id="passwd2"
            value={form.passwd2}
            required
            placeholder="비밀번호 확인"
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
            ref={passwd2Ref}
            onKeyPress={(e) => handleKeyPress(e, mnameRef)}
          />
          <span id="passwd2_msg" className="span_warning">{passwd2Msg}</span>
        </div>
        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="mname">이름*</label>
          <input
            type="text"
            name="mname"
            id="mname"
            value={form.mname}
            required
            placeholder="이름"
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
            ref={mnameRef}
            onKeyPress={(e) => handleKeyPress(e, telRef)}
          />
        </div>
        {/* 닉네임 */}
        <div className="form-group">
          <label htmlFor="nickname">닉네임*</label>
          <input
            type="text"
            name="nickname"
            id="nickname"
            value={form.nickname}
            required
            placeholder="닉네임"
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
          />
        </div>
        {/* 생년월일 */}
        <div className="form-group">
          <label htmlFor="birthdate">생년월일*</label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            value={form.birthdate}
            required
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
          />
        </div>
        {/* 성별 */}
        <div className="form-group">
          <label>성별*</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="남자"
                checked={form.gender === "남자"}
                onChange={handleChange}
                required
              />{" "}
              남자
            </label>
            <label style={{ marginLeft: "1em" }}>
              <input
                type="radio"
                name="gender"
                value="여자"
                checked={form.gender === "여자"}
                onChange={handleChange}
                required
              />{" "}
              여자
            </label>
          </div>
        </div>
        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="tel">전화번호*</label>
          <input
            type="text"
            name="tel"
            id="tel"
            value={form.tel}
            required
            placeholder="예) 010-1234-5678"
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
            ref={telRef}
            onKeyPress={(e) => handleKeyPress(e, btnDaumRef)}
          />
        </div>
        {/* 우편번호 */}
        <div className="form-group">
          <label htmlFor="zipcode">우편번호*</label>
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            value={form.zipcode}
            placeholder="우편번호"
            className="form-control form-control-sm"
            style={{ width: "30%" }}
            onChange={handleChange}
            readOnly
          />
          <button
            type="button"
            id="btn_DaumPostcode"
            onClick={handleDaumPostcode}
            className="btn btn-primary btn-sm"
            style={{ marginTop: 4 }}
            ref={btnDaumRef}
          >
            우편번호 찾기
          </button>
        </div>
        {/* 주소 */}
        <div className="form-group">
          <label htmlFor="address1" style={{ width: "100%" }}>주소*</label>
          <input
            type="text"
            name="address1"
            id="address1"
            value={form.address1}
            placeholder="주소"
            className="form-control form-control-sm"
            onChange={handleChange}
            readOnly
          />
        </div>
        {/* 상세 주소 */}
        <div className="form-group">
          <label htmlFor="address2" style={{ width: "100%" }}>상세 주소</label>
          <input
            type="text"
            name="address2"
            id="address2"
            value={form.address2}
            placeholder="상세 주소"
            className="form-control form-control-sm"
            onChange={handleChange}
            ref={address2Ref}
            onKeyPress={(e) => handleKeyPress(e, btnSendRef)}
          />
        </div>
        <br/>
        {/* 보호자 정보 입력 버튼 */}
        <div className="form-group">
          {!guardianFormOpen && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={openGuardianForm}
            >
              보호자 정보 기입
            </button>
          )}
        </div>
        {/* 보호자 입력폼 */}
        {guardianFormOpen &&
          guardians.map((guardian, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #eee",
                padding: "10px",
                marginBottom: "10px",
                background: "#f9f9f9",
                position: "relative",
              }}
            >
              <div className="form-group">
                <label>보호자{idx + 1} 이름</label>
                <input
                  type="text"
                  name="name"
                  value={guardian.name}
                  required
                  placeholder="이름"
                  className="form-control form-control-sm"
                  style={{ width: "30%" }}
                  onChange={(e) => handleGuardianChange(idx, e)}
                />
              </div>
              <div className="form-group">
                <label>보호자{idx + 1}과의 관계</label>
                <input
                  type="text"
                  name="relationship"
                  value={guardian.relationship}
                  required
                  placeholder="예) 아들, 딸"
                  className="form-control form-control-sm"
                  style={{ width: "30%" }}
                  onChange={(e) => handleGuardianChange(idx, e)}
                />
              </div>
              <div className="form-group">
                <label>보호자{idx + 1} 이메일</label>
                <input
                  type="text"
                  name="email"
                  value={guardian.email}
                  required
                  placeholder="예) user1@gmail.com"
                  className="form-control form-control-sm"
                  style={{ width: "30%" }}
                  onChange={(e) => handleGuardianChange(idx, e)}
                />
              </div>
              <div className="form-group">
                <label>보호자{idx + 1} 전화번호</label>
                <input
                  type="text"
                  name="phone"
                  value={guardian.phone}
                  required
                  placeholder="예) 010-1234-5678"
                  className="form-control form-control-sm"
                  style={{ width: "30%" }}
                  onChange={(e) => handleGuardianChange(idx, e)}
                />
              </div>
              {/* ▽더보기 버튼(마지막 보호자 폼에만 표시) */}
              {idx === guardians.length - 1 && (
                <div style={{ marginTop: "5px" }}>
                  <button
                    type="button"
                    className="btn btn-link"
                    style={{ fontSize: "1.1em", padding: 0 }}
                    onClick={addGuardian}
                  >
                    보호자 추가
                  </button>
                </div>
              )}
              {/* 보호자 삭제 버튼 */}
              {guardians.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                  onClick={() => removeGuardian(idx)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="btn btn-primary"
          ref={btnSendRef}
          style={{ marginTop: 12 }}
        >
          회원가입
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
