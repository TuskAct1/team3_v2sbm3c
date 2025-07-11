import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalityTest.css';

function PersonalityTest() {
  const navigate = useNavigate();
  const [lastDate, setLastDate] = useState(null);
  const [nextDate, setNextDate] = useState(null);
  const user = localStorage.getItem("user");

  // ✅ 로그인 안 돼 있으면 로그인 페이지로 이동
  const checkLoginAndGo = (path) => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('로그인 후 이용해주세요!');
      localStorage.setItem("redirectAfterLogin", path);
      window.location.href = '/login';
      return;
    }
    navigate(path);
  };

  // ✅ 최근 검사일 / 다음 권장일 불러오기 (2주 주기 검사만)
  useEffect(() => {
    const fetchLatestDate = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;
      if (!loginMemberno) return;

      try {
        const res = await fetch(`http://localhost:9093/twoweek_test/latest/${loginMemberno}`);
        const data = await res.json();

        if (data.rdate) {
          const date = new Date(data.rdate);
          const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          setLastDate(formatted);

          const next = new Date(date);
          next.setDate(next.getDate() + 14);
          const nextFormatted = `${next.getFullYear()}년 ${next.getMonth() + 1}월 ${next.getDate()}일`;
          setNextDate(nextFormatted);
        }
      } catch (err) {
        console.error('❌ 검사일 조회 실패', err);
      }
    };

    fetchLatestDate();
  }, []);

  // ✅ 테스트 리스트
  const testList = [
    {
      title: '🗓️ 2주 주기 우울증 자가진단',
      desc: '최근 2주간의 기분 상태를 체크할 수 있어요. 2주마다 해보시는 것을 권장드립니다.',
      path: '/twoweek_test',
      recordPath: '/twoweek_test/testlist',
      showDate: true,
      img: '/images/test-depression.png'
    },
    {
      title: '🧓 노인 우울증 자가진단',
      desc: '총 15문항으로 간단하게 우울증 여부를 확인할 수 있어요.',
      path: '/senior_test',
      recordPath: '/senior_test/testlist',
      img: '/images/test-senior.png'
    },
    {
      title: '🛋️ 생활 루틴 맞춤 추천',
      desc: '당신의 생활 스타일을 바탕으로 GPT가 나만의 루틴을 제안해줘요!',
      path: '/lifestyle_test',
      recordPath: '/lifestyle_test/list',
      img: '/images/test-lifestyle.png'
    },
    {
      title: '🧠 기억력 자가진단 테스트',
      desc: '최근 기억력 상태를 점검해보세요! 치매 예방에 도움이 됩니다.',
      path: '/memory_test',
      img: '/images/test-memory.png'
    },
    {
      title: '🧩 MBTI 성격유형 테스트',
      desc: '간단한 질문으로 나의 성격유형을 알아보아요!',
      path: '/mbti',
      img: '/images/test-mbti.png'
    },
    {
      title: '🎯 나에게 어울리는 취미 찾기',
      desc: '간단한 문답으로 나와 잘 맞는 취미를 추천받아보세요!',
      path: '/hobby_test',
      img: '/images/test-hobby.png'
    },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">심리테스트 센터</h1>
      <p className="home-description">원하시는 심리테스트를 선택해보세요.</p>

      <div className="test-card-wrapper">
        {testList.map((test, index) => (
          <div key={index} className="card-container">
            {/* ✅ 카드 본체 (전체 클릭 가능) */}
            <div className="card-block" onClick={() => checkLoginAndGo(test.path)}>
              <div className="test-card">
                <h2>{test.title}</h2>
                <p>{test.desc}</p>
              </div>
              <div
                className="card-image"
                style={{ backgroundImage: `url(${test.img})` }}
              >
                <div className="card-overlay">검사하기</div>
              </div>
            </div>

            {/* ✅ 검사 기록 정보 (카드 아래) */}
            {test.recordPath && (
              <div className="test-record-text">
                <span
                  className="record-link"
                  onClick={() => checkLoginAndGo(test.recordPath)}
                >
                  📋 이전 검사 기록 보기
                </span>

                {test.showDate && user && (
                  lastDate ? (
                    <div className="recent-date">
                      📅 최근 검사일: <strong>{lastDate}</strong> <br />
                      📆 다음 검사 권장일: <strong>{nextDate}</strong>
                    </div>
                  ) : (
                    <div className="recent-date">
                      🟡 아직 검사 기록이 없습니다. 지금 바로 검사를 시작해보세요!
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalityTest;
