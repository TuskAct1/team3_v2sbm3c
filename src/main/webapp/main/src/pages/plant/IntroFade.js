import React, { useEffect, useState } from 'react';
import { usePlantContext } from './PlantContext';
// import '../styles/plant/IntroFade.css';
import '../../styles/plant/IntroFade.css';

const IntroFade = () => {
  const { setHasPlant } = usePlantContext();
  const [fadeDone, setFadeDone] = useState(false);

  useEffect(() => {
    // 애니메이션 후 다음 단계로 넘김 (예: 2초 후)
    const timer = setTimeout(() => {
      setFadeDone(true);
      setHasPlant(true);
    }, 2000); // 2초 후 상태 변경

    return () => clearTimeout(timer);
  }, [setHasPlant]);

  return (
    <div className="intro-fade">
      <h1 style={{ color: 'white', textAlign: 'center' }}>당신의 반려식물을 시작합니다...</h1>
    </div>
  );
};

export default IntroFade;
