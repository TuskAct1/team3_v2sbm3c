import React, { useEffect, useState, useRef } from "react";

function ChatBot({ memberno, room_id, room_title, setRoomTitle }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "안녕하세요! 토닥이 챗봇입니다. 무엇이든 말씀해 주세요." },
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
        { from: "bot", text: "안녕하세요! 토닥이 챗봇입니다. 무엇이든 말씀해 주세요." }
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
    <div>
      <div style={{
        minHeight: 320, maxHeight: "70vh", overflowY: "auto", marginBottom: 16,
        padding: 12, background: "#f7f7fb", borderRadius: 10
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.from === "bot" ? "left" : "right",
            margin: "10px 0"
          }}>
            <span style={{
              display: "inline-block",
              background: msg.from === "bot" ? "#e6eefa" : "#d3f8d3",
              padding: "9px 16px",
              borderRadius: 16,
              maxWidth: "72%",
              wordBreak: "break-word"
            }}>
            {msg.text}
            </span>
          </div>
        ))}
        {loading && (
        <div style={{ textAlign: "left", color: "#888" }}>토닥이 응답 중...</div>
        )}
        {/* 👇 메시지 끝에 이 div를 렌더링해서 스크롤 */}
        <div ref={messageEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #bbb" }}
          placeholder="메시지를 입력하세요"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: 8, padding: "8px 18px", borderRadius: 10, border: "none", background: "#6f98ff", color: "#fff" }}
          disabled={loading}
        >
          전송
        </button>
      </div>

      <div style={{ margin: "18px 0" }}>
        <button onClick={handleShowStat} style={{ /* ... */ }}>통계 보기</button>
      </div>
      {showStat && (
        <div style={{ /* ... */ }}>
          <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            최근 1주일 감정 통계
          </div>
          {statLoading && <div>불러오는 중...</div>}
          {stat && (
            <ul>
              <li>긍정: {stat["긍정"]}회</li>
              <li>부정: {stat["부정"]}회</li>
              <li>중립: {stat["중립"]}회</li>
              <li>불안: {stat["불안"]}회</li>
              <li>우울: {stat["우울"]}회</li>
            </ul>
          )}
          <button onClick={() => setShowStat(false)}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default ChatBot;