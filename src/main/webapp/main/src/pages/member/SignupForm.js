// SignupForm.js (주소 자동입력 + 전화번호 인증 포함)
import React, { useState, useEffect } from "react";
import './SignupForm.css';
// ⬆️ 최상단 import 부분
import axios from "axios"; // ✅ axios import 추가
import { useRef } from "react"; // ✅ useRef 사용 시 추가
import Select from 'react-select';
import SmsAuthInput from './SmsAuthInput'
import { FaTrashAlt } from 'react-icons/fa';


const SignupForm = () => {
  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    password2: "",
    mname: "",
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    tel: "",
    zipcode: "",
    address1: "",
    address2: "",
    profile: null,
    phoneCode: "",

    guardian_name: "",
    guardian_relationship: "",
    guardian_email: "",
    guardian_phone: "",

    guardian2_name: "",
    guardian2_relationship: "",
    guardian2_email: "",
    guardian2_phone: ""
  });

  // const [terms, setTerms] = useState({ terms1: false, terms2: false, terms3: false });
  const [allChecked, setAllChecked] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [terms, setTerms] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
  });
  const [telVerified, setTelVerified] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  const [passwd2Msg, setPasswd2Msg] = useState("");
  const [passwd2MsgValid, setPasswd2MsgValid] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "passwd2") {
      if (value !== form.passwd) {
        setPasswd2Msg("입력된 패스워드가 일치하지 않습니다.");
        setPasswd2MsgValid(false);
      } else {
        setPasswd2Msg("비밀번호가 일치합니다.");
        setPasswd2MsgValid(true);
      }
    }
  };

  useEffect(() => {
    if (form.password2 && form.password !== form.password2) {
      setPasswd2Msg("입력된 패스워드가 일치하지 않습니다.");
      setPasswd2MsgValid(false);
    } else if (form.password2 && form.password === form.password2) {
      setPasswd2Msg("비밀번호가 일치합니다.");
      setPasswd2MsgValid(true);
    } else {
      setPasswd2Msg("");
    }
  }, [form.password, form.password2]);

  // const handleFileChange = (e) => {
  //   setForm((prev) => ({ ...prev, profile: e.target.files[0] }));
  // };
  const [previewUrl, setPreviewUrl] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, profileFile: file }));
    }
  };

