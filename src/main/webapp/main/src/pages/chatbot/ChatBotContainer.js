import React, { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

function ChatBotContainer({ memberno }) {

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoomTitle, setSelectedRoomTitle] = useState("");
  const [newRoomTitle, setNewRoomTitle] = useState(""); // ⬅️ 추가

  
  useEffect(() => {
    fetchRooms();
  }, [memberno]);


  // 대화방 리스트 불러오기
  const fetchRooms = async () => {
    const res = await fetch("http://localhost:8000/chat/room-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberno: String(memberno) }),
    });
    const data = await res.json();
    setRooms(data.rooms || []);
    // 기본 첫 번째 방 선택
    if (data.rooms && data.rooms.length > 0) {
      // setSelectedRoomId(data.rooms[0].room_id);
      // setSelectedRoomTitle(data.rooms[0].room_title);
    }
  };


  // 새 채팅방 생성 함수
  const handleCreateRoom = async () => {
    // if (!newRoomTitle.trim()) return;
    const res = await fetch("http://localhost:8000/chat/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberno: String(memberno),
        room_title: "새 채팅",
      }),
    });
    const data = await res.json();
    
    await fetchRooms(); // 방 리스트 새로고침
    setSelectedRoomId(data.room_id);
    setSelectedRoomTitle(data.room_title);
  };
  

  // 방을 클릭하면 선택 변경
  const handleRoomClick = (room_id, room_title) => {
    setSelectedRoomId(room_id);
    setSelectedRoomTitle(room_title);
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* 좌측 채팅방 목록 */}
      <div style={{
        width: 220, background: "#f3f4f6", borderRight: "1px solid #e5e7eb", padding: "24px 0"
      }}>
        <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 18, fontSize: 22 }}>채팅방</div>
        {/* 새 채팅방 추가 UI */}
        <div style={{ display: "flex", padding: "0 12px 18px 12px" }}>
          <button
            onClick={handleCreateRoom}
            style={{
              background: "#6f98ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}
          >+ 새 채팅</button>
        </div>
        {/* 채팅방 리스트 */}
        {rooms.map(room => (
          <div
            key={room.room_id}
            onClick={() => handleRoomClick(room.room_id, room.room_title)}
            style={{
              padding: "12px 18px",
              marginBottom: 10,
              borderRadius: 10,
              background: selectedRoomId === room.room_id ? "#c6d7ff" : "#e5e7eb",
              cursor: "pointer",
              fontWeight: selectedRoomId === room.room_id ? "bold" : "normal"
            }}
          >
            {room.room_title}
          </div>
        ))}
      </div>
      {/* 채팅 영역 */}
      <div style={{ flex: 1, background: "#fff" }}>
        {selectedRoomId &&
          <ChatBot
            memberno={memberno}
            room_id={selectedRoomId}
            room_title={selectedRoomTitle}
          />
        }
      </div>
    </div>
  );
}

export default ChatBotContainer;
