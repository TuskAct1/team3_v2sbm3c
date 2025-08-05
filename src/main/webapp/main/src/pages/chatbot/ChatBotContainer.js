import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaRegCommentDots, FaCog, FaTrash, FaPlus } from "react-icons/fa";
import ChatBot from "./ChatBot";
import "./Chatbot.css";
import { FaChevronRight } from "react-icons/fa"; // ✅ 추가

function ChatBotContainer({ memberno }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoomTitle, setSelectedRoomTitle] = useState("");
  const [roomTitleInput, setRoomTitleInput] = useState("");
  const [startInput, setStartInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ⭐ 사이드바 열림 여부

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mname = user.mname || "사용자";
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, [memberno]);

  const fetchRooms = async () => {
    const res = await fetch("http://121.78.128.139:8000/chat/room-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno: String(memberno) }),
    });
    const data = await res.json();
    const list = data.rooms || [];
    setRooms(list);

    if (list.length > 0 && !list.find(r => r.room_id === selectedRoomId)) {
      setSelectedRoomId(list[0].room_id);
      setSelectedRoomTitle(list[0].room_title);
    }
    return list;
  };

  const handleCreateRoom = async () => {
    const title = roomTitleInput.trim() || "새 채팅";
    const res = await fetch("http://121.78.128.139:8000/chat/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno, room_title: title }),
    });
    const data = await res.json();
    setRoomTitleInput("");
    await fetchRooms();
    setSelectedRoomId(data.room_id);
    setSelectedRoomTitle(data.room_title);
  };

  const handleRoomClick = (room_id, room_title) => {
    setSelectedRoomId(room_id);
    setSelectedRoomTitle(room_title);
  };

  const handleDeleteRoom = async (e, room) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 대화방을 삭제할까요?")) return;

    const res = await fetch("http://121.78.128.139:8000/chat/delete-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno: String(memberno), room_id: room.room_id }),
    });

    if (!res.ok) {
      console.error("삭제 실패:", res.status);
      return;
    }

    setRooms(rs => rs.filter(r => r.room_id !== room.room_id));
    const newList = await fetchRooms();

    if (room.room_id === selectedRoomId) {
      if (newList.length > 0) {
        setSelectedRoomId(newList[0].room_id);
        setSelectedRoomTitle(newList[0].room_title);
      } else {
        setSelectedRoomId("");
        setSelectedRoomTitle("");
      }
    }
  };

  const handleDeleteAllRooms = async () => {
    if (!window.confirm("모든 대화 기록을 삭제하시겠습니까?")) return;
    const res = await fetch("http://121.78.128.139:8000/chat/delete-all-rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno: String(memberno) }),
    });
    const data = await res.json();
    if (data.result === "success") {
      setRooms([]);
      setSelectedRoomId("");
      setSelectedRoomTitle("");
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleStartChat = async () => {
    const title = startInput.trim() || "새 채팅";
    const res = await fetch("http://121.78.128.139:8000/chat/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno, room_title: title }),
    });
    const data = await res.json();
    await fetchRooms();
    setSelectedRoomId(data.room_id);
    setSelectedRoomTitle(data.room_title);
    setStartInput("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };



  return (
    <div className="chat-layout">
      {/* ▶️ 접힘 상태일 때 사이드 열기 & 새 채팅 버튼 */}
      {!isSidebarOpen && (
        <div className="sidebar-toggle-area">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            title="사이드바 열기"
          >
            <img src="/images/sidebar-open.png" alt="사이드바 열기" className="sidebar-icon" />
          </button>
          <button
            onClick={handleCreateRoom}
            className="sidebar-toggle-btn"
            title="새 채팅 만들기"
          >
            <img src="/images/create-chat.png" alt="새 채팅 만들기" className="sidebar-icon" />
          </button>
        </div>
      )}

      {/* ───── 사이드바 ───── */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>

        {/* 닫기 버튼 */}
        {isSidebarOpen && (
          <button
            className="sidebar-close-btn"
            onClick={toggleSidebar}
            title="사이드바 닫기"
          >
            <img src="/images/sidebar-close.png" alt="사이드바 닫기" className="sidebar-icon" />
          </button>
        )}

        <div className="chat-sidebar-top">
          <img src="/images/todak-character3.gif" alt="토닥이" className="chat-avatar" />
          <h3 className="sidebar-title">토닥이</h3>
        </div>

        <div className="room-list">
          {rooms.map(room => (
            <div
              key={room.room_id}
              className={`room-item ${selectedRoomId === room.room_id ? "active" : ""}`}
              onClick={() => handleRoomClick(room.room_id, room.room_title)}
            >
              <FaRegCommentDots className="room-icon" />
              <span>{room.room_title}</span>
              <button className="delete-icon-btn" onClick={e => handleDeleteRoom(e, room)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="chat-sidebar-actions">
          <button className="sidebar-btn" onClick={handleCreateRoom}><FaPlus /> 새 채팅</button>
          <button className="sidebar-btn" onClick={handleDeleteAllRooms}><FaTrash /> 모든 대화 기록 삭제하기</button>
        </div>
      </aside>

      {/* ───── 챗봇 메인 영역 ───── */}
      <main className="chat-main">
        {selectedRoomId ? (
          <ChatBot
            memberno={memberno}
            room_id={selectedRoomId}
            room_title={selectedRoomTitle}
            setRoomTitle={setSelectedRoomTitle}
          />
        ) : (
          <div className="chat-empty-state">
            <div className="chat-greeting">
              <h2>안녕하세요, {mname}님 😊 오늘은 어떠신가요?</h2>
            </div>
            <div className="chat-input center-input">
              <input
                value={startInput}
                onChange={e => setStartInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleStartChat()}
                placeholder="속마음을 편하게 적어보세요!"
              />
              <button onClick={handleStartChat}>전송</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChatBotContainer;
