import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './InquiryPage.css'; // 고유 CSS

function InquiryPage() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  let memberno = userObj.memberno;
  const isAdmin = !memberno || memberno === "undefined";
  if (isAdmin) memberno = 0;

  const fetchList = async () => {
    const res = await fetch(`/inquiry/list_all/${memberno}`);
    const data = await res.json();
    setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const handleSelect = async (inquiryno) => {
    const res = await fetch(`/inquiry/${memberno}/${inquiryno}`);
    const data = await res.json();
    setSelected(data);
    setAnswerInput(data.answer || "");
  };

  const handleAnswer = async () => {
    if (!answerInput.trim()) return alert("답변을 입력해주세요.");
    setAnswerLoading(true);
    try {
      const res = await fetch(`/inquiry/answer/${selected.inquiryno}`, {
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
            <tr key={inquiry.inquiryno} onClick={() => handleSelect(inquiry.inquiryno)}>
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
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="inquiry-detail-card">
          <div className="inquiry-detail-header">
            <div className="inquiry-detail-title">{selected.title}</div>
            <button className="inquiry-close-btn" onClick={() => setSelected(null)}>닫기</button>
          </div>
          <div className="inquiry-detail-date">작성일: {selected.create_date?.substring(0, 10)}</div>
          <div className="inquiry-detail-content">{selected.content}</div>

          <div className="inquiry-answer-box">
            <div className="inquiry-answer-label">관리자 답변</div>
            {isAdmin ? (
              <div>
                <textarea
                  className="inquiry-answer-input"
                  rows={3}
                  value={answerInput}
                  onChange={e => setAnswerInput(e.target.value)}
                  placeholder="답변을 입력하세요"
                  disabled={answerLoading}
                />
                <button
                  onClick={handleAnswer}
                  className="inquiry-answer-btn"
                  disabled={answerLoading}
                >답변 등록</button>
              </div>
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
      )}
    </div>
  );
}

export default InquiryPage;
