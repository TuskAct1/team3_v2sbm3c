import React, { useEffect, useState, useRef } from "react";

function ChatBot({ memberno, room_id, room_title }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "안녕하세요! 토닥이 챗봇입니다. 무엇이든 말씀해 주세요." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // 👇 "처음 마운트될 때" 히스토리 불러오기
  useEffect(() => {
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
    fetchHistory();
  }, [memberno, room_id, room_title]);

  // 👇 새 메시지 올 때마다 스크롤 내리기
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    </div>
  );
}

export default ChatBot;