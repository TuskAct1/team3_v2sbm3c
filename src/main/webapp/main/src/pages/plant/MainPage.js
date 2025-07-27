import React, { useEffect, useState } from 'react';
import './MainPage.css';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext'; // ✅
import { useContext } from 'react';
import { usePoint } from './PointContext';
import axios from 'axios';

import { useLocation } from 'react-router-dom'; // ✅ 추가
import classNames from 'classnames';

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
import GameSelect from '../../pages/plant/games/GameSelect';


// 👉 퀴즈 전용 컴포넌트 불러오기 
import QuizPage from '../../pages/plant/quiz/QuizPage'

function MainPage() {

  // const memberno = localStorage.getItem("memberno"); // ✅ 추가
  const memberno = parseInt(localStorage.getItem("memberno"), 10) || 0;
  // const { point, updatePoint, loading, setPoint } = usePoint(); // ✅ setPoint 포함해서 구조분해
  const { point, updatePoint, setPoint } = usePoint();
  // const [point, setPoint] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [plantName, setPlantName] = useState('');
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('hasSeenGuide') !== 'true';
  });
    // 👉 mode 상태 추가: menu(원래) / quiz(퀴즈)
  const [mode, setMode] = useState('menu');
  
  // MainPage.js 상단, 다른 useState 선언들과 함께
  // const memberno = localStorage.getItem("memberno");
  // const [attendanceChecked, setAttendanceChecked] = useState(false);

  const ITEM_KEY_MAP = {
    영양제: 'nutrient',
    물:     'water',
    비료:   'fertilizer'
  };
  const [attendanceChecked, setAttendanceChecked] = useState(false);

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
    const res = await axios.get(
      `http://localhost:9093/api/item-usage/today/all/${memberno}`
    );
    console.log("🛠️ fetchItemUsage raw:", res.data);

    // 기본값 세팅
    const usage = {
      nutrient: 0,
      water:    0,
      fertilizer: 0
    };

    if (Array.isArray(res.data)) {
      res.data.forEach(entry => {
        if (entry.item_type in usage) {
          usage[entry.item_type] = entry.cnt;
        }
      });
    } else if (res.data.item_type) {
      // 단일 객체인 경우
      const { item_type, cnt } = res.data;
      if (item_type in usage) {
        usage[item_type] = cnt;
      }
    } else {
      console.warn("Unexpected fetchItemUsage response:", res.data);
    }

    console.log("🛠️ fetchItemUsage mapped:", usage);
    setItemUsage(usage);
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
        try {
          const res = await axios.post('http://localhost:9093/api/attendance/plant/attendance');
          const { status, message } = res.data;

          if (status === 'success') {
            await fetchGrowth(); // 최신 성장도 반영
            await fetchPoint();  // 최신 포인트 반영
            alert(message);      // 예: "출석 완료 +10P 지급!"
          } else if (status === 'already') {
            alert('이미 오늘 출석하셨어요!');
          } else {
            alert('출석 처리 실패');
          }
        } catch (err) {
          console.error('출석 오류:', err);
          alert('출석 처리 중 오류 발생');
        }
      }

      fetchPoint(); // 포인트 갱신
    } catch (err) {
      alert('이미 완료했거나 오류가 발생했어요.');
    }
  };

  const handleItemPurchase = async (item_label, amount, cost) => {
    const memberno = localStorage.getItem("memberno");
    console.log('▶ handleItemPurchase start', item_label);
    const key = ITEM_KEY_MAP[item_label];
    console.log('  key →', key, '현재 사용량 →', itemUsage[key]);

    
    // const key = ITEM_KEY_MAP[item_label];
    if (!key) return alert('알 수 없는 아이템입니다.');

    // 제한 초과 검사
    if (itemUsage[key] >= itemLimits[key]) {
      return alert(`오늘 ${item_label}은 더 이상 줄 수 없어요!`);
    }

    try {
      // 1) 포인트 차감
      const adjustRes = await axios.post('/api/point/adjust', { memberno, pointChange: -cost });

        if (adjustRes.data.status !== 'success') {
          return alert('포인트가 부족합니다.');
        }

      // 2) 성장 증가
      await axios.post('/api/plant/increase-growth', { memberno, value: amount });

      // 3) 사용 로그 저장 (영어 key)
       await axios.post('/api/item-usage/log', {
        memberno,
        item_type: key   // ← 'water' / 'fertilizer' / 'nutrient' 중 하나가 기록됩니다
      });
      // 👉 바로 로컬 상태도 1 늘려주기
      setItemUsage(prev => ({
        ...prev,
        [key]: prev[key] + 1
      }));

      // 4) 전체 상태 리로드
      await reloadAll();

      alert(`${item_label} 사용! +${amount}% 성장, ${cost}P 차감`);
    } catch (err) {
      console.error(err);
      alert('사용 중 오류 발생');
    }
  };


  // const handleItemPurchase = async (item_type_label, amount, cost) => {
  //   const memberno = localStorage.getItem("memberno");
  //   const key = ITEM_KEY_MAP[item_type_label];
  //   if (!key) {
  //     console.error('Unknown item type:', item_type_label);
  //     return;
  //   }

  //   if (itemUsage[key] >= itemLimits[key]) {
  //     alert(`오늘 ${item_type}은 더 이상 줄 수 없어요!`);
  //     return;
  //   }

  //   try {
  //     const res = await axios.post('/api/point/adjust', { memberno, pointChange: -cost });

  //     if (res.data === 'success') {
  //       const growthRes = await axios.post('/api/plant/increase-growth', {
  //         memberno,
  //         value: amount
  //       });

  //       if (growthRes.data && typeof growthRes.data.growth === 'number') {
  //         setGrowth(growthRes.data.growth);
  //       }

  //       // ✅ 사용 기록 저장 API 호출
  //       await axios.post('/api/item-usage/log', {
  //         memberno,
  //         item_type: key
  //       });

  //       await reloadAll();

  //       alert(`${item_type} 사용! +${amount}% 성장, ${cost}P 차감`);
  //     } else {
  //       alert('포인트가 부족합니다.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('사용 중 오류 발생');
  //   }
    
  // };

  const location = useLocation(); // ✅ MainPage 맨 위에 추가
  const praiseMessage = location.state?.praise;
  const correctCount = location.state?.todayCorrectCount;

  const [quizCount, setQuizCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);

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

   useEffect(() => {
    console.log('🌱 fetching plant info for memberno', memberno);
    axios.get(`/api/plant/info/${memberno}`)
      .then(res => {
        console.log('🌱 plant info response:', res.data);
        // 👇 여기를 점검!
        // 실제 JSON 구조에 맞춰 아래 두 줄을 수정해야 합니다.
        setPlantName(res.data.plant_name ?? res.data.plantName ?? '');
        setGrowth(    res.data.growth);
      })
      .catch(err => {
        console.error('🌱 식물 정보 조회 실패:', err);
      });
  }, [memberno]);

    // 📥 출석 체크 핸들러 추가 (fetchGrowth 아래, return 앞)
      const handleAttendance = async () => {
        if (attendanceChecked) return;  // 이미 출석한 상태면 무시

        try {
          const res = await axios.post(
            'http://localhost:9093/api/attendance/plant/attendance'
          );
          const { status, message } = res.data;

          if (status === 'success') {
            setAttendanceChecked(true);
            alert(message);      // "출석 완료! 포인트 +10 지급되었습니다."
            await reloadAll();   // growth, point, itemUsage 등 전체 갱신
          } else {
            // 이미 출석된 상태라면
            setAttendanceChecked(true);
            alert(message);      // "이미 출석하셨습니다."
          }
        } catch (err) {
          console.error('출석 처리 오류:', err);
          alert('출석 처리 중 오류가 발생했습니다.');
        }
      };

   // 퀴즈 횟수 체크
  useEffect(() => {
    if (memberno) {
      axios.get(`/api/quiz/check/count/${memberno}`)
        .then(res => setQuizCount(res.data))
        .catch(() => console.warn("퀴즈 카운트 불러오기 실패"));
    }
  }, []);

  useEffect(() => {
    if (quizCount >= 3) {
      setShowQuizModal(true);
      setTimeout(() => setShowQuizModal(false), 3500);
    }
  }, [quizCount]);

    // 👉 1) 퀴즈 제한 메시지용 state
  const [showQuizLimitMsg, setShowQuizLimitMsg] = useState(false);

  // 👉 2) 퀴즈 버튼 클릭 핸들러
  const handleQuizClick = () => {
    if (quizCount >= 3) {
      setShowQuizLimitMsg(true);
      // 7초 뒤 메시지 숨기기
      setTimeout(() => setShowQuizLimitMsg(false), 7000);
    } else {
      setMode('quiz');
    }
  };

  
  // ➋ 퀴즈 횟수 fetch 함수 (기존 useEffect 내용 그대로 뺐습니다)
  const fetchQuizCount = async () => {
    if (!memberno) return;
    try {
      const res = await axios.get(`http://localhost:9093/api/quiz/check/count/${memberno}`);
      setQuizCount(res.data);
    } catch {
      console.warn("퀴즈 카운트 불러오기 실패");
    }
  };

  // ➌ “모든 데이터” 한 번에 다시 불러오기
    const reloadAll = async () => {
      await fetchPoint();
      await fetchGrowth();
      await fetchItemUsage(); // 꼭 await
      await fetchQuizCount();
      await fetchGameCount();
    };
  // ➍ 기존 마운트 때도 reloadAll 호출
  useEffect(() => {
  if (memberno) {
    // 👉 여기를 수정: mount 때 reloadAll()만 호출
    reloadAll();
  }
}, [memberno]);
   // ➎ 게임 횟수 fetch 함수 (하루 3회 제한)
  const fetchGameCount = async () => {
    if (!memberno) return;
    try {
      const res = await axios.get(`http://localhost:9093/api/game/check/count/${memberno}`);
      console.log('게임 카운트 응답:', res.data);
      // res.data 가 { count: number } 형태라면 .count,
      // 혹은 숫자만 내려오면 res.data 그대로
      const cnt = typeof res.data === 'number'
                ? res.data
                : res.data.count;
      setGameCount(cnt);
    } catch (err) {
      console.warn("게임 카운트 불러오기 실패", err);
    }
  };


     // ▶▶ 페이지 진입 시, 오늘 이미 출석했는지 체크
    // useEffect(() => {
    //   if (!memberno) return;
    //   axios
    //     .get(`http://localhost:9093/api/attendance/check/${memberno}`)
    //     .then(res => {
    //       // res.data.attended 가 true/false
    //       setAttendanceChecked(res.data.attended);
    //     })
    //     .catch(err => console.error('초기 출석 체크 에러:', err));
    // }, [memberno]);

    useEffect(() => {
      axios.get(`/api/attendance/check/${memberno}`)
        .then(res => {
          console.log('🟢 출석 여부 응답:', res.data);  // 👈 반드시 확인
          setAttendanceChecked(res.data.attended);
        });
    }, [memberno]);

    







    async function performGrowth(memberno, value, reason) {
      try {
        const res = await axios.post(
          'http://localhost:9093/api/plant/increase-growth',
          { memberno, value, reason }
        );
        const { status, message, added, growth } = res.data;

        if (status === 'limit') {
          alert(message);
        } else {
          // added 만큼 성장했음을 알리고
          setGrowth(growth);
        }
      } catch (err) {
        console.error('성장 요청 오류:', err);
        alert('성장 처리 중 오류가 발생했습니다.');
      }
    }




      // 성장 요청 헬퍼
      async function performGrowth(value, reason) {
        try {
          const res = await axios.post(
            'http://localhost:9093/api/plant/increase-growth',
            { memberno, value, reason }
          );
          const { status, message, added, growth } = res.data;

          if (status === 'limit') {
            alert(message);
          } else {
            alert(`성장 ${added}% 반영되었습니다! (전체 ${growth}%)`);
            setGrowth(growth);
          }
        } catch (err) {
          console.error('성장 요청 오류:', err);
          alert('성장 처리 중 오류가 발생했습니다.');
        }
      }

      // 물 버튼
      const handleWater = async () => {
        await performGrowth(1, '물');
        await reloadAll();
      };

      // 비료 버튼
      const handleFertilizer = async () => {
        await performGrowth(2, '비료');
        await reloadAll();
      };

      // 영양제 버튼
      const handleNutrient = async () => {
        await performGrowth(1, '영양제');
        await reloadAll();
      };

      // 퀴즈 성공 콜백
      const onQuizSuccess = async () => {
        await performGrowth(1, '퀴즈');
        await reloadAll();
      };

      // 게임 성공 콜백
      const onGameComplete = async (earnedPoint) => {
        if (earnedPoint > 0) {
          await performGrowth(1, '게임');
        }
        await reloadAll();
      };

      return (
  <div className="plant-wrapper">
    <p className="plant-guide-text">
      열매가 될 때까지<br />무럭무럭 잘 키워봐요
    </p>

    <img src={seedImage} alt="씨앗" className="plant-image" />

    <div className="plant-floating-btns">
      <button
        id="guide-btn"
        className="circle-button"
        onClick={() => setShowGuide(true)}
      >
        <img src={guideIcon} alt="이용방법" />
        <span>이용방법</span>
      </button>
      <button id="sticker-btn" className="circle-button">
        <img src={stickerIcon} alt="스티커" />
        <span>스티커</span>
      </button>
    </div>

    <div className="plant-box">
      {mode === 'menu' && (
        <>
          <div className="plant-header">
            <strong>{plantName}</strong>
            <span>{growth}%</span>
          </div>

          <div
            className="growth-bar-wrapper"
            id="growth-bar"  // ⭐ GuideOverlay가 이 id로 엘리먼트를 찾습니다
          >
            <div className="growth-bar">
              <div
                className="growth-bar-fill"
                style={{ width: `${growth}%` }}
              />
            </div>
            </div>

          <div
            className="point-box"
            id="point-bar"  // ⭐ GuideOverlay의 guideSteps 에서 'point-bar'로 설정한 id를 여기에 달아주세요
          >
            <img src={coinIcon} alt="포인트" className="point-icon" />
            <span className="point-label">포인트</span>
            <span className="point-value">{point}P</span>
          </div>

          <div className="plant-actions">
              {/* 영양제 */}
              <button
                id="nutrient-btn"            // ⭐ GuideOverlay의 guideSteps id 'nutrient-btn' 추가
                onClick={() => handleItemPurchase('영양제', 1, 5)}
                disabled={itemUsage.nutrient >= itemLimits.nutrient || growth >= 10}
              >
                
                <img src={nutrientIcon} alt="영양제" /> 영양제 주기
                <RemainingCount used={itemUsage.nutrient} limit={itemLimits.nutrient} />
              </button>

              {/* 물 */}
              <button
                id="water-btn"               // ⭐ GuideOverlay의 guideSteps id 'water-btn' 추가
                onClick={() => handleItemPurchase('물', 1, 5)}
                disabled={itemUsage.water >= itemLimits.water || growth >= 10}
              >
                <img src={waterIcon} alt="물" /> 물 주기
                <RemainingCount used={itemUsage.water} limit={itemLimits.water} />
              </button>

              {/* 비료 */}
              <button
                id="fertilizer-btn"          // ⭐ GuideOverlay의 guideSteps id 'fertilizer-btn' 추가
                onClick={() => handleItemPurchase('비료', 2, 10)}
                disabled={itemUsage.fertilizer >= itemLimits.fertilizer || growth >= 10}
              >   
                <img src={fertilizerIcon} alt="비료" /> 비료 주기
                <RemainingCount used={itemUsage.fertilizer} limit={itemLimits.fertilizer} />
              </button>

 

            {/* 출석체크 */}
            <button
             id="attendance-btn"  
              onClick={handleAttendance}
              disabled={attendanceChecked}
              className={classNames('action-button', { 'disabled': attendanceChecked })}
            >
              <img src={checkIcon} alt="출석" />
              {attendanceChecked ? '출석 완료' : '출석체크'}
            </button>

            {/* 퀴즈 버튼 */}
          <button
            id="quiz-btn"
            onClick={handleQuizClick}  // ✅ 이 함수 내부에서 setMode('quiz') 처리
            disabled={quizCount >= 3}
          >
            <img src={quizIcon} alt="퀴즈" /> 퀴즈
            <RemainingCount used={quizCount} limit={3} />
          </button>

            {/* 게임 */}
            <button
            id="game-btn"
            onClick={() => setMode('game')} // ✅ 내부 전환
            disabled={itemUsage.game >= itemLimits.game}
          >
            <img src={gameIcon} alt="게임" /> 게임
            <RemainingCount used={gameCount} limit={3} />
          </button>
          </div>

          
          {growth >= 10 && (
             <div className="quiz-limit-msg">
              🌱 성장도가 10%에 도달했습니다. 어르신들께서는 더 이상 사용하실 수 없습니다.
            </div>
          )}

          {/* 퀴즈 제한 메시지 */}
          {showQuizLimitMsg && (
            <div className="quiz-limit-msg">
              오늘 푸실 수 있는 퀴즈를 모두 풀었어요!
            </div>
          )}

          {/* 게임 제한 메시지 */}
          {gameCount >= 3 && (
            <div className="quiz-limit-msg">
              오늘 하실 수 있는 게임을 모두 하셨습니다!
            </div>
          )}

          {praiseMessage && (
            <div className="praise-banner">
              <p>{praiseMessage}</p>
              {correctCount && (
                <p>오늘 퀴즈 정답 수: {correctCount} / 3</p>
              )}
            </div>
          )}
        </>
      )}

      {mode === 'quiz' && (
        <QuizPage
          onBack={async () => {
            setMode('menu');
            await reloadAll();
          }}
        />
      )}

      {mode === 'game' && (
        <GameSelect
          onComplete={async (earnedPoint) => {
            if (earnedPoint > 0) {
              await axios.post(
                `http://localhost:9093/api/point/adjust`,
                { memberno, pointChange: earnedPoint }
              );
            }
            await axios.post(
              `http://localhost:9093/api/game/log`,
              { memberno }
            );
            await reloadAll();
            setMode('menu');
          }}
        />
      )}
    </div>

    {/* 안내 가이드 오버레이 */}
    {showGuide && <GuideOverlay onFinish={() => setShowGuide(false)} />}
  </div>
);

}
export default MainPage;