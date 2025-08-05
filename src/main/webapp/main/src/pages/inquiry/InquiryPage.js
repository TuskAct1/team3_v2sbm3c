import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './InquiryPage.css';

function InquiryPage() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

  // ✅ 로그인 정보 (memberno, adminno)
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const memberno = userObj.memberno;
  const adminno = userObj.adminno;
  const isAdmin = !!adminno;

  // ✅ 전체 문의 목록 불러오기
  const fetchList = async () => {
    const res = await fetch(`http://121.78.128.139:9093/inquiry/list_all?memberno=${memberno || ''}&adminno=${adminno || ''}`);
    const data = await res.json();
    setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // ✅ 선택한 문의 디테일 불러오기
  const handleSelect = async (inquiryno) => {
    if (selected?.inquiryno === inquiryno) {
      setSelected(null);
      return;
    }

    const res = await fetch(`http://121.78.128.139:9093/inquiry/${inquiryno}?memberno=${memberno || ''}&adminno=${adminno || ''}`);
    const data = await res.json();
    setSelected(data);
    setAnswerInput(data.answer || "");
  };

  // ✅ 관리자 답변 등록
  const handleAnswer = async () => {
    if (!answerInput.trim()) return alert("답변을 입력해주세요.");
    setAnswerLoading(true);
    try {
      const res = await fetch(`http://121.78.128.139:9093/inquiry/answer/${selected.inquiryno}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerInput }),
      });
      const result = await res.json();
      if (result.success) {
        alert("답변이 등록되었습니다.");
        fetchList();
        handleSelect(selected.inquiryno);
      } else {
        alert("답변 등록 실패");
      }
    } finally {
      setAnswerLoading(false);
    }
  };

  return (
    <div className="inquiry-wrap">
      <div className="inquiry-topbar">
        <h1 className="inquiry-title">1:1 문의 내역</h1>
        <Link to="/inquiry/create" className="inquiry-create-btn">문의 작성</Link>
      </div>

      <table className="inquiry-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>상태</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {list.map(inquiry => (
            <React.Fragment key={inquiry.inquiryno}>
              <tr onClick={() => handleSelect(inquiry.inquiryno)}>
                <td>{inquiry.inquiryno}</td>
                <td>{inquiry.title}</td>
                <td>
                  {inquiry.status === "Y" ? (
                    <span className="inquiry-status-done">답변완료</span>
                  ) : (
                    <span className="inquiry-status-wait">대기</span>
                  )}
                </td>
                <td>{inquiry.create_date?.substring(0, 10)}</td>
              </tr>

              {selected?.inquiryno === inquiry.inquiryno && (
                <tr className="inquiry-detail-row">
                  <td colSpan="4">
                    <div className="inquiry-detail-card">
                      <div className="inquiry-detail-header">
                        <div className="inquiry-title-wrap">
                          <div className="inquiry-detail-title">{selected.title}</div>
                          <div className="inquiry-detail-date">작성일: {selected.create_date?.substring(0, 10)}</div>
                        </div>
                        <button className="inquiry-close-btn" onClick={() => setSelected(null)}>닫기</button>
                      </div>

                      <div className="inquiry-section">
                        <div className="inquiry-section-label">문의내용</div>
                        <div className="inquiry-section-content">{selected.content}</div>
                      </div>

                      <div className="inquiry-section">
                        <div className="inquiry-section-label">관리자 답변</div>
                        {isAdmin ? (
                          <>
                            <textarea
                              className="inquiry-answer-input"
                              rows={3}
                              value={answerInput}
                              onChange={e => setAnswerInput(e.target.value)}
                              placeholder="답변을 입력하세요"
                              disabled={answerLoading}
                            />
                            <div className="inquiry-answer-button-wrap">
                              <button
                                onClick={handleAnswer}
                                className="inquiry-answer-btn"
                                disabled={answerLoading}
                              >
                                답변 등록
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {selected.answer ? (
                              <div className="inquiry-answer-view">{selected.answer}</div>
                            ) : (
                              <div className="inquiry-answer-empty">아직 답변이 등록되지 않았습니다.</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InquiryPage;
