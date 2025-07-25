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
import React, { useEffect, useState } from 'react';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import SeedSelect from './SeedSelect';
import SeedNamePage from './SeedNamePage';
import MainPage from './MainPage';
import GuideOverlay from './GuideOverlay';
import { PointProvider } from './PointContext';
import axios from 'axios';

function PlantPage() {
  const [step, setStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const memberno = localStorage.getItem('memberno');

    const checkPlant = async () => {
      try {
        const res = await axios.get(`/api/plant/exists/${memberno}`);
        const hasPlant = res.data;

        if (hasPlant) {
          setStep(5); // 식물이 있으면 메인 페이지로
          setHasSeenGuide(true);
        } else {
          setStep(1); // 식물이 없으면 인트로부터
        }
      } catch (err) {
        console.error('식물 존재 여부 확인 실패', err);
      }
    };

    checkPlant();
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
    const memberno = localStorage.getItem('memberno');
    setTimeout(() => {
      if (!localStorage.getItem(`hasSeenPlantFeature_${memberno}`)) {
        setShowGuide(true);
      }
    }, 3000);
  };

  const handleGuideEnd = () => {
    const memberno = localStorage.getItem('memberno');
    setShowGuide(false);
    localStorage.setItem(`hasSeenPlantFeature_${memberno}`, 'true');
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

export default PlantPage;
