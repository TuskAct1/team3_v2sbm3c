import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeniorTestList.css'; // ✅ 동일 스타일 사용
import { useNavigate } from 'react-router-dom';

function SeniorTestList() {
  const [testList, setTestList] = useState([]);
  const [memberno, setMemberno] = useState(null);
  const [mname, setMname] = useState('');
  const navigate = useNavigate();

  // ✅ 페이징 관련
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(testList.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = testList.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchTests = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const loginMemberno = user?.memberno;
      const loginMname = user?.mname;

      if (!loginMemberno) {
        alert("로그인이 필요합니다.");
        navigate('/login');
        return;
      }

      setMemberno(loginMemberno);
      setMname(loginMname);

      try {
        const res = await axios.get(`http://121.78.128.139:9093/personality_test/testlist/${loginMemberno}`);
        setTestList(res.data);
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패', err);
      }
    };

    fetchTests();
  }, [navigate]);

  const handleDelete = async (personalitytestno) => {
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    try {
      await axios.delete(`http://121.78.128.139:9093/personality_test/delete/${personalitytestno}`);
      setTestList(prevList =>
        prevList.filter(test => test.personalitytestno !== personalitytestno)
      );
    } catch (err) {
      console.error('❌ 삭제 실패', err);
      alert('삭제에 실패했어요.');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="twoweek-page-bg"> {/* ✅ 배경 통일 */}
      <div className="twoweek-list-container">
        <div className="twoweek-header">
          <h2>🧠 {mname}님의 검사 기록</h2>
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
                <td colSpan="5" className="empty-row">😥 아직 검사 결과가 없습니다.</td>
              </tr>
            ) : (
              currentItems.map((test, idx) => {
                const isHigh = test.score >= 10; // 예: 우울감 점수 10점 이상이면 강조
                return (
                  <tr key={test.personalitytestno || idx} className={isHigh ? 'high-risk' : ''}>
                    <td>{indexOfFirst + idx + 1}</td>
                    <td>{test.score}점</td>
                    <td>{test.result?.split('\n')[0]}</td>
                    <td>{new Date(test.rdate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(test.personalitytestno)}>삭제</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ✅ 페이징 */}
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

export default SeniorTestList;
