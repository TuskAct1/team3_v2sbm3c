import React, { useEffect, useState, useRef } from "react";
import './Chatbot.css';

function ChatBot({ memberno, room_id, room_title, setRoomTitle }) {
  const mname = String(JSON.parse(localStorage.getItem('user') || '{}').mname); // Member 이름
  const [messages, setMessages] = useState([
    { from: "bot", text: '안녕하세요! ' + mname + '님. 토닥이 챗봇입니다. 무엇이든 말씀해 주세요.' },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const [stat, setStat] = useState(null);
  const [showStat, setShowStat] = useState(false);
  const [statLoading, setStatLoading] = useState(false);

  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // "처음 마운트될 때" 히스토리 불러오기
  useEffect(() => {
    fetchHistory();
  }, [memberno, room_id, room_title]);

  // 새 메시지 올 때마다 스크롤 내리기
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // "처음 마운트될 때" 히스토리 불러오기
  const fetchHistory = async () => {
      const res = await fetch("http://localhost:8000/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberno, room_id }),
      });
      const data = await res.json();
    if (data.history && data.history.length > 0) {
      setMessages(data.history);
    } else {
      setMessages([
        { from: "bot", text: '안녕하세요! ' + mname + '님. 토닥이 챗봇입니다. 무엇이든 말씀해 주세요.' }
      ]);
    }
  };


  // 메세지 전송 핸들러
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // 여기에 실제 FastAPI 서버 주소로 POST 요청
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberno: memberno, // 실제 로그인 유저로 대체
          room_id: room_id,
          message: input,
        }),
      });
      const data = await res.json();

      // 첫 메시지라면 방 제목도 업데이트
      if (isFirstMessage) {
        await fetch("http://localhost:8000/chat/update-room-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id, 
            room_title: input,
          }),
        });
        if (setRoomTitle) setRoomTitle(input);
        setIsFirstMessage(false);
      }

      setMessages([
        ...newMessages,
        { from: "bot", text: data.response || "답변을 받아오지 못했습니다." },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "서버와 연결할 수 없습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 통계 보기 핸들러
  const handleShowStat = async () => {
    setStatLoading(true);
    setShowStat(true);
    const res = await fetch("http://localhost:8000/chat/weekly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberno: memberno,
        room_id
      }),
    });
    const data = await res.json();
    setStat(data.raw);
    setStatLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅창 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"} mb-4`}>
            <div className={`
              max-w-[75%] px-4 py-2 rounded-2xl shadow text-lg leading-relaxed whitespace-pre-line
              ${msg.from === "user"
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-white text-gray-800 border rounded-bl-md"
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl shadow">
              토닥이 응답 중...
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* 입력창 */}
      <div className="flex items-center border-t p-4 bg-white">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="flex-1 rounded-xl border px-4 py-2 text-lg outline-none focus:border-blue-400 transition"
          placeholder="메시지를 입력하세요"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="ml-3 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition"
          disabled={loading}
        >
          전송
        </button>
        <button
          onClick={handleShowStat}
          className="ml-3 px-4 py-2 bg-gray-200 hover:bg-blue-100 text-gray-700 rounded-xl shadow text-base"
        >
          통계 보기
        </button>
      </div>
      {/* 통계 모달 */}
      {showStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs mx-3">
            <div className="font-bold text-lg mb-3">최근 1주일 감정 통계</div>
            {statLoading && <div>불러오는 중...</div>}
            {stat && (
              <ul className="space-y-1 text-base">
                <li>😊 긍정: {stat["긍정"]}회</li>
                <li>😥 부정: {stat["부정"]}회</li>
                <li>😐 중립: {stat["중립"]}회</li>
                <li>😨 불안: {stat["불안"]}회</li>
                <li>😔 우울: {stat["우울"]}회</li>
              </ul>
            )}
            <button
              onClick={() => setShowStat(false)}
              className="mt-4 w-full py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;