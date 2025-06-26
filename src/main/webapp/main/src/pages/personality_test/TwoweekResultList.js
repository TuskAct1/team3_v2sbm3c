// src/components/TwoweekResultList.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 🔸 URL에서 memberno 추출
import axios from 'axios';                    // 🔸 비동기 HTTP 요청용
import './TwoweekResultList.css';            // 🔸 스타일 파일 import

function TwoweekResultList() {
  const [resultList, setResultList] = useState([]); // 🔸 검사 결과 목록 저장
  const { memberno } = useParams();                // 🔸 URL에서 회원번호 추출

  // 🔸 페이지 처음 로딩 시 서버에서 검사 결과 목록 불러오기
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:9093/twoweek_test/testlist/${memberno}`);
        setResultList(res.data);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패", err);
      }
    };

    fetchResults(); // 데이터 불러오기 실행
  }, [memberno]);

  // 🔸 검사 결과 삭제 함수
  const handleDelete = async (twoweektestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      await axios.delete(`http://localhost:9093/twoweek_test/delete/${twoweektestno}`);
      setResultList(prevList => prevList.filter(test => test.twoweektestno !== twoweektestno));
    } catch (err) {
      console.error('❌ 삭제 실패', err);
      alert('삭제에 실패했어요.');
    }
  };

  return (
    <div className="twoweek-page-bg">
      <div className="twoweek-list-container">
        <div className="twoweek-header">
          <h2>🧠 {memberno}번 회원님의 2주 주기 우울증 검사 결과</h2>
          <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
            ← 이전
          </button>
        </div>

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
                <td colSpan="5" className="empty-row">
                  😥 검사 결과가 없습니다.
                </td>
              </tr>
            ) : (
              resultList.map((test, idx) => {
                // 🔸 점수에 따른 위험도 클래스 설정
                let riskClass = '';
                if (test.score <= 4) riskClass = 'low-risk';
                else if (test.score <= 9) riskClass = 'mild-risk';
                else if (test.score <= 14) riskClass = 'moderate-risk';
                else riskClass = 'high-risk';

                return (
                  <tr key={test.twoweektestno || idx} className={riskClass}>
                    <td>{idx + 1}</td>
                    <td>{test.score}점</td>
                    <td>{test.result}</td>
                    <td>{new Date(test.rdate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(test.twoweektestno)}>
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TwoweekResultList;
