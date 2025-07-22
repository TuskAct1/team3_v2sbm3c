import React from 'react';
import { useNavigate } from 'react-router-dom';
import './contentsMoaPage.css';

function PersonalityTest() {
  const navigate = useNavigate();
  const testList = [
    {
      title: '반려식물',
      desc: '마음을 닮은 반려식물을 키우며 감정을 함께 성장시켜보세요. ',
      path: '/plant',
      img: '/images/contents_plant.png',
      size: 'large'
    },
    {
      title: '감정분석',
      desc: '대화를 통해 감정 상태를 분석하고 마음의 흐름을 이해합니다.',
      path: '/emotion_report',
      img: '/images/contents_emotion.png',
      size: 'large'
    },
    {
      title: '일기',
      desc: '하루를 기록하며 내면의 감정과 생각을 정리할 수 있어요.',
      path: '/diary',
      img: '/images/contents_diary.png',
      size: 'small'
    },
    {
      title: '플레이리스트',
      desc: '감정에 어울리는 음악을 추천받아 나만의 힐링 사운드를 만들어보세요.',
      path: '/playlist/list',
      img: '/images/contents_playlist.png',
      size: 'small'
    },
    {
      title: '캘린더',
      desc: '일정을 관리하고, 마음 챙김 활동을 꾸준히 이어가도록 도와줍니다.',
      path: '/calendar',
      img: '/images/contents_calendar.png',
      size: 'small'
    }
  ];

  return (
    <div className="contents-container">
      <div className="contents-header">
        <img src="/images/logo-icon_black.png" alt="토닥 로고" className="logo-icon" />
        <p>토닥에서 만날 수 있는<br />다양한 콘텐츠를 소개합니다</p>
      </div>

      <div className="contents-grid">
        <div className="grid-row large-row">
          {testList.filter(test => test.size === 'large').map((test, index) => (
            <div key={index} className="contents-card large" onClick={() => navigate(test.path)}>
              <div className="card-left top-left">
                <h2>{test.title}</h2>
                <p>{test.desc}</p>
                <span className="go-link">바로가기 &gt;</span>
              </div>
              <div className="card-right bottom-right">
                <img src={test.img} alt={`${test.title} 이미지`} className="card-img" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid-row small-row">
          {testList.filter(test => test.size === 'small').map((test, index) => (
            <div key={index} className="contents-card small" onClick={() => navigate(test.path)}>
              <div className="card-left top-left">
                <h2>{test.title}</h2>
                <p>{test.desc}</p>
                <span className="go-link">바로가기 &gt;</span>
              </div>
              <div className="card-right bottom-right">
                <img src={test.img} alt={`${test.title} 이미지`} className="card-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonalityTest;
