// 📁 TwoweekResultList.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TwoweekResultList.css';

function TwoweekResultList() {
  const [resultList, setResultList] = useState([]);      // 검사 결과 목록
  const [calendarMode, setCalendarMode] = useState(true); // 초기 달력 보기
  const { memberno } = useParams();                      // URL에서 회원번호 추출
  const [nextTestDate, setNextTestDate] = useState(null); // 다음 검사일

  // 🔸 검사 결과 목록 불러오기 + 다음 검사일 계산
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:9093/twoweek_test/testlist/${memberno}`);
        const data = res.data;
        setResultList(data);

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
    fetchResults();
  }, [memberno]);

  // 🔸 삭제 처리 함수
  const handleDelete = async (twoweektestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;
    try {
      await axios.delete(`http://localhost:9093/twoweek_test/delete/${twoweektestno}`);
      setResultList(prev => prev.filter(t => t.twoweektestno !== twoweektestno));
    } catch (err) {
      alert('삭제에 실패했어요.');
    }
  };

  // 🔸 달력 날짜에 점수 표시 + 다음 검사일 표시
  const getTileContent = ({ date }) => {
    const result = resultList.find(r => new Date(r.rdate).toDateString() === date.toDateString());
    if (result) {
      const score = result.score;
      let emoji = score <= 4 ? '🟢' : score <= 9 ? '🟡' : score <= 14 ? '🟠' : '🔴';
      return <div className="calendar-result">{emoji}<br />{score}점</div>;
    }
    if (nextTestDate && date.toDateString() === nextTestDate.toDateString()) {
      return <div className="calendar-next">📌<br />다음 검사</div>;
    }
    return null;
  };

  return (
    <div className="twoweek-page-bg">
      <div className="twoweek-list-container">
        <div className="twoweek-header">
          <h2>🧠 {memberno}번 회원님의 2주 주기 우울증 검사 기록</h2>
          <div>
            <button className="small-btn" onClick={() => setCalendarMode(!calendarMode)}>
              {calendarMode ? '📋 리스트 보기' : '📅 달력 보기'}
            </button>
            <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
              ← 이전
            </button>
          </div>
        </div>

        {calendarMode ? (
          <div className="calendar-container">
            <Calendar
              tileContent={getTileContent}
              locale="ko-KR"
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
                <tr><td colSpan="5" className="empty-row">😥 검사 결과가 없습니다.</td></tr>
              ) : (
                resultList.map((test, idx) => {
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
                      <td><button onClick={() => handleDelete(test.twoweektestno)}>삭제</button></td>
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
