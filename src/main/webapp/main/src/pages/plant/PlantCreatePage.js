// src/pages/plant/PlantCreatePage.js
import React, { useState } from "react";
import axios from "axios";
import "./PlantCreatePage.css"; // 스타일 분리

const PlantCreatePage = () => {
  const [form, setForm] = useState({
    plant_type: "딸기",
    plant_name: ""
  });

  const user = JSON.parse(localStorage.getItem("user")); // 로그인한 사용자

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
    const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.plant_name.trim()) {
      alert("식물 이름을 입력해주세요!");
      return;
    }

    if (!user || !user.memberno) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    // 👉 console.log는 여기에서만 사용해야 합니다
    console.log("✅ 유저 정보:", user);
    console.log("✅ 전송 데이터:", {
      ...form,
      memberno: user.memberno
    });

    axios.post("http://121.78.128.139:9093/api/plants/create", {
      ...form,
      memberno: user.memberno
    })
    .then(res => {
      console.log("✅ 서버 응답:", res.data); // 🔍 이 줄 추가
      if (res.data.success) {
        alert("식물이 생성되었습니다!");
        window.location.href = "/plant";
      } else {
        alert("생성 실패");
      }
    })
    .catch(err => {
      console.error("❌ 서버 오류:", err);
    });


  const plantImage = form.plant_type === "딸기"
    ? "/images/strawberry_seed.png"
    : "/images/tomato_seed.png";

  return (
    <div className="plant-create-container">
      <h2>🌱 나만의 식물 키우기</h2>

      <form onSubmit={handleSubmit} className="plant-create-form">
        <label>🌿 어떤 식물을 키울까요?</label>
        <select name="plant_type" value={form.plant_type} onChange={handleChange}>
          <option value="딸기">🍓 딸기</option>
          <option value="토마토">🍅 토마토</option>
        </select>

        <div className="plant-preview">
          <img src={plantImage} alt="식물 이미지" className="plant-image" />
        </div>

        <label>📛 식물 이름을 지어주세요</label>
        <input
          type="text"
          name="plant_name"
          value={form.plant_name}
          onChange={handleChange}
          placeholder="예: 새콤이, 토마"
          required
        />

        <button type="submit" className="plant-create-button">🌱 식물 심기</button>
      </form>
    </div>
  );
};
}
export default PlantCreatePage;