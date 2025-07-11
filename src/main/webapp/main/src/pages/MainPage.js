import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

function MainPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [notices, setNotices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const noticeRef = useRef(null);

  // ✅ 페이지 진입 시 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ 소셜 로그인 정보 저장
  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const provider = searchParams.get("provider");
    const memberno = searchParams.get("memberno");
    const adminno = searchParams.get("adminno");

    if (email && memberno) {
      const user = {
        email,
        mname: name || "소셜사용자",
        provider: provider || "social",
      };
      if (adminno) user.adminno = parseInt(adminno, 10);
      else user.memberno = parseInt(memberno, 10);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.replace("/");
    }
  }, []);

  // ✅ 슬라이드 데이터
  const slides = [
    {
      title: '토닥에 오신 걸 환영합니다 🤗',
      subtitle: `하루하루 쌓인 마음의 짐,\nAI 친구 ‘토닥이’와 함께 가볍게 털어놔보세요.\n언제나 따뜻하게 들어줄게요.`,
      buttonText: '토닥이랑 대화하기',
      route: '/todaki',
    },
    {
      title: '나를 알아가는 심리테스트 📋',
      subtitle: `요즘 나는 어떤 상태일까요?\n간단한 테스트로 나의 감정과 마음을 살펴보세요.\n재미있고 쉬운 문항으로 부담 없이 시작할 수 있어요.`,
      buttonText: '심리테스트 바로가기',
      route: '/personality_test',
    },
    {
      title: '감정 리포트로 마음 돌아보기 📊',
      subtitle: `일기나 대화 기록을 바탕으로\n지난 감정을 한눈에 볼 수 있어요.\n감정의 흐름을 살펴보며 정서적 자립에 가까워져 보세요.`,
      buttonText: '감정분석 리포트 보러가기',
      route: '/emotion_report',
    },
    {
      title: '반려식물과 마음 돌봄의 시간 🌿',
      subtitle: `매일 작은 관심과 정성으로\n당신의 식물도, 마음도 조금씩 자라납니다.\n반려식물과 함께하는 하루가 큰 위로가 될 거예요.`,
      buttonText: '반려식물 키우러 가기',
      route: '/plant',
    },
    {
      title: '음악으로 토닥토닥, 마음을 쉬어요 🎵',
      subtitle: `지친 하루, 마음이 무거운 날엔\n토닥이와 함께 감정에 어울리는 음악을 들어보세요.\n소리로 전하는 위로가 당신을 부드럽게 안아줄 거예요.`,
      buttonText: '감정별 플레이리스트 들으러 가기',
      route: '/playlist/list',
    },
    {
      title: '내 하루를 채우는 캘린더 📅',
      subtitle: `복지 일정부터 병원 방문, 개인 스케줄까지\n필요한 정보를 한눈에 확인하고 기록해보세요.\n토닥 캘린더가 당신의 하루를 정리해드릴게요.`,
      buttonText: '캘린더 바로가기',
      route: '/calendar',
    }
  ];

  // ✅ 슬라이드 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // ✅ 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:9093/notice/search", {
          params: { keyword: "" },
        });
        setNotices(res.data.slice(0, 4));
      } catch (err) {
        console.error("❌ 공지사항 불러오기 실패", err);
      }
    };
    fetchNotices();
  }, []);

  // ✅ 슬라이드 버튼 조작
  const goToNext = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  // ✅ 공지사항 배지 색상
  const getBadgeClass = (category) => {
    if (category === "공지") return "badge badge-default";
    if (category === "이벤트") return "badge badge-event";
    if (category === "시스템 점검") return "badge badge-system";
    return "badge";
  };

  return (
    <div className="main-page">
      {/* 🎯 슬라이드 영역 */}
      <div
        className="main-slide slide-left"
        key={currentSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <h1>{slides[currentSlide].title}</h1>
        <p>
          {slides[currentSlide].subtitle.split('\n').map((line, idx) => (
            <span key={idx}>{line}<br /></span>
          ))}
        </p>
        <button className="main-button" onClick={() => navigate(slides[currentSlide].route)}>
          {slides[currentSlide].buttonText}
        </button>
      </div>

      {/* 🔄 인디케이터 */}
      <div className="main-pagination">
        <button className="arrow" onClick={goToPrev}>❮</button>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => {
              setCurrentSlide(idx);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
          />
        ))}
        <button className="arrow" onClick={goToNext}>❯</button>
      </div>

      {/* 👇 스크롤 버튼 */}
      <div className="scroll-down-wrapper">
        <button
          className="scroll-down-btn"
          onClick={() => noticeRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="scroll down"
          style={{
            width: '48px',
            height: '48px',
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/scroll-down2.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            animation: 'bounceDown 1.8s infinite',
          }}
        />
      </div>

      {/* 📢 공지사항 영역 */}
      <section ref={noticeRef} className="main-notice-section">
        <div className="main-notice-title-row">
          <h2>📢 알려드려요</h2>
          <button className="main-view-all-btn" onClick={() => navigate('/notice/list')}>
            전체보기
          </button>
        </div>

        <div className="main-notice-list">
          {notices.map((notice) => (
            <div
              className="main-notice-card"
              key={notice.noticeno}
              onClick={() => navigate(`/notice/read/${notice.noticeno}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className={getBadgeClass(notice.category)}>{notice.category}</span>
              <strong>{notice.title}</strong>
              <p>{new Date(notice.rdate).toLocaleDateString('ko-KR')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
