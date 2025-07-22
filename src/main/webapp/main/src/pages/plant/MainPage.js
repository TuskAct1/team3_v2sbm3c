import React, { useEffect, useState } from 'react';
import './MainPage.css';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext'; // ✅
import { useContext } from 'react';
import { usePoint } from './PointContext';
import axios from 'axios';

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

function MainPage() {
  const memberno = localStorage.getItem("memberno"); // ✅ 추가
  const { point, updatePoint, loading, setPoint } = usePoint(); // ✅ setPoint 포함해서 구조분해
  const [growth, setGrowth] = useState(0);
  const [plantName, setPlantName] = useState('');
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('hasSeenGuide') !== 'true';
  });

  useEffect(() => {
    const memberno = localStorage.getItem("memberno");
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
        console.warn("⚠️ memberno가 localStorage에 없습니다.");
        return;
      }

    try {
      const response = await axios.get(`/api/point/${memberno}`);
      setPoint(response.data.amount); // 또는 .point → VO 구조 확인
    } catch (error) {
      console.error('포인트 불러오기 실패:', error);
    }
  };

  // ✅ 씨앗 이름 불러오기
  useEffect(() => {
    const name = localStorage.getItem('plantName');
    if (name) {
      setPlantName(name);
    }
  }, []);


  const handleEvent = async (type) => {
    const memberno = localStorage.getItem("memberno");

    try {
      if (type === 'quiz') {
        await axios.post('/api/point/adjust', { memberno, amount: 10 });
        await axios.post('/api/plant/increase-growth', { memberno, value: 1 });
        alert('퀴즈 완료! +1% 성장, +10P');
      } else if (type === 'game') {
        const bonusGrowth = Math.floor(Math.random() * 2) + 1;
        const bonusPoint = Math.floor(Math.random() * 11) + 5;
        await axios.post('/api/point/adjust', { memberno, amount: bonusPoint });
        await axios.post('/api/plant/increase-growth', { memberno, value: bonusGrowth });
        alert(`게임 성공! +${bonusGrowth}% 성장, +${bonusPoint}P`);
      } else if (type === 'attendance') {
        await axios.post('/api/point/adjust', { memberno, amount: 5 });
        await axios.post('/api/plant/increase-growth', { memberno, value: 1 });
        alert('출석체크 완료! +1% 성장, +5P');
      }

      fetchPoint(); // 포인트 갱신
    } catch (err) {
      alert('이미 완료했거나 오류가 발생했어요.');
    }
  };

  const handleItemPurchase = async (itemType, amount, cost) => {
    const memberno = localStorage.getItem("memberno");
    try {
      const res = await axios.post('/api/point/adjust', { memberno, pointChange: -cost });
      if (res.data === 'success') {
        await axios.post('/api/plant/increase-growth', { memberno, value: amount });
        fetchPoint();
        alert(`${itemType} 사용! +${amount}% 성장, ${cost}P 차감`);
      } else {
        alert('포인트가 부족합니다.');
      }
    } catch (err) {
      alert('사용 중 오류 발생');
    }
  };


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

        <div className="plant-bar-wrapper">
          <div id="growth-bar" className="plant-bar" style={{ width: `${growth}%` }}></div>
        </div>

        <div id="point-bar" className="plant-point-box">
          <img src={coinIcon} alt="포인트" />
          <span>포인트 <b>{point}P</b></span>
        </div>

        <div className="plant-actions">
          <button onClick={() => handleItemPurchase('영양제', 1, 5)}>
            <img src={nutrientIcon} alt="영양제" /> 영양제 주기
          </button>
          <button onClick={() => handleItemPurchase('물', 1, 5)}>
            <img src={waterIcon} alt="물" /> 물 주기
          </button>
          <button onClick={() => handleItemPurchase('비료', 2, 10)}>
            <img src={fertilizerIcon} alt="비료" /> 비료 주기
          </button>
          <button onClick={() => handleEvent('attendance')}>
            <img src={checkIcon} alt="출석" /> 출석체크
          </button>
          <button onClick={() => handleEvent('quiz')}>
            <img src={quizIcon} alt="퀴즈" /> 퀴즈
          </button>
          <button onClick={() => handleEvent('game')}>
            <img src={gameIcon} alt="게임" /> 게임
          </button>
        </div>
      </div>

      {/* 안내 가이드 오버레이 */}
      {showGuide && <GuideOverlay onFinish={() => setShowGuide(false)} />}
    </div>
  );
}

export default MainPage;
