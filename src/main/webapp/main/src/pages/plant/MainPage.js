import React, { useEffect, useState } from 'react';
import './MainPage.css';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext'; // ✅
import { useContext } from 'react';
import { usePoint } from './PointContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // ✅ 추가

import nutrientIcon from '../../assets/plant/nutrient.png';
import waterIcon from '../../assets/plant/water.png';
import fertilizerIcon from '../../assets/plant/fertilizer.png';
import checkIcon from '../../assets/plant/check.png';
import quizIcon from '../../assets/plant/quiz.png';
import gameIcon from '../../assets/plant/game.png';
import coinIcon from '../../assets/plant/coin.png';
import stickerIcon from '../../assets/plant/sticker.png';
import guideIcon from '../../assets/plant/guide.png';
import seedImage from '../../assets/plant/seed.png';
import RemainingCount from './RemainingCount';
import { useNavigate } from 'react-router-dom'; // ✅ 맨 위에 import



function MainPage() {
  const memberno = localStorage.getItem("memberno"); // ✅ 추가
  // const { point, updatePoint, loading, setPoint } = usePoint(); // ✅ setPoint 포함해서 구조분해
  const { point, updatePoint, setPoint } = usePoint();
  // const [point, setPoint] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [plantName, setPlantName] = useState('');
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('hasSeenGuide') !== 'true';
  });
  const plant_name = localStorage.getItem(`plantName_${memberno}`); // 식물 이름 
  const plant_seed = localStorage.getItem(`selectedSeed_${memberno}`);  // 식물 씨앗
  const [itemUsage, setItemUsage] = useState({
    nutrient: 0,
    water: 0,
    fertilizer: 0
  });
  const itemLimits = {
    nutrient: Infinity,   // 영양제 제한 없음
    water: 2,             // 물 하루 2회
    fertilizer: 1         // 비료 하루 1회
  };
  const navigate = useNavigate(); // ✅ 함수 내부 선언

  useEffect(() => {
    const memberno = localStorage.getItem("memberno");
    console.log(plant_name);
    
    if (memberno) {
      fetchPoint(memberno);
    }
  }, []);

  // useEffect(() => {
  //   fetchPoint(); // ✅ mount 시 포인트 불러오기
  // }, []);

  const fetchPoint = async () => {
    const memberno = localStorage.getItem("memberno");
    if (!memberno) {
      console.warn("⚠️ memberno가 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:9093/api/point/${memberno}`);
      
      console.log("📦 응답 전체:", response);
      console.log("📦 response.data:", response.data);

      const amount = response.data?.amount;
      console.log("💰 추출된 amount:", amount);

      if (typeof amount === 'number') {
        setPoint(amount); // context의 setPoint
        console.log("✅ 포인트 설정됨:", amount);
      } else {
        console.warn("📛 포인트 amount가 유효하지 않음:", amount);
        setPoint(0);
      }
    } catch (error) {
      console.error("❌ 포인트 불러오기 실패:", error);
      setPoint(0);
    }
  };

  // ✅ 씨앗 이름 불러오기
  useEffect(() => {
    const name = localStorage.getItem('plantName');
    if (name) {
      setPlantName(name);
    }
  }, []);

  // ✅ 함수 정의는 useEffect보다 위
  const fetchItemUsage = async () => {
    try {
      const memberno = localStorage.getItem("memberno");
      const res = await axios.get(`/api/item-usage/${memberno}`);
      setItemUsage(res.data); // 예: { nutrient: 3, water: 1, fertilizer: 0 }
    } catch (err) {
      console.error('❌ 아이템 사용 정보 불러오기 실패', err);
    }
  };

  const fetchGrowth = async () => {
    const memberno = localStorage.getItem("memberno");
    if (!memberno) return;
    try {
      const res = await axios.get(`/api/plant/member/${memberno}`);
      if (res.data && typeof res.data.growth === 'number') {
        setGrowth(res.data.growth);
      }
    } catch (err) {
      console.error('❌ 성장도 불러오기 실패', err);
    }
  };

  useEffect(() => {
    const memberno = localStorage.getItem("memberno");
    if (memberno) {
      fetchPoint(memberno);
      fetchGrowth();
      fetchItemUsage();
    }
  }, []);



  const handleEvent = async (type) => {
    const memberno = localStorage.getItem("memberno");

    try {
      if (type === 'quiz') {
        await axios.post('/api/point/adjust', { memberno, pointChange: 10 });
        const growthRes = await axios.post('/api/plant/increase-growth', { memberno, value: 1 });
        if (growthRes.data && typeof growthRes.data.growth === 'number') {
          setGrowth(growthRes.data.growth); // ✅
        }
        alert('퀴즈 완료! +1% 성장, +10P');

      } else if (type === 'game') {
        const bonusGrowth = Math.floor(Math.random() * 2) + 1;
        const bonusPoint = Math.floor(Math.random() * 11) + 5;

        await axios.post('/api/point/adjust', { memberno, pointChange: bonusPoint });
        const growthRes = await axios.post('/api/plant/increase-growth', { memberno, value: bonusGrowth });
        if (growthRes.data && typeof growthRes.data.growth === 'number') {
          setGrowth(growthRes.data.growth); // ✅
        }

        alert(`게임 성공! +${bonusGrowth}% 성장, +${bonusPoint}P`);

      } else if (type === 'attendance') {
        await axios.post('/api/point/adjust', { memberno, pointChange: 5 });
        const growthRes = await axios.post('/api/plant/increase-growth', { memberno, value: 1 });
        if (growthRes.data && typeof growthRes.data.growth === 'number') {
          setGrowth(growthRes.data.growth); // ✅
        }
        alert('출석체크 완료! +1% 성장, +5P');
      }

      fetchPoint(); // 포인트 갱신
    } catch (err) {
      alert('이미 완료했거나 오류가 발생했어요.');
    }
  };

  const handleItemPurchase = async (itemType, amount, cost) => {
    const memberno = localStorage.getItem("memberno");
    const key = itemType.toLowerCase(); // "영양제" → "nutrient"

    if (itemUsage[key] >= itemLimits[key]) {
      alert(`오늘 ${itemType}은 더 이상 줄 수 없어요!`);
      return;
    }

    try {
      const res = await axios.post('/api/point/adjust', { memberno, pointChange: -cost });

      if (res.data === 'success') {
        const growthRes = await axios.post('/api/plant/increase-growth', {
          memberno,
          value: amount
        });

        if (growthRes.data && typeof growthRes.data.growth === 'number') {
          setGrowth(growthRes.data.growth);
        }

        // ✅ 사용 기록 저장 API 호출
        await axios.post('/api/item-usage/log', {
          memberno,
          itemType: key
        });

        // ✅ 포인트/횟수/성장도 다시 불러오기
        await fetchPoint();
        await fetchItemUsage(); // 👈 여기서 서버에서 최신 횟수 반영

        alert(`${itemType} 사용! +${amount}% 성장, ${cost}P 차감`);
      } else {
        alert('포인트가 부족합니다.');
      }
    } catch (err) {
      console.error(err);
      alert('사용 중 오류 발생');
    }
  };

  const location = useLocation(); // ✅ MainPage 맨 위에 추가
  const praiseMessage = location.state?.praise;
  const correctCount = location.state?.todayCorrectCount;

  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    const memberno = localStorage.getItem("memberno");
    if (memberno) {
      axios.get(`/api/quiz/check/count/${memberno}`)
        .then(res => setQuizCount(res.data)) // 예: 1, 2, 3
        .catch(() => console.warn("퀴즈 카운트 불러오기 실패"));
    }
  }, []);

  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    if (quizCount >= 3) {
      setShowQuizModal(true);
      setTimeout(() => setShowQuizModal(false), 3500); // 3.5초 후 자동 닫힘
    }
  }, [quizCount]);



    


    


  return (
    <div className="plant-wrapper">
      <p className="plant-guide-text">
        열매가 될 때까지<br />무럭무럭 잘 키워봐요
      </p>

      <img src={seedImage} alt="씨앗" className="plant-image" />

      <div className="plant-floating-btns">
        <button id="guide-btn" className="circle-button" onClick={() => setShowGuide(true)}>
          <img src={guideIcon} alt="이용방법" />
          <span>이용방법</span>
        </button>
        <button id="sticker-btn" className="circle-button">
          <img src={stickerIcon} alt="스티커" />
          <span>스티커</span>
        </button>
      </div>

      <div className="plant-box">
        <div className="plant-header">
          <strong>{plantName || '씨앗 이름'}</strong>
          <span>{growth}%</span>
        </div>
          {/* ✅ 성장도 바 */}
        <div className="growth-bar-wrapper">
          <div className="growth-bar">
            <div
              className="growth-bar-fill"
              style={{ width: `${growth}%` }}
            ></div>
          </div>
        </div>

          {/* ✅ 포인트 표시 */}
      <div className="point-box">
        <img src={coinIcon} alt="포인트" className="point-icon" />
        <span className="point-label">포인트</span>
        <span className="point-value">{point}P</span>
      </div>


        <div className="plant-actions">
          {/* 영양제 */}
        <button 
          onClick={() => handleItemPurchase('영양제', 1, 5)} 
          disabled={false}
        >
          <img src={nutrientIcon} alt="영양제" /> 영양제 주기
          <RemainingCount used={itemUsage.nutrient} limit={itemLimits.nutrient} />
        </button>

        {/* 물 */}
        <button 
          onClick={() => handleItemPurchase('물', 1, 5)} 
          disabled={itemUsage.water >= itemLimits.water}
        >
          <img src={waterIcon} alt="물" /> 물 주기
          <RemainingCount used={itemUsage.water} limit={itemLimits.water} />
        </button>

        {/* 비료 */}
        <button 
          onClick={() => handleItemPurchase('비료', 2, 10)} 
          disabled={itemUsage.fertilizer >= itemLimits.fertilizer}
        >
          <img src={fertilizerIcon} alt="비료" /> 비료 주기
          <RemainingCount used={itemUsage.fertilizer} limit={itemLimits.fertilizer} />
        </button>

          <button onClick={() => handleEvent('attendance')}>
            <img src={checkIcon} alt="출석" /> 출석체크
          </button>
          <button onClick={() => navigate('/plant/quiz')}>
            <img src={quizIcon} alt="퀴즈" /> 퀴즈
            <RemainingCount used={quizCount} limit={3} />
          </button>
          <button onClick={() => handleEvent('game')}>
            <img src={gameIcon} alt="게임" /> 게임
          </button>
        </div>

        {praiseMessage && (
          <div className="praise-banner">
            <p>{praiseMessage}</p>
            {correctCount && <p>오늘 퀴즈 정답 수: {correctCount} / 3</p>}
          </div>
        )}

      </div>

      {/* 안내 가이드 오버레이 */}
      {showGuide && <GuideOverlay onFinish={() => setShowGuide(false)} />}
    </div>
  );
}

export default MainPage;
