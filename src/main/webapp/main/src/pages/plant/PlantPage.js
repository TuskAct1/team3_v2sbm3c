// // ✅ PlantPage.js 전체 수정 코드
// import React, { useEffect, useState } from 'react';
// import IntroScreen from './IntroScreen';
// import LoadingScreen from './LoadingScreen';
// import SeedSelect from './SeedSelect';
// import MainPage from './MainPage';
// import GuideOverlay from './GuideOverlay';

// function PlantPage() {
//   const [step, setStep] = useState(0); // 0: 초기, 1: Intro, 2: Loading, 3: Seed, 4: Main
//   const [showGuide, setShowGuide] = useState(false);
//   const [hasSeenGuide, setHasSeenGuide] = useState(false);

//   useEffect(() => {
//     const seen = localStorage.getItem('hasSeenPlantFeature');
//     const selectedSeed = localStorage.getItem('selectedSeed');

//     // ✅ 반려식물 기능을 처음 사용하는 경우에는 Intro부터 시작
//     if (!seen || !selectedSeed) {
//       setStep(1); // Intro 시작
//     } else {
//       setStep(4); // Main 바로 진입
//       setHasSeenGuide(true); // 안내 스킵
//     }
//   }, []);

//   // ✅ Intro → Loading 전환
//   const handleIntroDone = () => {
//     setStep(2);
//     setTimeout(() => {
//       setStep(3); // 씨앗 선택 화면
//     }, 3000); // 3초 로딩
//   };

//   // ✅ 씨앗 선택 완료 후 Main 진입
//   const handleSeedSelected = () => {
//     setStep(4);
//     setTimeout(() => {
//       if (!localStorage.getItem('hasSeenPlantFeature')) {
//         setShowGuide(true); // 안내 시작
//       }
//     }, 3000); // Main이 잠깐 보인 뒤 안내
//   };

//   // ✅ 안내 종료 후 localStorage 설정
//   const handleGuideEnd = () => {
//     setShowGuide(false);
//     localStorage.setItem('hasSeenPlantFeature', 'true');
//   };

//   return (
//     <div>
//       {step === 1 && <IntroScreen onNext={handleIntroDone} />}
//       {step === 2 && <LoadingScreen />}
//       {step === 3 && <SeedSelect onComplete={handleSeedSelected} />}
//       {step === 4 && (
//         <>
//           <MainPage />
//           {!hasSeenGuide && showGuide && <GuideOverlay onFinish={handleGuideEnd} />}
//         </>
//       )}
//     </div>
//   );
// }

// export default PlantPage;
// src/pages/plant/PointContext.js

// PointContext.js
// ✅ 예시 (PlantPage.js)
import React, { useEffect, useState } from 'react';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import SeedSelect from './SeedSelect';
import SeedNamePage from './SeedNamePage';
import MainPage from './MainPage';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext';

function PlantPage() {
  const [step, setStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenPlantFeature');
    const selectedSeed = localStorage.getItem('selectedSeed');
    const plantName = localStorage.getItem('plantName');

    if (!seen || !selectedSeed || !plantName || plantName.trim() === '') {
      setStep(1);
    } else {
      setStep(5);
      setHasSeenGuide(true);
    }
  }, []);

  const handleIntroDone = () => {
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  const handleSeedSelected = () => {
    setStep(4);
  };

  const handleNameCompleted = () => {
    setStep(5);
    setTimeout(() => {
      if (!localStorage.getItem('hasSeenPlantFeature')) {
        setShowGuide(true);
      }
    }, 3000);
  };

  const handleGuideEnd = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenPlantFeature', 'true');
  };

  return (
    <div>
      {step === 1 && <IntroScreen onNext={handleIntroDone} />}
      {step === 2 && <LoadingScreen />}
      {step === 3 && <SeedSelect onComplete={handleSeedSelected} />}
      {step === 4 && <SeedNamePage onComplete={handleNameCompleted} />}
      {step === 5 && (
      <>
        <PointProvider memberno={localStorage.getItem('memberno')}>
          <MainPage />
        </PointProvider>
        {!hasSeenGuide && showGuide && <GuideOverlay onFinish={handleGuideEnd} />}
      </>
    )}
    </div>
  );
}

export default PlantPage; // ✅ 반드시 이 줄 있어야 함
