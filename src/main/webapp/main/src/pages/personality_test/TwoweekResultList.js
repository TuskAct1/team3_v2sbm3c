// 📁 TwoweekResultList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TwoweekResultList.css'; // 스타일 파일

function TwoweekResultList() {
  // 🔸 검사 결과 목록 저장
  const [resultList, setResultList] = useState([]);

  // 🔸 로그인한 사용자의 회원 번호 및 이름
  const [memberno, setMemberno] = useState(null);
  const [mname, setMname] = useState('');

  // 🔸 달력 보기 모드 on/off
  const [calendarMode, setCalendarMode] = useState(true);

  // 🔸 다음 검사 예정일 (최근 검사일 + 14일)
  const [nextTestDate, setNextTestDate] = useState(null);

  // ✅ 컴포넌트가 처음 로딩될 때 실행
  useEffect(() => {
    const fetchResults = async () => {
      // localStorage에서 로그인한 사용자 정보 가져오기
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;
      const loginMname = user?.mname;

      if (!loginMemberno) {
        // 로그인 정보 없으면 로그인 페이지로 이동
        alert("로그인이 필요합니다.");
        window.location.href = '/login';
        return;
      }

      setMemberno(loginMemberno); // 회원 번호 저장
      setMname(loginMname);       // 이름 저장  

      try {
        // 🔹 백엔드에서 검사 결과 목록 불러오기
        const res = await axios.get(`http://localhost:9093/twoweek_test/testlist/${loginMemberno}`);
        const data = res.data;
        setResultList(data);

        // 🔹 검사 기록이 있으면 가장 최근 날짜로부터 다음 검사일 계산
        if (data.length > 0) {
          const latest = data.map(r => new Date(r.rdate)).sort((a, b) => b - a)[0];
          const next = new Date(latest);
          next.setDate(next.getDate() + 14);
          setNextTestDate(next);
        }
      } catch (err) {
        console.error('❌ 검사 결과 불러오기 실패', err);
      }
    };

    fetchResults(); // 함수 실행
  }, []);

  // ✅ 검사 결과 삭제 함수
  const handleDelete = async (twoweektestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      await axios.delete(`http://localhost:9093/twoweek_test/delete/${twoweektestno}`);
      // 삭제 후 상태에서 해당 결과 제거
      setResultList(prev => prev.filter(t => t.twoweektestno !== twoweektestno));
    } catch (err) {
      alert('삭제에 실패했어요.');
    }
  };

  // ✅ 달력에 점수 또는 다음 검사일 표시
  const getTileContent = ({ date }) => {
    const result = resultList.find(r => new Date(r.rdate).toDateString() === date.toDateString());
    
    if (result) {
      // 점수에 따라 이모지 표시
      const score = result.score;
      let emoji = score <= 4 ? '🟢' : score <= 9 ? '🟡' : score <= 14 ? '🟠' : '🔴';
      return <div className="calendar-result">{emoji}<br />{score}점</div>;
    }

    // 다음 검사일 표시
    if (nextTestDate && date.toDateString() === nextTestDate.toDateString()) {
      return <div className="calendar-next">📌<br />다음 검사</div>;
    }

    return null;
  };

  return (
    <div className="twoweek-page-bg">
      <div className="twoweek-list-container">
        {/* 🔹 상단 헤더 */}
        <div className="twoweek-header">
          <h2>🧠 {mname}님의 2주 주기 우울증 검사 기록</h2>
          <div>
            <button className="small-btn" onClick={() => setCalendarMode(!calendarMode)}>
              {calendarMode ? '📋 리스트 보기' : '📅 달력 보기'}
            </button>
            <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
              ← 이전
            </button>
          </div>
        </div>

        {/* 🔸 달력 모드 */}
        {calendarMode ? (
          <div className="calendar-container">
            <Calendar
              tileContent={getTileContent}
              locale="en-US"
              prevLabel="← 이전 달"
              nextLabel="다음 달 →"
              showNeighboringMonth={false}
              formatMonthYear={(locale, date) =>
                `${date.getFullYear()}년 ${date.getMonth() + 1}월`
              }
              tileClassName={({ date }) => {
                const result = resultList.find(r => new Date(r.rdate).toDateString() === date.toDateString());
                if (result) {
                  const score = result.score;
                  if (score <= 4) return 'score-verylow';
                  if (score <= 9) return 'score-low';
                  if (score <= 14) return 'score-moderate';
                  return 'score-high';
                }
                if (nextTestDate && date.toDateString() === nextTestDate.toDateString()) {
                  return 'next-test-date';
                }
                return null;
              }}
            />
            <p className="legend">
              🔴 고위험 &nbsp; 🟠 중간 &nbsp; 🟡 경미 &nbsp; 🟢 매우 낮음 &nbsp; 📌 다음 검사 예정일
            </p>
          </div>
        ) : (
          // 🔸 리스트 모드
          <table className="twoweek-list-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>점수</th>
                <th>결과</th>
                <th>검사일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {resultList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">😥 검사 결과가 없습니다.</td>
                </tr>
              ) : (
                resultList.map((test, idx) => {
                  // 점수에 따라 줄 색상 달리 적용
                  let riskClass = test.score <= 4
                    ? 'low-risk' : test.score <= 9
                    ? 'mild-risk' : test.score <= 14
                    ? 'moderate-risk' : 'high-risk';

                  return (
                    <tr key={test.twoweektestno || idx} className={riskClass}>
                      <td>{idx + 1}</td>
                      <td>{test.score}점</td>
                      <td>{test.result}</td>
                      <td>{new Date(test.rdate).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDelete(test.twoweektestno)}>삭제</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TwoweekResultList;
