// src/components/PersonalityTest.js

import React, { useEffect, useState } from 'react';        // 🔹 React 훅 import (useState, useEffect)
import { useNavigate } from 'react-router-dom';            // 🔹 페이지 이동 훅
import './PersonalityTest.css';                            // 🔹 CSS 파일 import

function PersonalityTest() {
  const navigate = useNavigate();                          // 🔸 페이지 이동을 위한 함수
  const [lastDate, setLastDate] = useState(null);          // 🔸 최근 검사일
  const [nextDate, setNextDate] = useState(null);          // 🔸 다음 검사 권장일

  // 🔹 컴포넌트 마운트 시 가장 최근 검사일 가져오기
  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        // ✅ 1번 회원의 최근 검사일 데이터 요청
        const res = await fetch('http://localhost:9093/twoweek_test/latest/1');
        const data = await res.json();

        if (data.rdate) {
          const date = new Date(data.rdate);  // 🔸 날짜 형식으로 변환
          
          // 🔸 날짜를 '2025년 6월 23일' 형식으로 출력
          const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          setLastDate(formatted);

          // 🔸 검사일 기준 2주 뒤 날짜 계산
          const next = new Date(date);
          next.setDate(next.getDate() + 14);
          const nextFormatted = `${next.getFullYear()}년 ${next.getMonth() + 1}월 ${next.getDate()}일`;
          setNextDate(nextFormatted);
        }
      } catch (err) {
        console.error('❌ 최근 검사일 조회 실패', err);
      }
    };

    fetchLatestDate(); // 🔸 위 비동기 함수 호출
  }, []);

  return (
    <div className="home-container">
      {/* 🔷 상단 제목 영역 */}
      <h1 className="home-title">심리테스트 센터</h1>
      <p className="home-description">원하시는 심리테스트를 선택해보세요.</p>

      {/* 🔷 카드 전체 wrapper */}
      <div className="test-card-wrapper">

        {/* ✅ 2주 우울증 검사 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🗓️ 2주 주기 우울증 자가진단</h2>
            <p>최근 2주간의 기분 상태를 체크할 수 있어요. 2주마다 해보시는 것을 권장드립니다.</p>
            <button onClick={() => navigate('/twoweek_test')}>
              검사 시작
            </button>
          </div>

          {/* 🔹 검사 기록 보기 + 최근 검사일 안내 */}
          <div className="record-link-outside">
            <span
              onClick={() => navigate('/twoweek_test/testlist/1')}
              className="record-link"
            >
              📋 이전 검사 기록 보기
            </span>

            {/* 검사일 있으면 날짜 출력, 없으면 안내 문구 출력 */}
            {lastDate ? (
              <div className="recent-date">
                🗓️ 최근 검사일: <strong>{lastDate}</strong><br />
                📅 다음 검사 권장일: <strong>{nextDate}</strong>
              </div>
            ) : (
              <div className="recent-date">
                🟡 아직 검사 기록이 없습니다.<br />
                지금 바로 검사를 시작해보세요!
              </div>
            )}
          </div>
        </div>

        {/* ✅ 노인 우울증 자가진단 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧓 노인 우울증 자가진단</h2>
            <p>총 15문항으로 간단하게 우울증 여부를 확인할 수 있어요.</p>
            <button onClick={() => navigate('/senior_test')}>
              검사 시작
            </button>
          </div>
          <div className="record-link-outside">
            <span
              onClick={() => navigate('/senior_test/testlist/1')}
              className="record-link"
            >
              📋 이전 검사 기록 보기
            </span>
          </div>
        </div>

        {/* ✅ 생활 루틴 맞춤 테스트 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🛋️ 생활 루틴 맞춤 추천</h2>
            <p>당신의 생활 스타일을 바탕으로 GPT가 나만의 루틴을 제안해줘요!</p>
            <button onClick={() => navigate('/lifestyle_test')}>
              루틴 생성하기
            </button>
          </div>

          {/* 🔹 최근 루틴 보기 링크 추가 */}
          <div className="record-link-outside">
            <span
              onClick={() => navigate('/lifestyle_test/list/1')}
              className="record-link"
            >
              📌 나의 루틴 목록 보기
            </span>
          </div>
        </div>

        {/* ✅ 기억력 자가진단 테스트 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧠 기억력 자가진단 테스트</h2>
            <p>최근 기억력 상태를 점검해보세요! 치매 예방에 도움이 됩니다.</p>
            <button onClick={() => navigate('/memory_test')}>
              검사 시작
            </button>
          </div>
          {/* 기록 보기 없음 */}
        </div>

        {/* ✅ MBTI 성격유형 테스트 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🧩 MBTI 성격유형 테스트</h2>
            <p>간단한 질문으로 나의 성격유형을 알아보아요!</p>
            <button onClick={() => navigate('/mbti')}>
              MBTI 검사하기
            </button>
          </div>
          {/* MBTI는 기록 보기 없음 */}
        </div>

        {/* ✅ 나에게 어울리는 취미 찾기 테스트 카드 */}
        <div className="card-block">
          <div className="test-card">
            <h2>🎯 나에게 어울리는 취미 찾기</h2>
            <p>간단한 문답으로 나와 잘 맞는 취미를 추천받아보세요!</p>
            <button onClick={() => navigate('/hobby_test')}>
              검사 시작
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PersonalityTest;