const handleTermsChange = (e) => {
  const { name, checked } = e.target;
  const newTerms = { ...terms, [name]: checked };  // ✅ 여기서 newTerms로 정의
  setTerms(newTerms);

  const all = Object.values(newTerms).every(Boolean);  // ✅ 여기도 newTerms 사용
  setAllChecked(all);
};

  const handleAllAgreeChange = (e) => {
  const checked = e.target.checked;
    setAllChecked(checked);
    setTerms({
      terms1: checked,
      terms2: checked,
      terms3: checked,
    });
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address1: addr
        }));
      }
    }).open();
  };

  const sendPhoneCode = () => {
    if (!form.tel) return alert("전화번호를 입력하세요.");
    setPhoneSent(true);
    alert("인증번호가 발송되었습니다 (모의 발송)");
  };

  const verifyPhoneCode = () => {
    if (form.phoneCode === "1234") {
      alert("전화번호 인증 성공");
    } else {
      alert("인증번호가 일치하지 않습니다");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idAvailable) {
      alert("아이디 중복 확인을 완료해주세요");
      return;
    }

    if (form.password !== form.password2) {
      setPasswd2Msg("입력된 패스워드가 일치하지 않습니다.");
      passwdRef.current?.focus();
      return;
    }

    // if (!telVerified) {
    //   alert("휴대폰 인증을 완료해주세요!");
    //   return;
    // }

    try {
      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("passwd", form.password);
      formData.append("passwd2", form.password2);
      formData.append("mname", form.mname);
      formData.append("nickname", form.nickname);
      formData.append("gender", form.gender);
      formData.append("birthdate", `${form.birthYear}-${form.birthMonth}-${form.birthDay}`);
      formData.append("tel", form.tel);
      formData.append("zipcode", form.zipcode);
      formData.append("address1", form.address1);
      formData.append("address2", form.address2);
      formData.append("provider", "local");
      formData.append("point", 0);
      if (form.profileFile) {
        formData.append("profileFile", form.profileFile);
      }

      // ✅ 보호자 1 정보
      if (guardians[0]) {
        formData.append("guardian_name", guardians[0].name);
        formData.append("guardian_relationship", guardians[0].relationship);
        formData.append("guardian_email", guardians[0].email);
        formData.append("guardian_phone", guardians[0].phone);
      }

      // ✅ 보호자 2 정보
      if (guardians[1]) {
        formData.append("guardian2_name", guardians[1].name);
        formData.append("guardian2_relationship", guardians[1].relationship);
        formData.append("guardian2_email", guardians[1].email);
        formData.append("guardian2_phone", guardians[1].phone);
      }

      const res = await axios.post("/api/members/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  
  const [idAvailable, setIdAvailable] = useState(false);   // 사용 가능 여부
  const [idMsg, setIdMsg] = useState("");                   // 메시지
  const [idMsgClass, setIdMsgClass] = useState("");         // 메시지 스타일
  const checkEmailDuplicate = async () => {
    if (!form.id.trim()) {
      setIdMsg("이메일을 입력해주세요.");
      setIdMsgClass("error-msg");
      setIdAvailable(false);
      return;
    }

    try {
      const res = await fetch(`/api/members/check-id?id=${encodeURIComponent(form.id)}`);
      const data = await res.json();
      if (data.available) {
        setIdMsg("사용 가능한 이메일입니다.");
        setIdMsgClass("success-msg");
        setIdAvailable(true);
      } else {
        setIdMsg("이미 사용 중인 이메일입니다.");
        setIdMsgClass("error-msg");
        setIdAvailable(false);
      }
    } catch (err) {
      setIdMsg("서버 오류입니다. 다시 시도해주세요.");
      setIdMsgClass("error-msg");
      setIdAvailable(false);
    }
  };

  // ⬇️ 컴포넌트 내부
  // const [passwd2Msg, setPasswd2Msg] = useState(""); // ✅ 메시지 상태 추가
  const passwdRef = useRef(null);                  // ✅ 패스워드 확인 입력창 포커싱용

  // 생년월일 옵션
  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  });
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return { value: month, label: month };
  });
  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return { value: day, label: day };
  });

  const handleSelectChange = (selectedOption, name) => {
    setForm(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const [serverCode, setServerCode] = useState("");  // 서버에서 받은 인증번호
  const [phoneVerified, setPhoneVerified] = useState(false);  // 인증 성공 여부

  const handleSendVerificationCode = async () => {
  if (!form.tel) {
    alert("전화번호를 입력해주세요.");
    return;
  }

  try {
    const res = await axios.post("/api/members/send-code", null, {
      params: { tel: form.tel },
    });
    setServerCode(res.data.code);
    alert("인증번호가 전송되었습니다. (현재는 콘솔 확인)");
    console.log("📦 인증번호:", res.data.code);  // 실제 서비스에서는 제거
  } catch (err) {
    console.error("인증번호 전송 실패", err);
    alert("인증번호 전송 실패");
  }
};

  const handleRequestCode = async () => {
    try {
      const res = await axios.post("/api/sms/send-code", null, {
        params: { tel: form.tel },
      });

      if (res.data.success) {
        alert("인증번호가 전송되었습니다.");
      } else {
        alert("전송 실패: " + res.data.message);
      }
    } catch (err) {
      alert("서버 오류: 인증번호 요청 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("/api/sms/verify-code", null, {
        params: { tel: form.tel, code: form.phoneCode },
      });

      if (res.data.success) {
        alert("인증되었습니다.");
        setPhoneVerified(true); // 상태값 등으로 처리 가능
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("서버 오류: 인증 실패");
    }
  };

    const [guardianFormOpen, setGuardianFormOpen] = useState(false);
    // ✅ 수정: 초기엔 빈 배열로
    // const [guardians, setGuardians] = useState([]);

    const [guardians, setGuardians] = useState([
      { name: "", relationship: "", email: "", phone: "" }
    ]);

    const [guardianVerifiedList, setGuardianVerifiedList] = useState([false]); // 1개 또는 2개

    const updateFormWithGuardian = (idx, key, value) => {
      const formKey =
        idx === 0
          ? `guardian_${key}`
          : `guardian2_${key}`;
      setForm((prev) => ({ ...prev, [formKey]: value }));
    };

    const openGuardianForm = () => {
      setGuardianFormOpen(true);
      setGuardians([{ name: "", relationship: "", email: "", phone: "", code: "" }]);
    };
    // const handleGuardianChange = (idx, field, value) => {
    //   setGuardians((prev) => {
    //     const updated = [...prev];
    //     updated[idx][field] = value;
    //     return updated;
    //   });
    // };

    const handleGuardianChange = (idx, key, value) => {
      setGuardians((prev) =>
        prev.map((g, i) => (i === idx ? { ...g, [key]: value } : g))
      );
    };


    const addGuardian = () => {
      setGuardians(prev => [...prev, { name: "", relationship: "", email: "", phone: "", code: "" }]);
      setTelVerifiedList(prev => [...prev, false]);
    };

    const removeGuardian = (idx) => {
      setGuardians(prev => prev.filter((_, i) => i !== idx));
      setTelVerifiedList(prev => prev.filter((_, i) => i !== idx));
    };


    

    // 관계 드롭다운 핸들러
    const handleGuardianSelectChange = (idx, selectedOption) => {
      setGuardians(prev =>
        prev.map((g, i) =>
          i === idx ? { ...g, relationship: selectedOption?.value || "" } : g
        )
      );
    };

    const relationshipOptions = [
    { value: '부모', label: '부모' },
    { value: '자녀', label: '자녀' },
    { value: '형제자매', label: '형제자매' },
    { value: '친척', label: '친척' },
    { value: '지인', label: '지인' },
    { value: '기타', label: '기타' },
  ];


  const [telVerifiedList, setTelVerifiedList] = useState(
    guardians.map(() => false)
  );



  

  return (
  <div className="signup-page-full">
    <div className="signup-wrapper">
      <h2 className="signup-title">회원가입</h2>
      <p className="signup-subtitle">
        토닥의 회원으로 로그인 하시면<br />
        토닥만의 특별한 서비스를 이용하실 수 있습니다.
      </p>

      <form className="signup-card" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>회원정보 입력</h3>
        <div className="profile-upload-container">
          <div className="profile-image-wrapper">
            <img
              src={previewUrl || "/default_profile.png"}
              alt="프로필 이미지"
              className="profile-image"
            />
            <label htmlFor="profileFile" className="camera-icon">
              <img src="/camera-icon.png" alt="카메라" />
            </label>
          </div>
          <input
            type="file"
            id="profileFile"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
          <div className="form-group">
            <label>아이디(이메일)</label>

            <div className="form-row">
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="예: user@example.com"
              />
              <button type="button" onClick={checkEmailDuplicate}>
                중복확인
              </button>
            </div>

            {/* 메시지를 form-row 밖에 위치시킵니다 */}
            {idMsg  && (
              <p className={`email-message ${idAvailable ? 'valid' : 'invalid'}`}>
                {idMsg}
              </p>
            )}
          </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            ref={passwdRef}
          />
          {passwd2Msg && (
            <p className={`email-message ${passwd2MsgValid ? 'valid' : 'invalid'}`}>
              {passwd2Msg}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>이름</label>
          <input name="mname" value={form.mname} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

      <div className="form-group">
      <label className="form-label">
        생년월일 <span style={{ color: 'red' }}>*</span>
      </label>
      <div className="birth-selects">
        <Select
          name="birthYear"
          options={yearOptions}
          value={yearOptions.find(opt => opt.value === form.birthYear)}
          onChange={(option) => handleSelectChange(option, 'birthYear')}
          placeholder="년도"
          className="birth-select"
          classNamePrefix="birth"
          menuPlacement="auto"       // 위/아래 자동 배치
          maxMenuHeight={200}        // 최대 높이 제한 (약 5개 항목 기준)
        />
        <Select
          name="birthMonth"
          options={monthOptions}
          value={monthOptions.find(opt => opt.value === form.birthMonth)}
          onChange={(option) => handleSelectChange(option, 'birthMonth')}
          placeholder="월"
          className="birth-select"
          classNamePrefix="birth"
          menuPlacement="auto"       // 위/아래 자동 배치
          maxMenuHeight={200}        // 최대 높이 제한 (약 5개 항목 기준)
        />
        <Select
          name="birthDay"
          options={dayOptions}
          value={dayOptions.find(opt => opt.value === form.birthDay)}
          onChange={(option) => handleSelectChange(option, 'birthDay')}
          placeholder="일"
          className="birth-select"
          classNamePrefix="birth"
          menuPlacement="auto"       // 위/아래 자동 배치
          maxMenuHeight={200}        // 최대 높이 제한 (약 5개 항목 기준)
        />
      </div>
      </div>

      <div className="form-group">
        <label>성별 <span style={{ color: "red" }}>*</span></label>
        <div className="gender-group">
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="남자"
              checked={form.gender === "남자"}
              onChange={handleChange}
            />&nbsp;
            남자
          </label>
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="여자"
              checked={form.gender === "여자"}
              onChange={handleChange}
            />&nbsp;
            여자
          </label>
        </div>
      </div>

      <SmsAuthInput
        value={form.tel}
        onChange={e => setForm(prev => ({ ...prev, tel: e.target.value }))}
        verified={telVerified}
        onVerified={() => setTelVerified(true)}
      />


        <div className="form-group">
          <label>우편번호</label>
          <div className="form-row">
            <input name="zipcode" value={form.zipcode} onChange={handleChange} readOnly />
            <button type="button" onClick={handlePostcode}>주소 찾기</button>
          </div>
        </div>

        <div className="form-group">
          <label>주소</label>
          <input name="address1" value={form.address1} onChange={handleChange} readOnly />
        </div>

        <div className="form-group">
          <label>상세주소</label>
          <input name="address2" value={form.address2} onChange={handleChange} />
        </div>

        {/* 보호자 정보 입력 버튼 (보호자가 없을 경우에만 노출) */}
        {(!guardianFormOpen || guardians.length === 0) && (
          <div className="form-group guardian-button-wrapper">
            <button
              type="button"
              className="btn btn-add-full"
              onClick={openGuardianForm}
              style={{ marginTop: "10px" }}
            >
              보호자 정보 입력하기
            </button>
          </div>
        )}

        {/* 보호자 입력란 */}
        {guardianFormOpen && guardians.length > 0 && (
          <>
            {guardians.map((guardian, idx) => (
          <div className="guardian-block" key={idx}>
            {/* ✖ 삭제 아이콘 */}
            <button
              type="button"
              className="guardian-close-btn"
              onClick={() => removeGuardian(idx)}
              aria-label="보호자 삭제"
            >
              ✖
            </button>

            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={guardian.name}
                onChange={(e) => handleGuardianChange(idx, "name", e.target.value)}
              />
            </div>

            <div className="form-group">
            <label className="form-label">
              보호자 관계 <span style={{ color: 'red' }}>*</span>
            </label>
            <div className="guardian-relationship-select">
              <Select
                options={relationshipOptions}
                classNamePrefix="select"
                value={relationshipOptions.find(opt => opt.value === guardian.relationship) || null}
                onChange={(selectedOption) =>
                  handleGuardianChange(idx, "relationship", selectedOption?.value)
                }
                placeholder="어떤 분이신가요?"
                styles={{
                  container: (base) => ({
                    ...base,
                    width: '100%',
                  }),
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <SmsAuthInput
              value={guardian.phone}
              onChange={(e) => {
                handleGuardianChange(idx, "phone", e.target.value);
                updateFormWithGuardian(idx, "phone", e.target.value); // form 반영
              }}
              verified={guardianVerifiedList[idx]}
              onVerified={() =>
                setGuardianVerifiedList((prev) =>
                  prev.map((v, i) => (i === idx ? true : v))
                )
              }
            />
          </div>


            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={guardian.email}
                onChange={(e) => handleGuardianChange(idx, "email", e.target.value)}
                placeholder="보호자 이메일"
              />
            </div>

            {/* 보호자 추가 버튼 */}
            {idx === guardians.length - 1 && guardians.length < 2 && (
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-add-full"
                  onClick={() => {
                    setGuardians((prev) => [
                      ...prev,
                      { name: "", relationship: "", email: "", phone: "" }
                    ]);
                    setGuardianVerifiedList((prev) => [...prev, false]);
                  }}
                >
                  + 보호자 추가
                </button>
              </div>
                )}
          </div>
        ))}
      </>
    )}

                           

     {/* // SignupForm.js 약관 UI 개선 */}
        <div className="terms-section">
          <div className="terms-all">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleAllAgreeChange}
              />
              <span className="terms-title">약관 전체동의</span>
            </label>
            <p className="terms-guide">
              서비스 이용과 정보보호를 위해 약관동의가 필요합니다.
            </p>
          </div>

          <hr className="terms-divider" />

          <div className="terms-item">
            <label className="terms-label">
              <input
                type="checkbox"
                name="terms1"
                checked={terms.terms1}
                onChange={handleTermsChange}
              />
              <span>서비스 이용약관 <span className="required">(필수)</span></span>
            </label>
            <span className="view-link" onClick={() => window.open('https://heemintest.notion.site/AI-230bf84fec728053a4f4ff25052d06d9?source=copy_link://link1', '_blank')}>자세히보기</span>
          </div>

          <div className="terms-item">
            <label className="terms-label">
              <input
                type="checkbox"
                name="terms2"
                checked={terms.terms2}
                onChange={handleTermsChange}
              />
              <span>개인정보 처리방침 <span className="required">(필수)</span></span>
            </label>
            <span className="view-link" onClick={() => window.open('https://link2', '_blank')}>자세히보기</span>
          </div>

          <div className="terms-item">
            <label className="terms-label">
              <input
                type="checkbox"
                name="terms3"
                checked={terms.terms3}
                onChange={handleTermsChange}
              />
              <span>마케팅 수신 정보동의 <span className="optional">(선택)</span></span>
            </label>
            <span className="view-link" onClick={() => window.open('https://link3', '_blank')}>자세히보기</span>
          </div>
        </div>
        <button type="submit" className="sign-submit-btn">가입완료</button>
      </form>
    </div>
  </div>
  );
};

export default SignupForm;
