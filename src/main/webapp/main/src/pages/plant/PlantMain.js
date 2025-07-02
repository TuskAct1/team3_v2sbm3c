
import React, { useEffect, useState } from 'react';
import './PlantMain.css';
import MiniGame from './games/MiniGame';
import QuizGame from './games/QuizGame';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlantMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [plantData, setPlantData] = useState({
    fruitType: localStorage.getItem('fruit_type') || '딸기',
    plantName: localStorage.getItem('plant_name') || '이름없는 식물',
    growth: 0,
    point: 0,
    sticker: 0,
    lastVisit: new Date(),
    daysAbsent: 0,
  });

  const [todayChecked, setTodayChecked] = useState(false);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);

  const getPlantImage = () => {
    const { growth, daysAbsent, fruitType } = plantData;
    const validGrowth = isNaN(growth) ? 0 : growth;
    const stage = Math.floor(validGrowth / 20) * 20;
    const condition =
      daysAbsent >= 8 ? 'wither3' :
      daysAbsent >= 3 ? 'wither2' :
      daysAbsent >= 1 ? 'wither1' : 'normal';
    return `/images/${fruitType}/${stage}_${condition}.png`;
  };

  const growthBarWidth = `${plantData.growth}%`;

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const res = await axios.get(`/api/members/${user.memberno}`);
        const memberInfo = res.data;
        
        setPlantData(prev => ({
          ...prev,
          point: memberInfo.point,
          sticker: memberInfo.sticker,
        }));
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
      }
    };

    fetchPlantData();
  }, []);

  useEffect(() => {
    const today = new Date();
    const lastVisitStr = localStorage.getItem('last_visit');
    const lastVisit = lastVisitStr ? new Date(lastVisitStr) : new Date();
    const diffTime = today - lastVisit;
    const daysAbsent = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setPlantData(prev => ({
      ...prev,
      lastVisit: today,
      daysAbsent: daysAbsent,
    }));
    localStorage.setItem('last_visit', today);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastAttendance = localStorage.getItem(`last_attendance_${user.memberno}`);
    if (lastAttendance === today) {
      setHasCheckedToday(true);
    }
  }, [user.memberno]);

  const handleUseItem = async (item, cost, growthAmount) => {
    try {
      const res = await axios.post('/api/plants/use-item', {
        memberno: user.memberno,
        item,
        cost
      });

      if (res.data.success) {
        const { point, growth, sticker, justHarvested } = res.data;

        setPlantData(prev => ({
          ...prev,
          point,
          growth,
          sticker, // ✅ 서버에서 받아온 값만 사용
        }));

        if (justHarvested) {
          alert("🎉 식물이 다 자랐어요! 스티커 +1");
        }
      } else {
        alert(res.data.message || "사용 실패");
      }
    } catch (err) {
      console.error("아이템 사용 오류", err);
      alert("오류 발생");
    }
  };

  const handleAttendanceCheck = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (hasCheckedToday) {
      alert("오늘은 이미 출석 체크 하셨어요!");
      return;
    }

    try {
      const res = await axios.post(`/api/attendance/check?memberno=${user.memberno}`);

      if (res.status === 200) {
        setHasCheckedToday(true);
        localStorage.setItem(`last_attendance_${user.memberno}`, today);
        setPlantData(prev => ({
          ...prev,
          point: prev.point + 10
        }));
        alert("✅ 출석 완료! 포인트 +10 지급되었습니다.");
      } else {
        alert("출석 처리 실패");
      }
    } catch (err) {
      console.error("출석 체크 중 오류:", err);
      alert("서버 오류로 출석 실패");
    }
  };

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const res = await axios.get(`/api/members/point?memberno=${user.memberno}`);
        const dbPoint = res.data.point ?? 50;
        setPlantData(prev => ({
          ...prev,
          point: dbPoint
        }));
      } catch (err) {
        console.error("❌ 포인트 조회 실패:", err);
        setPlantData(prev => ({
          ...prev,
          point: 50
        }));
      }
    };

    fetchPoint();
  }, []);

  return (
    <div className="plant-main-container">
      <h2 className="plant-title">🌿 {plantData.plantName} 키우기</h2>

      <div className="plant-image-wrapper">
        <img src={getPlantImage()} alt="식물" className="plant-image" />
      </div>

      <div className="status-container">
        <div className="status-box">
          <p>🌱 성장도</p>
          <div className="status-bar-wrapper">
            <div className="status-bar-inner blue" style={{ width: growthBarWidth }}>
              {plantData.growth}%
            </div>
          </div>
        </div>
        <div className="status-box">
          <p>💰 포인트: {plantData.point}</p>
        </div>
        <div className="status-box">
          <p>🎁 스티커: {plantData.sticker} / 10</p>
        </div>
      </div>

      <div className="shop-section">
        <h3>🛒 아이템 상점</h3>
        <ul className="shop-items">
          <li onClick={() => handleUseItem('비료', 10, 20)}>비료 (10P)</li>
          <li onClick={() => handleUseItem('물', 5, 10)}>물 (5P)</li>
          <li onClick={() => handleUseItem('영양제', 15, 25)}>영양제 (15P)</li>
          <li onClick={() => handleUseItem('흙', 8, 15)}>흙 (8P)</li>
        </ul>
        <p className="shop-tip">※ 아이템을 사용하면 식물이 잘 자라요!</p>
      </div>

      <div className="extras">
        <button onClick={handleAttendanceCheck}>✅ 출석 체크</button>

        {!showQuiz ? (
          <button onClick={() => setShowQuiz(true)}>🧠 퀴즈</button>
        ) : (
          <QuizGame onSuccess={(score) => {
            setShowQuiz(false);
            setPlantData(prev => ({
              ...prev,
              growth: Math.min(prev.growth + score * 5, 100),
              point: prev.point + score * 10,
            }));
          }} />
        )}

        {!showMiniGame ? (
          <button onClick={() => setShowMiniGame(true)}>🎮 미니게임</button>
        ) : (
          <MiniGame onSuccess={() => {
            setShowMiniGame(false);
            setPlantData(prev => ({
              ...prev,
              growth: Math.min(prev.growth + 5, 100),
              point: prev.point + 10,
            }));
          }} />
        )}

        <button onClick={() => {
          localStorage.removeItem("hasSeenIntro");
          window.location.href = "/plant"; // 새로고침하여 Intro 다시 보기
        }}>
          🌱 안내 메시지 다시 보기
        </button>
      </div>
    </div>
  );
};

export default PlantMain;
