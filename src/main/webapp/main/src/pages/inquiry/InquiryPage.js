import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function InquiryPage() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  let memberno = userObj.memberno;
  const isAdmin = !memberno || memberno === "undefined"; // 관리자 여부
  if (isAdmin) memberno = 0; // 관리자일 때는 0을 사용

  // 문의 전체 목록 가져오기
  const fetchList = async () => {
    const res = await fetch(`/inquiry/list_all/${memberno}`); // Spring: @GetMapping("/inquiry/list/memberno")
    console.log(res);
    const data = await res.json();
    console.log(data)
    setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // 문의 상세
  const handleSelect = async (inquiryno) => {
    const res = await fetch(`/inquiry/${memberno}/${inquiryno}`);
    const data = await res.json();
    setSelected(data);
    setAnswerInput(data.answer || ""); // 이전 답변 있으면, 입력창에 보여주기
  };

  // 관리자 답변 등록
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
        handleSelect(selected.inquiryno); // 새로고침
      } else {
        alert("답변 등록 실패");
      }
    } finally {
      setAnswerLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">1:1 문의 내역</h1>
        <Link to="/inquiry/create" className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600">문의 작성</Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2">번호</th>
            <th className="py-2">제목</th>
            <th className="py-2">상태</th>
            <th className="py-2">작성일</th>
          </tr>
        </thead>
        <tbody>
          {list.map(inquiry => (
            <tr key={inquiry.inquiryno} className="hover:bg-blue-50 cursor-pointer" onClick={() => handleSelect(inquiry.inquiryno)}>
              <td className="text-center">{inquiry.inquiryno}</td>
              <td>{inquiry.title}</td>
              <td className="text-center">
                {inquiry.status === "Y" ? (
                  <span className="text-green-600 font-bold">답변완료</span>
                ) : (
                  <span className="text-gray-500">대기</span>
                )}
              </td>
              <td className="text-center">{inquiry.create_date?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상세보기 */}
      {selected && (
        <div className="mt-10 border rounded-lg bg-white shadow-md p-6">
          <div className="mb-3 flex justify-between">
            <div className="font-bold text-lg">{selected.title}</div>
            <button className="text-gray-400 hover:text-black" onClick={() => setSelected(null)}>닫기</button>
          </div>
          <div className="mb-2 text-sm text-gray-600">작성일: {selected.create_date?.substring(0, 10)}</div>
          <div className="mb-5 whitespace-pre-line">{selected.content}</div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold text-blue-700 mb-2">관리자 답변</div>
            {/* 관리자만 답변 입력 가능 */}
            {isAdmin ? (
              <div>
                <textarea
                  className="w-full border p-2 rounded mb-2"
                  rows={3}
                  value={answerInput}
                  onChange={e => setAnswerInput(e.target.value)}
                  placeholder="답변을 입력하세요"
                  disabled={answerLoading}
                />
                <button
                  onClick={handleAnswer}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={answerLoading}
                >답변 등록</button>
              </div>
            ) : (
              <>
                {selected.answer ? (
                  <div className="text-gray-800 whitespace-pre-line">{selected.answer}</div>
                ) : (
                  <div className="text-gray-400">아직 답변이 등록되지 않았습니다.</div>
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
