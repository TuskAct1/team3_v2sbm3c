import React from 'react';
import { usePlantContext } from './PlantContext';

const PlantGuide = () => {
  const { setGuideViewed } = usePlantContext();

  const handleConfirm = () => {
    setGuideViewed(true);
  };

  return (
    <div className="plant-guide" style={{ padding: '40px', lineHeight: '1.8' }}>
      <h2 style={{ textAlign: 'center' }}>🌿 반려식물 키우기 안내</h2>
      <ul style={{ maxWidth: '600px', margin: '20px auto', fontSize: '16px' }}>
        <li>🌸 이쁜 말을 하면 <strong>+1 포인트</strong> (하루 최대 5회)</li>
        <li>🧠 챗봇 상담, 일기 작성, 자가진단 중 2개 이상 이용 시 <strong>기능별 최대 +10 포인트</strong></li>
        <li>🎥 광고 시청 시 <strong>+5 포인트</strong></li>
        <li>🚫 하루 사이트에 접속하지 않으면 <strong>-1 포인트</strong></li>
        <li>🍂 포인트가 부족하거나 오래 접속하지 않으면 <strong>싱싱함이 감소</strong>해요</li>
        <li>🌤 오늘 날씨가 식물 배경에 반영돼요!</li>
      </ul>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={handleConfirm}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#57b6ac',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          확인하고 시작하기
        </button>
      </div>
    </div>
  );
};

export default PlantGuide;
