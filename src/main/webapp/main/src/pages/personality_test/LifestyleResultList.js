import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LifestyleResultList.css'; // CSS 별도 관리

function LifestyleResultList() {
  const [routineList, setRoutineList] = useState([]); // 루틴 전체 리스트 저장
  const [openIndex, setOpenIndex] = useState(null);   // 펼쳐진 카드 index 저장
  // 🔸 로그인한 사용자의 회원 번호 및 이름
  const [memberno, setMemberno] = useState(null);
  const [mname, setMname] = useState('');

  // 🔹 컴포넌트 처음 렌더링 시 루틴 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
    // localStorage에서 로그인한 사용자 정보 가져오기
    const user = JSON.parse(localStorage.getItem("user"));
    const loginMemberno = user?.memberno;
    const loginMname = user?.mname;

      if (!loginMemberno) {
        alert("로그인이 필요합니다.");
        window.location.href = '/login';
        return;
      }

      setMemberno(loginMemberno); // 회원 번호 저장
      setMname(loginMname);       // 이름 저장

      try {
        const res = await axios.get(`http://localhost:9093/lifestyle_test/list/${loginMemberno}`);
        setRoutineList(res.data); // 가져온 루틴 저장
      } catch (err) {
        console.error('❌ 루틴 목록 불러오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  // 🔹 카드 열기/닫기
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // 같은 거 클릭 시 닫힘
  };

  // 🔹 삭제 버튼 클릭 시
  const handleDelete = async (routineId) => {
    const confirmDelete = window.confirm('정말 이 루틴을 삭제하시겠어요?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9093/lifestyle_test/delete/${routineId}`);
      setRoutineList(routineList.filter(item => item.lifestyleresultno !== routineId));
      alert('🗑️ 삭제가 완료되었습니다.');
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('삭제 중 문제가 발생했어요.');
    }
  };

  return (
    <div className="routine-list-container">
      <h2 className="routine-title">📋 {mname}님의 루틴 목록</h2>

      {routineList.length === 0 ? (
        <p className="no-data">아직 저장된 루틴이 없습니다.</p>
      ) : (
        <div className="accordion-list">
          {routineList.map((item, index) => (
            <div className="accordion-item" key={index}>
              {/* 🔸 날짜 + 버튼 줄 */}
              <div className="accordion-header">
                <span>🗓️ {item.rdate?.substring(0, 10)}</span>

                <div className="button-group">
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccordion(index);
                    }}
                  >
                    {openIndex === index ? '접기' : '보기'}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.lifestyleresultno);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>

              {/* 🔸 펼쳐졌을 때 루틴 내용 */}
              {openIndex === index && (
                <div className="accordion-content">
                  <ul className="routine-time-list">
                    {item.result?.split('\n').map((line, i, allLines) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;

                      const isLastLine = i === allLines.length - 1;
                      const isTimeFormat = /^\d{1,2}:\d{2}/.test(trimmed);

                      // 🟠 마지막 줄이고 시간이 없으면 → 응원의 말
                      if (isLastLine && !isTimeFormat) {
                        return (
                          <li key={i} className="routine-message">
                            <span className="message-label">응원의 말:</span>
                            <span className="message-content">{trimmed.replaceAll('"', '')}</span>
                          </li>
                        );
                      }

                      // ⛔ 시간이 없는 줄이면서 마지막 줄도 아니면 생략
                      if (!isTimeFormat) return null;

                      // ✅ 일반 루틴 줄
                      const [timePart, ...descParts] = trimmed.split(/ (.+)/);
                      return (
                        <li key={i} className="routine-line">
                          <span className="routine-time">🕒 {timePart}</span>
                          <span className="routine-desc">{descParts.join('')}</span>
                        </li>
                      );
                    })}

                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LifestyleResultList;
