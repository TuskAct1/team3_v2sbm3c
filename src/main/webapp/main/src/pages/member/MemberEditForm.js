// 📁 src/components/MemberEditForm.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const MemberEditForm = ({ initialData, onUpdated, onCancel }) => {
  // 🔹 회원 기본 정보 상태
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

  // 🔹 보호자 정보 (2명까지)
  const [guardians, setGuardians] = useState([]);
  const address2Ref = useRef();

  // 🔹 컴포넌트 처음 렌더링 시, 전달받은 initialData로 폼 세팅
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        passwd: "",   // 비밀번호는 보이지 않게
        passwd2: "",  // 비밀번호 확인도 마찬가지
      });

      if (initialData.guardians) {
        setGuardians(initialData.guardians);
      }
    }
  }, [initialData]);

  // 🔹 input 값 변경 시 state 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 보호자 정보 입력 처리
  const handleGuardianChange = (idx, e) => {
    const { name, value } = e.target;
    setGuardians((prev) => {
      const next = [...prev];
      next[idx][name] = value;
      return next;
    });
  };

  // 🔹 저장(수정) 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 일반 회원일 경우에만 비밀번호 확인 체크
    const isSocialUser = initialData.provider === "google" || initialData.provider === "kakao";

    if (!isSocialUser && form.passwd !== form.passwd2) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const updatedMember = {
        ...form,
        guardians,
      };

      await axios.put("/api/members", updatedMember);  // 수정 요청
      onUpdated(updatedMember); // 수정 완료 후 부모에 알림
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      alert("수정 실패");
    }
  };

  // 🔹 소셜 로그인 사용자인지 판별 (provider가 google 또는 kakao)
  const isSocialUser = initialData.provider === "google" || initialData.provider === "kakao";

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원정보 수정</h3>

      <div>
        <label>아이디 (이메일):</label>
        <input type="text" value={form.id} name="id" readOnly />
      </div>

      {/* ✅ 일반 사용자만 비밀번호 입력 가능 */}
      {!isSocialUser && (
        <>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              name="passwd"
              value={form.passwd}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>비밀번호 확인:</label>
            <input
              type="password"
              name="passwd2"
              value={form.passwd2}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div>
        <label>이름:</label>
        <input type="text" name="mname" value={form.mname} onChange={handleChange} />
      </div>

      <div>
        <label>닉네임:</label>
        <input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
      </div>

      <div>
        <label>생년월일:</label>
        <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
      </div>

      <div>
        <label>성별:</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">선택</option>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div>
        <label>전화번호:</label>
        <input type="text" name="tel" value={form.tel} onChange={handleChange} />
      </div>

      <div>
        <label>주소:</label>
        <input type="text" name="address1" value={form.address1} onChange={handleChange} readOnly />
      </div>

      <div>
        <label>상세 주소:</label>
        <input type="text" name="address2" value={form.address2} onChange={handleChange} ref={address2Ref} />
      </div>

      <div>
        <label>우편번호:</label>
        <input type="text" name="zipcode" value={form.zipcode} onChange={handleChange} readOnly />
      </div>

      {/* 🔸 보호자 정보 */}
      {guardians.length > 0 &&
        guardians.map((g, i) => (
          <div key={i} style={{ padding: "10px", border: "1px solid #ccc", margin: "10px 0" }}>
            <h4>보호자 {i + 1}</h4>
            <input type="text" name="name" value={g.name} onChange={(e) => handleGuardianChange(i, e)} placeholder="이름" />
            <input type="text" name="relationship" value={g.relationship} onChange={(e) => handleGuardianChange(i, e)} placeholder="관계" />
            <input type="text" name="email" value={g.email} onChange={(e) => handleGuardianChange(i, e)} placeholder="이메일" />
            <input type="text" name="phone" value={g.phone} onChange={(e) => handleGuardianChange(i, e)} placeholder="전화번호" />
          </div>
        ))}

      <button type="submit">저장</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        취소
      </button>
    </form>
  );
};

export default MemberEditForm;
