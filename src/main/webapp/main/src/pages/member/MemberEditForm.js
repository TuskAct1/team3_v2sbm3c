import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const MemberEditForm = ({ initialData, onUpdated, onCancel }) => {
  // 🔹 회원 정보 상태 정의
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

  // 🔹 보호자 정보 상태 (최대 2명)
  const [guardians, setGuardians] = useState([]);
  const address2Ref = useRef(); // 상세주소 입력창 포커스를 위해 사용 가능

  // 🔹 처음 마운트될 때 초기 데이터 세팅
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        passwd: "",   // 비밀번호는 보안상 표시 안함
        passwd2: "",
      });

      if (initialData.guardians) {
        setGuardians(initialData.guardians);
      }
    }
  }, [initialData]);

  // 🔹 일반 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 보호자 입력 값 변경 핸들러
  const handleGuardianChange = (idx, e) => {
    const { name, value } = e.target;
    setGuardians((prev) => {
      const next = [...prev];
      next[idx][name] = value;
      return next;
    });
  };

  // 🔹 소셜 로그인 사용자 여부 (naver 포함!)
  const isSocialUser = ["google", "kakao", "naver"].includes(initialData.provider);

  // 🔹 수정 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ 일반 회원은 비밀번호 확인 필수
    if (!isSocialUser && form.passwd !== form.passwd2) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const updatedMember = {
        ...form,
        guardians,
      };

      await axios.put("http://121.78.128.139:9093/api/members", updatedMember); // 서버로 수정 요청

      // ✅ 수정된 데이터 localStorage에 반영
      localStorage.setItem("user", JSON.stringify(updatedMember));

      // 🔄 전체 새로고침 (Navbar 등에 바로 반영되게)
      window.location.reload();

    } catch (err) {
      console.error("회원정보 수정 실패", err);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원정보 수정</h3>

      <div>
        <label>아이디 (이메일):</label>
        <input type="text" value={form.id} name="id" readOnly />
      </div>

      {/* ✅ 소셜 로그인 사용자는 비밀번호 입력 폼 생략 */}
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
        <input
          type="text"
          name="address2"
          value={form.address2}
          onChange={handleChange}
          ref={address2Ref}
        />
      </div>

      <div>
        <label>우편번호:</label>
        <input type="text" name="zipcode" value={form.zipcode} onChange={handleChange} readOnly />
      </div>

      {/* 🔸 보호자 정보 영역 (최대 2명) */}
      {guardians.length > 0 &&
        guardians.map((g, i) => (
          <div key={i} style={{ padding: "10px", border: "1px solid #ccc", margin: "10px 0" }}>
            <h4>보호자 {i + 1}</h4>
            <input
              type="text"
              name="name"
              value={g.name}
              onChange={(e) => handleGuardianChange(i, e)}
              placeholder="이름"
            />
            <input
              type="text"
              name="relationship"
              value={g.relationship}
              onChange={(e) => handleGuardianChange(i, e)}
              placeholder="관계"
            />
            <input
              type="text"
              name="email"
              value={g.email}
              onChange={(e) => handleGuardianChange(i, e)}
              placeholder="이메일"
            />
            <input
              type="text"
              name="phone"
              value={g.phone}
              onChange={(e) => handleGuardianChange(i, e)}
              placeholder="전화번호"
            />
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
