// // import React, { useEffect, useState } from 'react';
// // import IntroScreen from './IntroScreen';
// // import LoadingScreen from './LoadingScreen';
// // import SeedSelect from './SeedSelect';
// // import SeedNamePage from './SeedNamePage';
// // import MainPage from './MainPage';
// // import GuideOverlay from './GuideOverlay';
// // import { PointProvider } from './PointContext';

// // function PlantPage() {
// //   const [step, setStep] = useState(0);
// //   const [showGuide, setShowGuide] = useState(false);
// //   const [hasSeenGuide, setHasSeenGuide] = useState(false);

// //   useEffect(() => {
// //     const memberno = localStorage.getItem('memberno');
// //     const seen = localStorage.getItem(`hasSeenPlantFeature_${memberno}`);
// //     const selectedSeed = localStorage.getItem(`selectedSeed_${memberno}`);
// //     const plantName = localStorage.getItem(`plantName_${memberno}`);

// //     if (!seen || !selectedSeed || !plantName || plantName.trim() === '') {
// //       setStep(1); // 인트로부터 시작
// //     } else {
// //       setStep(5); // 바로 메인 페이지
// //       setHasSeenGuide(true);
// //     }
// //   }, []);

// //   const handleIntroDone = () => {
// //     setStep(2);
// //     setTimeout(() => setStep(3), 3000);
// //   };

// //   const handleSeedSelected = () => {
// //     setStep(4);
// //   };

// //   const handleNameCompleted = async () => {
// //     const memberno = localStorage.getItem('memberno');

// //     try {
// //       await fetch(`http://localhost:9093/api/point/init/${memberno}`, {
// //         method: 'POST',
// //       });
// //       console.log('✅ 포인트 초기화 완료');
// //     } catch (err) {
// //       console.error('❌ 포인트 초기화 실패', err);
// //     }

// //     // ✅ 포인트 생성이 완료된 후에 step: 5로 넘어가게 수정
// //     setStep(5);

// //     setTimeout(() => {
// //       if (!localStorage.getItem('hasSeenPlantFeature')) {
// //         setShowGuide(true);
// //       }
// //     }, 3000);
// //   };

// //   const handleGuideEnd = () => {
// //     setShowGuide(false);
// //     localStorage.setItem('hasSeenPlantFeature', 'true');
// //   };

// //   return (
// //     <div>
// //       {step === 1 && <IntroScreen onNext={handleIntroDone} />}
// //       {step === 2 && <LoadingScreen />}
// //       {step === 3 && <SeedSelect onComplete={handleSeedSelected} />}
// //       {step === 4 && <SeedNamePage onComplete={handleNameCompleted} />}
// //       {step === 5 && (
// //       <>
// //         <PointProvider memberno={localStorage.getItem('memberno')}>
// //           <MainPage />
// //         </PointProvider>
// //         {!hasSeenGuide && showGuide && <GuideOverlay onFinish={handleGuideEnd} />}
// //       </>
// //     )}
// //     </div>
// //   );
// // }

// // export default PlantPage; // ✅ 반드시 이 줄 있어야 함
// import React, { useEffect, useState } from 'react';
// import IntroScreen from './IntroScreen';
// import LoadingScreen from './LoadingScreen';
// import SeedSelect from './SeedSelect';
// import SeedNamePage from './SeedNamePage';
// import MainPage from './MainPage';
// import GuideOverlay from './GuideOverlay';
// import { PointProvider } from './PointContext';

// function PlantPage() {
//   const [step, setStep] = useState(0);
//   const [showGuide, setShowGuide] = useState(false);
//   const [hasSeenGuide, setHasSeenGuide] = useState(false);

//   useEffect(() => {
//     const memberno = localStorage.getItem('memberno');
//     const seen = localStorage.getItem(`hasSeenPlantFeature_${memberno}`);
//     const selectedSeed = localStorage.getItem(`selectedSeed_${memberno}`);
//     const plantName = localStorage.getItem(`plantName_${memberno}`);

//     if (!seen || !selectedSeed || !plantName || plantName.trim() === '') {
//       setStep(1); // 인트로부터 시작
//     } else {
//       setStep(5); // 메인페이지로 바로
//       setHasSeenGuide(true);
//     }
//   }, []);

//   const handleIntroDone = () => {
//     setStep(2);
//     setTimeout(() => setStep(3), 3000);
//   };

//   const handleSeedSelected = () => {
//     setStep(4);
//   };

//   const handleNameCompleted = () => {
//     setStep(5);
//     setTimeout(() => {
//       const memberno = localStorage.getItem('memberno');
//       if (!localStorage.getItem(`hasSeenPlantFeature_${memberno}`)) {
//         setShowGuide(true);
//       }
//     }, 3000);
//   };

//   const handleGuideEnd = () => {
//     const memberno = localStorage.getItem('memberno');
//     setShowGuide(false);
//     localStorage.setItem(`hasSeenPlantFeature_${memberno}`, 'true');
//   };
  
//   useEffect(() => {
//   const checkPlantExistence = async () => {
//     const memberno = localStorage.getItem('memberno');

//     try {
//       const res = await fetch(`http://localhost:9093/api/plant/exists/${memberno}`);
//       const hasPlant = await res.json();

