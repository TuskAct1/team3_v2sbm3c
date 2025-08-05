import React, { useState } from "react";
import axios from "axios";
import './SignupForm.css';

const SmsAuthInput = ({ value, onChange, verified, onVerified }) => {
  const [sent, setSent] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [waiting, setWaiting] = useState(false);

  // 인증번호 요청
  const handleSendCode = async () => {
    if (!value.match(/^01[016789]\d{7,8}$/)) {
      alert("올바른 휴대폰 번호를 입력하세요.");
      return;
    }
    setWaiting(true);
    await axios.post("http://121.78.128.139:9093/alert/auth/sms/send", { phone: value });
    setSent(true);
    setWaiting(false);
    alert("인증번호가 발송되었습니다.");
  };

  // 인증번호 확인
  const handleVerify = async () => {
    const res = await axios.post("http://121.78.128.139:9093/alert/auth/sms/verify", { phone: value, code: codeInput });
    if (res.data.verified) {
      alert("인증 성공!");
      onVerified();
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="form-group">
      <label>전화번호 <span style={{ color: "red" }}>*</span></label>
      
      <div className="form-row">
        <input
          type="text"
          name="tel"
          value={value}
          placeholder="예) 01012345678"
          className="form-control form-control-sm"
          onChange={onChange}
          disabled={verified}
        />
        <button
          type="button"
          onClick={handleSendCode}
          className="cert-btn"
          disabled={verified || waiting}
        >
          {waiting ? "전송중..." : "인증번호 요청"}
        </button>
      </div>

      {sent && !verified && (
        <>
          <input
            type="text"
            maxLength={6}
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder="6자리 인증번호"
          />
          <button
            type="button"
            onClick={handleVerify}
            className="verify-btn"
          >확인</button>
        </>
      )}
      {verified && (
        <p style={{ color: "green" }}>✅ 인증이 완료되었습니다!</p>
      )}
    </div>
  );
};

export default SmsAuthInput;
