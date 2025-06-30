// src/components/PersonalityTest.js

import React, { useEffect, useState } from 'react';        // 🔹 React 훅 import
import { useNavigate } from 'react-router-dom';            // 🔹 페이지 이동 함수
import './PersonalityTest.css';                            // 🔹 외부 스타일 파일 import

function PersonalityTest() {
  const navigate = useNavigate();                          // 🔸 페이지 이동 함수 생성
  const [lastDate, setLastDate] = useState(null);          // 🔸 최근 검사일 상태
  const [nextDate, setNextDate] = useState(null);          // 🔸 다음 검사 권장일 상태

  // ✅ 현재 로그인한 사용자 정보 가져오기
  const user = localStorage.getItem("user");

  // ✅ 공통 검사 접근 전 로그인 체크 함수
  const checkLoginAndGo = (path) => {
    const user = localStorage.getItem('user'); // 로그인 여부 확인
    if (!user) {
      alert('로그인 후 이용해주세요!');
      localStorage.setItem("redirectAfterLogin", path); // 👈 로그인 후 이동할 페이지 기억해두기
      window.location.href = '/login';                  // 로그인 페이지로 이동
      return;
    }
    navigate(path); // 로그인 되어있으면 바로 이동
  };

  // 🔹 최근 검사일 불러오기
  useEffect(() => {
    const fetchLatestDate = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;

      if (!loginMemberno) return; // 로그인 안 돼 있으면 리턴

      try {
        const res = await fetch(`http://localhost:9093/twoweek_test/latest/${loginMemberno}`);
        const data = await res.json();

        if (data.rdate) {
          const date = new Date(data.rdate);  // 날짜 객체로 변환
          const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          setLastDate(formatted);             // 최근 검사일 상태 저장

          // 🔸 2주 뒤 날짜 계산
          const next = new Date(date);
          next.setDate(next.getDate() + 14);
          const nextFormatted = `${next.getFullYear()}년 ${next.getMonth() + 1}월 ${next.getDate()}일`;
          setNextDate(nextFormatted);         // 권장 검사일 저장
        }
      } catch (err) {
        console.error('❌ 최근 검사일 조회 실패', err);
      }
    };

    fetchLatestDate(); // 🔸 최초 실행
  }, []);

  return (
    <div className="home-container">
      {/* 🔷 상단 제목 영역 */}
      <h1 className="home-title">심리테스트 센터</h1>
      <p className="home-description">원하시는 심리테스트를 선택해보세요.</p>

      {/* 🔷 전체 카드 wrapper */}
      <div className="test-card-wrapper">

        {/* ✅ 2주 우울증 검사 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🗓️ 2주 주기 우울증 자가진단</h2>
            <p>최근 2주간의 기분 상태를 체크할 수 있어요. 2주마다 해보시는 것을 권장드립니다.</p>
            <button onClick={() => checkLoginAndGo('/twoweek_test')}>
              검사 시작
            </button>
          </div>

          {/* 🔹 검사 기록 보기 + 최근 검사일 안내 */}
          <div className="record-link-outside">
            <span
              onClick={() => checkLoginAndGo('/twoweek_test/testlist')}
              className="record-link"
            >
              📋 이전 검사 기록 보기
            </span>

            {user && lastDate ? (
              <div className="recent-date">
                🗓️ 최근 검사일: <strong>{lastDate}</strong><br />
                📅 다음 검사 권장일: <strong>{nextDate}</strong>
              </div>
            ) : user ? (
              <div className="recent-date">
                🟡 아직 검사 기록이 없습니다.<br />
                지금 바로 검사를 시작해보세요!
              </div>
            ) : null}
          </div>
        </div>

        {/* ✅ 노인 우울증 검사 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧓 노인 우울증 자가진단</h2>
            <p>총 15문항으로 간단하게 우울증 여부를 확인할 수 있어요.</p>
            <button onClick={() => checkLoginAndGo('/senior_test')}>
              검사 시작
            </button>
          </div>
          <div className="record-link-outside">
            <span
              onClick={() => checkLoginAndGo('/senior_test/testlist')}
              className="record-link"
            >
              📋 이전 검사 기록 보기
            </span>
          </div>
        </div>

        {/* ✅ 생활 루틴 맞춤 테스트 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🛋️ 생활 루틴 맞춤 추천</h2>
            <p>당신의 생활 스타일을 바탕으로 GPT가 나만의 루틴을 제안해줘요!</p>
            <button onClick={() => checkLoginAndGo('/lifestyle_test')}>
              루틴 생성하기
            </button>
          </div>
          <div className="record-link-outside">
            <span
              onClick={() => checkLoginAndGo('/lifestyle_test/list')}
              className="record-link"
            >
              📌 나의 루틴 목록 보기
            </span>
          </div>
        </div>

        {/* ✅ 기억력 자가진단 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧠 기억력 자가진단 테스트</h2>
            <p>최근 기억력 상태를 점검해보세요! 치매 예방에 도움이 됩니다.</p>
            <button onClick={() => checkLoginAndGo('/memory_test')}>
              검사 시작
            </button>
          </div>
        </div>

        {/* ✅ MBTI 검사 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧩 MBTI 성격유형 테스트</h2>
            <p>간단한 질문으로 나의 성격유형을 알아보아요!</p>
            <button onClick={() => checkLoginAndGo('/mbti')}>
              MBTI 검사하기
            </button>
          </div>
        </div>

        {/* ✅ 나에게 어울리는 취미 찾기 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🎯 나에게 어울리는 취미 찾기</h2>
            <p>간단한 문답으로 나와 잘 맞는 취미를 추천받아보세요!</p>
            <button onClick={() => checkLoginAndGo('/hobby_test')}>
              검사 시작
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PersonalityTest;
