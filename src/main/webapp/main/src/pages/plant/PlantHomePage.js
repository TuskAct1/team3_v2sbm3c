// src/pages/plant/PlantHomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const PlantHomePage = () => {
  const [member, setMember] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 정보 가져오기
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setMember(parsed);
      } catch (e) {
        console.error("로그인 정보 파싱 실패", e);
      }
    }
  }, []);

  // 식물 목록 불러오기
  useEffect(() => {
    if (!member) return;

    axios.get("http://121.78.128.139:9093/api/plants/list", {
      params: { memberno: member.memberno }
    })
      .then(res => {
        setPlants(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("식물 정보를 불러오는 데 실패했습니다.");
      });
  }, [member]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌱 나의 반려식물</h2>

      {plants.length === 0 ? (
        <div>
          <p>아직 식물이 없어요. 새 식물을 심어보세요!</p>
          <button onClick={() => window.location.href = "/plant/create"}>
            식물 생성하기
          </button>
        </div>
      ) : (
        <div>
          {plants.map(plant => (
            <div key={plant.plantno} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <p>이름: {plant.plant_name}</p>
              <p>종류: {plant.plant_type}</p>
              <p>성장도: {plant.growth}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantHomePage;
