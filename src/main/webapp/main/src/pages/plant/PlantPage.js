import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantCreatePage from "./PlantCreatePage";
import PlantMain from "./PlantMain";
import PlantIntro from "./PlantIntro";
import { useNavigate } from "react-router-dom";



const PlantPage = () => {
  const [plants, setPlants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    // ❗️처음 접속한 사용자라면 Intro 보여주기
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
      return; // 여기서 중단. 이후 요청은 Intro에서 navigate로 이동.
    }

    if (user?.memberno) {
      axios
        .get(`/api/plants/list?memberno=${user.memberno}`)
        .then((res) => {
          setPlants(res.data);
        })
        .catch((err) => {
          console.error("🌱 식물 목록 조회 실패:", err);
          setPlants([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.memberno]);

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  if (showIntro) {
    return <PlantIntro />;
  }

  if (loading || plants === null) {
    return <p>로딩 중입니다...</p>;
  }

  if (plants.length === 0) {
    return <PlantCreatePage />;
  }

  return <PlantMain plant={plants[0]} />;
};

export default PlantPage;
