import React, { useEffect, useState, useRef } from "react";
import './Chatbot.css';

function ChatBot({ memberno, room_id, room_title, setRoomTitle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState(null);
  const [showStat, setShowStat] = useState(false);
  const [statLoading, setStatLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);
  const messageEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const mname = user.mname || "사용자";

  const greetings = [
    `안녕하세요, ${mname}님 😊 오늘은 어떠신가요?`,
    `${mname}님, 오늘도 토닥이와 함께 마음을 나눠보아요 💬`,
    `반가워요 ${mname}님! 무엇이든 편하게 이야기해주세요 🌿`,
    `${mname}님, 오늘 하루 어떠셨어요? 저는 잘 듣고 있어요 :)`
  ];

  const [greeting] = useState(greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => { fetchHistory(); }, [memberno, room_id]);
  useEffect(() => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    const res = await fetch("http://121.78.128.139:8000/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno, room_id }),
    });
    const data = await res.json();
    if (data.history && data.history.length > 0) {
      setMessages(data.history);
      setHasHistory(true);
    } else {
      setMessages([]);
      setHasHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // 내가 보낸 메시지까지 스크롤!
    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);

    // 여기에 실제 FastAPI 서버 주소로 POST 요청
    try {
      const res = await fetch("http://121.78.128.139:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberno, room_id, message: input }),
      });
      const data = await res.json();
      if (isFirstMessage) {
        await fetch("http://121.78.128.139:8000/chat/update-room-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room_id, room_title: input }),
        });
        if (setRoomTitle) setRoomTitle(input);
        setIsFirstMessage(false);
      }
      setMessages([...newMessages, { from: "bot", text: data.response || "답변을 받아오지 못했습니다." }]);
    } catch {
      setMessages([...newMessages, { from: "bot", text: "서버와 연결할 수 없습니다." }]);
    } finally {
      setLoading(false);
      setHasHistory(true);
    }
  };

  const handleShowStat = async () => {
    setStatLoading(true);
    setShowStat(true);
    const res = await fetch("http://121.78.128.139:8000/chat/weekly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno, room_id }),
    });
    const data = await res.json();
    setStat(data.raw);
    setStatLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleDeleteMessage = async (messageId) => {
  await fetch(`http://121.78.128.139:8000/chat/delete/${messageId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberno, room_id }),
  });
  // 삭제가 끝나면 다시 히스토리를 가져와 UI 갱신
  await fetchHistory();
};

  // ─── JSX 리턴 ───────────────────────────────────────────────────────────
  return (
    <div className="chat-wrapper">
      {hasHistory ? (
        <>
          {/* 대화가 있을 때, 기존 UI */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.from === "user" ? "user" : "bot"}`}>
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="bubble">토닥이 응답 중...</div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="메시지를 입력하세요"
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              전송
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 대화가 없을 때, 빈 화면 중앙에 인사 + 입력창 */}
          <div className="chat-empty-state">
            <div className="chat-greeting">
              <h2>{greeting}</h2>
            </div>
            <div className="chat-input center-input">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="메시지를 입력하세요"
                disabled={loading}
              />
              <button onClick={handleSend} disabled={loading}>
                전송
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatBot;