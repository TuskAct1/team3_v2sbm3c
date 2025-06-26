// 🔹 필요한 리액트 기능 불러오기
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 :memberno 꺼냄
import axios from 'axios'; // 백엔드 API 요청을 쉽게 해주는 라이브러리. 서버랑 통신
import './SeniorTestList.css'; 

// 🔸 검사 결과 목록을 보여주는 컴포넌트
function SeniorTestList() {
  // 🔹 검사 결과 리스트를 저장하는 state (초기값은 빈 배열)
  const [testList, setTestList] = useState([]);

  // 🔹 URL 경로에 포함된 memberno 값을 가져옴 (예: /testlist/1 → memberno는 1)
  const { memberno } = useParams();

  // 🔹 컴포넌트가 처음 화면에 나타날 때 실행되는 부분 (또는 memberno가 바뀔 때마다)
  useEffect(() => {
    // 🔸 검사 결과를 서버에서 가져오는 함수
    const fetchTests = async () => {
      try {
        // 백엔드 서버에 검사 결과 요청
        const res = await axios.get(`http://localhost:9093/personality_test/testlist/${memberno}`);
        console.log("📦 받아온 데이터:", res.data);
        // 받아온 검사 결과를 state에 저장
        setTestList(res.data);
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패', err);
      }
    };

    fetchTests(); // 검사 결과 불러오기 함수 실행
  }, [memberno]); // memberno가 바뀔 때마다 다시 실행됨

  // 🔹 특정 검사 결과를 삭제하는 함수
  const handleDelete = async (personalitytestno) => {
    // 사용자에게 삭제 확인 받기
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      // 백엔드에 삭제 요청 보내기
      await axios.delete(`http://localhost:9093/personality_test/delete/${personalitytestno}`);

      // 삭제 성공 시, 화면에서도 해당 항목 제거
      setTestList(prevList =>
        prevList.filter(test => test.personalitytestno !== personalitytestno)
      );
    } catch (err) {
      console.error('❌ 삭제 실패', err);
      alert('삭제에 실패했어요.');
    }
  };

  // 🔸 실제로 화면에 보여지는 부분 (JSX)
  return (
    <div className="testlist-page-bg"> {/* ✅ 전체 초록 배경 */}
      <div className="testlist-container"> {/* ✅ 흰 박스 */}
        {/* ✅ 상단 헤더: 제목 + 돌아가기 버튼 */}
        <div className="testlist-header">
          <h2>🧠 {memberno}번 회원님의 검사 기록</h2>
          <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
            ← 이전
          </button>
        </div>

        <table className="testlist-table">
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
            {testList.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  😥 아직 검사 결과가 없습니다.
                </td>
              </tr>
            ) : (
              testList.map((test, idx) => {
                const isHigh = test.score >= 10;
                return (
                  <tr
                    key={test.personalitytestno || idx}
                    className={isHigh ? 'high-risk-row' : ''}
                  >
                    <td>{idx + 1}</td>
                    <td>{test.score}점</td>
                    <td>{test.result?.split('\n')[0]}</td>
                    <td>{new Date(test.rdate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(test.personalitytestno)}>
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

export default SeniorTestList;
