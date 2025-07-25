import React, { useEffect, useState } from 'react';
import './GuideOverlay.css';

const guideSteps = [
  {
    id: 'guide-btn', // ✅ 이용방법
    title: '이용방법 안내',
    message: '식물 키우기 기능의 다양한 버튼에 대해 알려드릴게요!',
    align: 'center',
    shape: 'circle', // ✅ 원형 강조
  },
  {
    id: 'sticker-btn', // ✅ 스티커
    title: '스티커 안내',
    message: '스티커를 모으면 실제 보상을 받을 수 있어요!',
    align: 'center',
    shape: 'circle', // ✅ 원형 강조
  },
  {
    id: 'growth-bar', // ✅ 성장도
    title: '성장도 안내',
    message: '식물의 성장 상태는 이 바를 통해 확인할 수 있어요.',
    align: 'center',
  },
  {
    id: 'point-bar', // ✅ 포인트
    title: '포인트 안내',
    message: '포인트는 다양한 행동으로 얻고, 아이템을 구매하는 데 사용할 수 있어요.',
    align: 'center',
  },
  {
    id: 'nutrient-btn', // ✅ 영양제
    title: '영양제 주기 안내',
    message: '영양제를 주면 식물 성장에 도움을 줘요\n하루 1회만 사용 가능해요!',
    align: 'left',
  },
  {
    id: 'water-btn', // ✅ 물
    title: '물 주기 안내',
    message: '하루에 한 번 물을 줄 수 있고\n물을 줄 때마다 5포인트가 차감돼요\n버튼을 눌러 물을 주세요',
    align: 'center',
  },
  {
    id: 'fertilizer-btn', // ✅ 비료
    title: '비료 주기 안내',
    message: '비료는 더 많은 포인트를 소모하지만\n성장 속도를 높일 수 있어요!',
    align: 'right',
  },
  {
    id: 'attendance-btn', // ✅ 출석체크
    title: '출석체크 안내',
    message: '매일 방문 시 출석 포인트가 지급돼요\n하루 한 번 꼭 눌러주세요!',
    align: 'left',
  },
  {
    id: 'quiz-btn', // ✅ 퀴즈
    title: '치매예방 퀴즈 안내',
    message: '퀴즈에 참여하면 재미도 있고 포인트도 쌓여요!',
    align: 'center',
  },
  {
    id: 'game-btn', // ✅ 게임
    title: '미니게임 안내',
    message: '간단한 게임을 통해 포인트를 모을 수 있어요.',
    align: 'right',
  },
];


export default function GuideOverlay({ onFinish }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [maskStyle, setMaskStyle] = useState({});
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const updateRect = () => {
      const targetId = guideSteps[step]?.id;
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect(); // ✅ scrollY 더하지 마세요!
        const updatedRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        setTargetRect(updatedRect);

        setMaskStyle({
          '--mask-x': `${rect.left + rect.width / 2}px`,
          '--mask-y': `${rect.top + rect.height / 2}px`,
        });
      }
    };

    updateRect();

    window.addEventListener('scroll', updateRect);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [step]);



  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') nextStep();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step]);

  const nextStep = () => {
    setFade(false);
    if (step < guideSteps.length - 1) {
      setStep((prev) => prev + 1);
      setTimeout(() => {
        setFade(true);
      }, 200);
    } else {
      onFinish(); // 마지막이면 종료 콜백
    }
  };

  const currentStep = guideSteps[step];

  const getAlignStyle = () => {
    if (!targetRect) return {};
    const { top, left, width } = targetRect;

    const style = {
      position: 'absolute',
      top: `${top - 250}px`, // 상단으로 위치 조정
      opacity: fade ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
      width: '280px',
      textAlign: currentStep.align,
    };

    switch (currentStep.align) {
      case 'left':
        return {
          ...style,
          left: `${left}px`,
          transform: 'translateX(0%)',
        };
      case 'center':
        return {
          ...style,
          left: `${left + width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'right':
        return {
          ...style,
          left: `${left + width}px`,
          transform: 'translateX(-100%)',
        };
      default:
        return style;
    }
  };

  const getHighlightStyle = () => {
    if (!targetRect) return {};
    const { top, left, width, height } = targetRect;
    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const getLineStyle = () => {
    if (!targetRect) return {};
    const { top, left, width, height } = targetRect;
    return {
      position: 'absolute',
      top: `${top - 55}px`,  // 기존보다 위로 이동 (-40 → -60)
      left: `${left + width / 2}px`,
      width: '2px',
      height: '60px',        // 높이도 조정
      backgroundColor: 'white',
      zIndex: 1002,
    };
  };

  const getDotStyle = () => {
    if (!targetRect) return {};
    const { top, left, width } = targetRect;
    return {
      position: 'absolute',
      top: `${top - 5}px`,
      left: `${left + width / 2 - 3}px`,
      width: '8px',
      height: '8px',
      backgroundColor: 'white',
      borderRadius: '50%',
      zIndex: 1002,
    };
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    if (onFinish) onFinish(); // ✅ 실제로 부모의 setShowGuide(false) 호출
  };

    return (
      <div className="guide-overlay">
        {/* ✅ 어두운 배경 + 타겟만 투명하게 뚫는 SVG 마스크 */}
       {targetRect && currentStep && (
        <svg className="mask-svg">
          <defs>
            <mask id="mask">
              {/* 전체 흰색 → 다 보여줌 */}
              <rect width="100%" height="100%" fill="white" />

              {/* 타겟만 검정 → 투명하게 뚫림 */}
              {currentStep.shape === 'circle' ? (
                <circle
                  cx={targetRect.left + targetRect.width / 2}
                  cy={targetRect.top + targetRect.height / 2}
                  r={Math.max(targetRect.width, targetRect.height) / 2 + 10}
                  fill="black"
                />
              ) : (
                <rect
                  x={targetRect.left - 6}
                  y={targetRect.top - 6}
                  width={targetRect.width + 12}
                  height={targetRect.height + 12}
                  rx="12"
                  ry="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#mask)"
          />
        </svg>
      )}
        {/* 안내선 + 점 */}
        {targetRect && <div className="guide-line" style={getLineStyle()} />}
        {targetRect && <div className="guide-dot" style={getDotStyle()} />}

        {/* 메시지 박스 */}
        <div className="guide-message" style={getAlignStyle()}>
          <h3 style={{ textAlign: currentStep.align }}>{currentStep.title}</h3>
          <p>
            {currentStep.message.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </p>
          <button className="next-button" onClick={nextStep}>다음 &gt;</button>
        </div>

        {step < guideSteps.length && (
          <button className="skip-button" onClick={handleSkip}>
            이용 설명 건너뛰기
          </button>
        )}
      </div>
    );
  }