//       if (hasPlant) {
//         setStep(5); // 이미 식물이 있으면 Main으로
//         setHasSeenGuide(true);
//       } else {
//         setStep(1); // 식물이 없으면 인트로부터 시작
//       }
//     } catch (err) {
//       console.error("식물 존재 여부 확인 실패", err);
//     }
//   };

//   checkPlantExistence();
// }, []);


//   return (
//     <div>
//       {step === 1 && <IntroScreen onNext={handleIntroDone} />}
//       {step === 2 && <LoadingScreen />}
//       {step === 3 && <SeedSelect onComplete={handleSeedSelected} />}
//       {step === 4 && <SeedNamePage onComplete={handleNameCompleted} />}
//       {step === 5 && (
//         <>
//           <PointProvider memberno={localStorage.getItem('memberno')}>
//             <MainPage />
//           </PointProvider>
//           {!hasSeenGuide && showGuide && <GuideOverlay onFinish={handleGuideEnd} />}
//         </>
//       )}
//     </div>
//   );
// }

// export default PlantPage;

// src/components/PlantPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import SeedSelect from './SeedSelect';
import SeedNamePage from './SeedNamePage';
import MainPage from './MainPage';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext';

const PlantPage = () => {
  const memberno = localStorage.getItem('memberno');
  const [step, setStep] = useState('checking'); 
  // 'checking' → 'intro' → 'loading' → 'select' → 'name' → 'main'
  const [showGuide, setShowGuide] = useState(false);

  // ✔️ 1) 마운트 시 식물 존재 여부만 체크
  useEffect(() => {
  axios.get(`/api/plant/exists/${memberno}`)
    .then(res => {
      console.log('🌱 exists 호출 응답:', res.data);
      // ★ res.data = { exists: true } 이므로 .exists 프로퍼티를 사용
      const hasPlant = res.data.exists === true;
      console.log('🌱 hasPlant 판단:', hasPlant);
      setStep(hasPlant ? 'main' : 'intro');
      // Guide 노출 여부도 이 시점에 한번 결정해도 좋습니다.
      if (hasPlant) {
        setShowGuide(!localStorage.getItem(`hasSeenPlantFeature_${memberno}`));
      }
    })
    .catch(err => {
      console.error('🌱 exists 호출 에러:', err);
      setStep('intro');
    });
}, [memberno]);

  // ✔️ 2) 인트로 완료하면 로딩 → 씨앗 선택
  const handleIntroDone = () => setStep('loading');
  useEffect(() => {
    if (step === 'loading') {
      const t = setTimeout(() => setStep('select'), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // ✔️ 3) 씨앗 선택 완료
  const handleSeedComplete = seed => {
    localStorage.setItem(`selectedSeed_${memberno}`, seed);
    setStep('name');
  };

  // ✔️ 4) 이름 부여 완료 → 생성 + 초기 포인트 → 메인
  // PlantPage.js (handleNameComplete 부분)
    const handleNameComplete = async (plantName) => {
      const memberno = localStorage.getItem('memberno');
      const seed     = localStorage.getItem(`selectedSeed_${memberno}`);
      try {
        const payload = {
          memberno,
          plant_name:      plantName,
          plant_type:      seed,
          growth:          0,
          points:          0,
          intro_completed: 'Y',
        };

        // 1) 식물 생성
        const createRes = await axios.post('/api/plant/create', payload);
        console.log('🍀 createRes.status ➡', createRes.status);
        console.log('🍀 createRes.data   ➡', createRes.data);

        // 만약 createRes.data 가 1이 아니라면, 이제 정확히 무엇이 왔는지 보고 분기 수정
        if (!createRes.data.created) {
          // 예) 만약 { result: 1 } 이라면 createRes.data.result === 1 으로 체크
          throw new Error(`create failed: unexpected payload`);
        }

        // 2) 포인트 초기화
        const initRes = await axios.post(`/api/point/init/${memberno}`);
        console.log('✅ initRes.data ➡', initRes.data);

        // 3) 메인 진입
        setStep('main');
        setShowGuide(!localStorage.getItem(`hasSeenPlantFeature_${memberno}`));
      }
      catch (err) {
        console.error('❌ 생성 에러:', err);
        alert('식물 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
      }
    };

  // ✔️ 5) 가이드 종료
  const handleGuideEnd = () => {
    localStorage.setItem(`hasSeenPlantFeature_${memberno}`, 'true');
    setShowGuide(false);
  };

  // --- 렌더링 분기 ---
  if (step === 'checking') return <LoadingScreen />;

  return (
    <>
      {step === 'intro'   && <IntroScreen    onNext={handleIntroDone} />}
      {step === 'select'  && <SeedSelect     onComplete={handleSeedComplete} />}
      {step === 'name'    && <SeedNamePage   onComplete={handleNameComplete} />}
      {step === 'loading' && <LoadingScreen  />}
      {step === 'main'    && (
        <PointProvider memberno={memberno}>
          <MainPage />
          {showGuide && <GuideOverlay onFinish={handleGuideEnd} />}
        </PointProvider>
      )}
    </>
  );
};

export default PlantPage;
