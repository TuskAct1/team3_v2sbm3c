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
    title: '조용히 마음을 털어놓고 싶을 때',
    subtitle: `말로 표현하기 어려운 감정이 쌓일 때,\nAI 친구 ‘토닥이’가 조용히 당신의 이야기를 들어드립니다.\n부담 없이, 편안하게 이야기 나눠보세요.`,
    buttonText: '토닥이와 대화하기',
    route: '/todaki',
  },
  {
    title: '지금 내 마음은 어떤 모습일까요?',
    subtitle: `간단한 질문을 통해\n현재의 감정과 마음 상태를 살펴볼 수 있습니다.\n천천히, 나를 돌아보는 시간을 가져보세요.`,
    buttonText: '자가진단 하러가기',
    route: '/personality_test',
  },
  {
    title: '내 감정의 흐름을 살펴보는 시간',
    subtitle: `일기나 대화 기록을 바탕으로\n지난 감정들을 차분히 돌아볼 수 있습니다.\n마음을 이해하고 정리하는 데 도움이 될 거예요.`,
    buttonText: '감정 리포트 보러가기',
    route: '/emotion_report',
  },
  {
    title: '반려식물과 함께하는 작은 돌봄',
    subtitle: `매일 식물을 돌보며\n내 마음도 함께 다듬어지는 시간을 느껴보세요.\n작은 정성이 쌓이면 큰 위로가 됩니다.`,
    buttonText: '반려식물 키우기',
    route: '/plant',
  },
  {
    title: '감정에 어울리는 음악으로 쉬어가기',
    subtitle: `지치고 마음이 복잡한 날,\n당신의 감정에 어울리는 음악을 들어보세요.\n조용한 위로가 소리로 전해질 거예요.`,
    buttonText: '음악 들으러 가기',
    route: '/playlist/list',
  },
  {
    title: '하루를 정리하는 작은 습관',
    subtitle: `복지 일정, 병원 예약, 개인 일정까지\n꼭 필요한 정보들을 한눈에 확인하고 기록해보세요.\n토닥 캘린더가 하루를 차분하게 정리해드립니다.`,
    buttonText: '캘린더 보러가기',
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
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const isAdmin = user?.adminno !== undefined;

        const res = await axios.get("http://localhost:9093/notice/search", {
          params: { keyword: "" },
        });

        const allNotices = res.data;

        // ✅ status 필터링: 관리자면 전체, 아니면 공개만
        const filtered = isAdmin
          ? allNotices
          : allNotices.filter((notice) => notice.status === "공개");

        // ✅ 상위 4개만 저장
        setNotices(filtered.slice(0, 4));
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
    if (category === "점검") return "badge badge-system";
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
        <div className="pagination-inner">
          <button className="arrow" onClick={goToPrev}>‹</button>
          <div className="dots">
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
          </div>
          <button className="arrow" onClick={goToNext}>›</button>
        </div>
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
