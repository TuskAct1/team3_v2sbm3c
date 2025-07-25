// EditProfileForm.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "./SignupForm.css"; // ✅ 기존 스타일 재사용4
import './EditProfileForm.css'; // ✅ 꼭 import 되어야 함
import { useNavigate } from "react-router-dom"; // 상단에 추가

const EditProfileForm = ({ user }) => {
  const [form, setForm] = useState({
    mname: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    tel: "",
    zipcode: "",
    address1: "",
    address2: "",
    profileFile: null,
    previewUrl: "",
  });

  useEffect(() => {
    if (user) {
      const [year, month, day] = (user.birthdate || "2000-01-01").split("-");
      setForm({
        mname: user.mname || "",
        nickname: user.nickname || "",
        gender: user.gender || "",
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        tel: user.tel || "",
        zipcode: user.zipcode || "",
        address1: user.address1 || "",
        address2: user.address2 || "",
        profileFile: null,
        previewUrl: `/profile/${user.profile || "default_profile.png"}`
      });
    }
  }, [user]);
  const navigate = useNavigate(); // 함수 내부에서 사용

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (option, name) => {
    setForm((prev) => ({ ...prev, [name]: option.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        profileFile: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address1: addr,
        }));
      }
    }).open();
  };

    // ✅ 여기 추가
  const handleCancel = () => {
    window.location.reload(); // 또는 setActiveTab('home')
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("memberno", user.memberno);
    formData.append("mname", form.mname);
    formData.append("nickname", form.nickname);
    formData.append("gender", form.gender);
    formData.append("birthdate", `${form.birthYear}-${form.birthMonth}-${form.birthDay}`);
    formData.append("tel", form.tel);
    formData.append("zipcode", form.zipcode);
    formData.append("address1", form.address1);
    formData.append("address2", form.address2);
    if (form.profileFile) {
      formData.append("profileFile", form.profileFile);
    }
    if (form.password) {
      formData.append("passwd", form.password);
      formData.append("passwd2", form.confirmPassword);
    }

    try {
      await axios.post("/api/members/update", formData);
      alert("회원 정보가 수정되었습니다.");
      window.location.reload();
    } catch (err) {
      alert("정보 수정 실패");
      console.error(err);
    }
  };

  // 생일 select
  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  });

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return { value: month, label: month };
  });

  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return { value: day, label: day };
  });



  return (
    <div className="signup-wrapper">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: "24px", fontWeight: "bold" }}>내 정보 수정</h3>

        {/* 프로필 */}
        <div className="profile-upload-container">
          <div className="profile-image-wrapper">
            <img src={form.previewUrl} alt="프로필" className="profile-image" />
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
          <label>이름</label>
          <input name="mname" value={form.mname} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <div className="birth-selects">
            <Select options={yearOptions} value={yearOptions.find(opt => opt.value === form.birthYear)} onChange={(opt) => handleSelectChange(opt, "birthYear")} />
            <Select options={monthOptions} value={monthOptions.find(opt => opt.value === form.birthMonth)} onChange={(opt) => handleSelectChange(opt, "birthMonth")} />
            <Select options={dayOptions} value={dayOptions.find(opt => opt.value === form.birthDay)} onChange={(opt) => handleSelectChange(opt, "birthDay")} />
          </div>
        </div>

        <div className="form-group">
          <label>성별</label>
          <div className="gender-group">
            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="남자"
                checked={form.gender === "남자"}
                onChange={handleChange}
              />
              남자
            </label>
            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="여자"
                checked={form.gender === "여자"}
                onChange={handleChange}
              />
              여자
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>전화번호</label>
          <input name="tel" value={form.tel} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>우편번호</label>
          <div className="form-row">
            <input name="zipcode" value={form.zipcode} readOnly />
            <button type="button" onClick={handlePostcode}>주소 찾기</button>
          </div>
        </div>

        <div className="form-group">
          <label>주소</label>
          <input name="address1" value={form.address1} readOnly />
        </div>

        <div className="form-group">
          <label>상세주소</label>
          <input name="address2" value={form.address2} onChange={handleChange} />
        </div>
        <div className="form-buttons">
        <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
        <button type="submit" className="submit-btn">수정완료</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
