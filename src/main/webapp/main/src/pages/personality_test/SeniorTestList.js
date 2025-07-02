// 🔹 필요한 리액트 기능 불러오기
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeniorTestList.css'; // 스타일 파일
import { useNavigate } from 'react-router-dom'; // 로그인 안 된 경우 이동용

// 🔸 검사 결과 목록을 보여주는 컴포넌트
function SeniorTestList() {
  const [testList, setTestList] = useState([]); // 🔹 검사 결과 리스트 상태
  const [memberno, setMemberno] = useState(null); // 회원 번호
  const [mname, setMname] = useState('');         // 회원 이름
  const navigate = useNavigate(); // 페이지 이동용

  // 🔸 컴포넌트 로딩 시 로그인 정보 확인 + 검사 결과 불러오기
  useEffect(() => {
    const fetchTests = async () => {
      // ✅ 로그인 사용자 정보 꺼내기
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;
      const loginMname = user?.mname;

      if (!loginMemberno) {
        alert("로그인이 필요합니다.");
        navigate('/login');
        return;
      }

      setMemberno(loginMemberno); // 상태 저장 (화면 표시용)
      setMname(loginMname); // 이름 저장

      try {
        // ✅ 백엔드에서 해당 회원의 검사 결과 가져오기
        const res = await axios.get(`http://localhost:9093/personality_test/testlist/${loginMemberno}`);
        console.log("📦 받아온 데이터:", res.data);
        setTestList(res.data); // 받아온 결과 저장
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패', err);
      }
    };

    fetchTests(); // 실행
  }, [navigate]);

  // 🔹 검사 결과 삭제 함수
  const handleDelete = async (personalitytestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      await axios.delete(`http://localhost:9093/personality_test/delete/${personalitytestno}`);
      setTestList(prevList =>
        prevList.filter(test => test.personalitytestno !== personalitytestno)
      );
    } catch (err) {
      console.error('❌ 삭제 실패', err);
      alert('삭제에 실패했어요.');
    }
  };

  // 🔸 실제 화면에 렌더링되는 부분
  return (
    <div className="testlist-page-bg"> {/* ✅ 초록 배경 */}
      <div className="testlist-container"> {/* ✅ 흰 배경 박스 */}
        <div className="testlist-header">
          <h2>🧠 {mname}님의 검사 기록</h2>
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
