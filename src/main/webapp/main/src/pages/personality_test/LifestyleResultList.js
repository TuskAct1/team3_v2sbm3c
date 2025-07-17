import React, { useEffect, useState } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import axios from 'axios';
import './LifestyleResultList.css';

function LifestyleResultList() {
  const [routineList, setRoutineList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [memberno, setMemberno] = useState(null);
  const [mname, setMname] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;
      const loginMname = user?.mname;

      if (!loginMemberno) {
        alert("로그인이 필요합니다.");
        window.location.href = '/login';
        return;
      }

      setMemberno(loginMemberno);
      setMname(loginMname);

      try {
        const res = await axios.get(`http://localhost:9093/lifestyle_test/list/${loginMemberno}`);
        const sorted = res.data.sort((a, b) => new Date(b.rdate) - new Date(a.rdate));
        setRoutineList(sorted);
      } catch (err) {
        console.error('❌ 루틴 목록 불러오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < routineList.length - 1 ? prev + 1 : prev));
  };

  const handleDelete = async (routineId) => {
    const confirmDelete = window.confirm('정말 이 루틴을 삭제하시겠어요?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9093/lifestyle_test/delete/${routineId}`);
      const updatedList = routineList.filter(item => item.lifestyleresultno !== routineId);
      setRoutineList(updatedList);
      setCurrentIndex(0);
      alert('🗑️ 삭제가 완료되었습니다.');
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('삭제 중 문제가 발생했어요.');
    }
  };

  const currentItem = routineList[currentIndex];

  return (
    <div className="routine-slide-container">
      <div className="routine-title-bar">
        <h2 className="routine-title-text">📋 {mname}님의 루틴 결과</h2>
        <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
          이전
        </button>
      </div>

      {routineList.length === 0 ? (
        <p className="no-data">아직 저장된 루틴이 없습니다.</p>
      ) : (
        <>
          <div className="routine-top-bar">
            <button className="slide-arrow small" onClick={handlePrev} disabled={currentIndex === 0}>
              <MdArrowBack size={30} />
            </button>

            <span className="routine-date">🗓️ {currentItem.rdate?.substring(0, 10)}</span>

            <button className="slide-arrow small" onClick={handleNext} disabled={currentIndex === routineList.length - 1}>
              <MdArrowForward size={30} />
            </button>
          </div>

          <div className="routine-slide-wrapper">
            <div className="routine-slide-card">
              <ul className="routine-time-list">
                {currentItem.result?.split('\n').map((line, i, allLines) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  const isLastLine = i === allLines.length - 1;
                  const isTimeFormat = /^\d{1,2}:\d{2}/.test(trimmed);

                  if (isLastLine && !isTimeFormat) {
                    return (
                      <li key={i} className="routine-message">
                        <span className="message-label">응원의 말:</span>
                        <span className="message-content">{trimmed.replaceAll('"', '')}</span>
                      </li>
                    );
                  }

                  if (!isTimeFormat) return null;

                  const [timePart, ...descParts] = trimmed.split(/ (.+)/);
                  return (
                    <li key={i} className="routine-line">
                      <span className="routine-time">🕒 {timePart}</span>
                      <span className="routine-desc">{descParts.join('')}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="delete-btn-wrap">
                <button className="delete-btn-bottom" onClick={() => handleDelete(currentItem.lifestyleresultno)}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LifestyleResultList;
