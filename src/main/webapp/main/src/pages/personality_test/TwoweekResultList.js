import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeniorTestList.css'; // CSS 따로 관리

function TwoweekResultList() {
  const [resultList, setResultList] = useState([]);
  const [memberno, setMemberno] = useState(null);
  const [mname, setMname] = useState('');

  // ✅ 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 10개씩

  // ✅ 전체 페이지 수 계산
  const totalPages = Math.ceil(resultList.length / itemsPerPage);

  // ✅ 현재 페이지에 표시할 항목 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = resultList.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchResults = async () => {
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
        const res = await axios.get(`http://121.78.128.139:9093/twoweek_test/testlist/${loginMemberno}`);
        setResultList(res.data);
      } catch (err) {
        console.error('❌ 검사 결과 불러오기 실패', err);
      }
    };

    fetchResults();
  }, []);

  const handleDelete = async (twoweektestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      await axios.delete(`http://121.78.128.139:9093/twoweek_test/delete/${twoweektestno}`);
      setResultList(prev => prev.filter(t => t.twoweektestno !== twoweektestno));
    } catch (err) {
      alert('삭제에 실패했어요.');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="twoweek-page-bg">
      <div className="twoweek-list-container">
        <div className="twoweek-header">
          <h2>🧠 {mname}님의 2주 주기 우울증 검사 기록</h2>
          <button className="small-btn" onClick={() => window.location.href = '/personality_test'}>
            이전
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
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">😥 검사 결과가 없습니다.</td>
              </tr>
            ) : (
              currentItems.map((test, idx) => {
                let riskClass = test.score <= 4
                  ? 'low-risk' : test.score <= 9
                  ? 'mild-risk' : test.score <= 14
                  ? 'moderate-risk' : 'high-risk';

                return (
                  <tr key={test.twoweektestno || idx} className={riskClass}>
                    <td>{indexOfFirst + idx + 1}</td>
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

        {/* ✅ 페이징 버튼 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              ◀
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active-page' : ''}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TwoweekResultList;
