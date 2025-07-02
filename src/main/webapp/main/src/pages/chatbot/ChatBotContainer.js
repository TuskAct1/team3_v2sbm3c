import React, { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

function ChatBotContainer({ memberno }) {

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoomTitle, setSelectedRoomTitle] = useState("");
  const [roomTitleInput, setRoomTitleInput] = useState("");
  
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
      setSelectedRoomId(data.rooms[0].room_id);
      setSelectedRoomTitle(data.rooms[0].room_title);
    }
  };


  // 새 채팅방 생성 함수
  const handleCreateRoom = async () => {
    const title = roomTitleInput.trim() || "새 채팅";
    const res = await fetch("http://localhost:8000/chat/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberno: memberno,
        room_title: title,
      }),
    });
    const data = await res.json();
    
    setRoomTitleInput(""); // 입력값 초기화
    await fetchRooms(); // 방 리스트 새로고침
    setSelectedRoomId(data.room_id);
    setSelectedRoomTitle(data.room_title);
  };
  

  // 방을 클릭하면 선택 변경
  const handleRoomClick = (room_id, room_title) => {
    setSelectedRoomId(room_id);
    setSelectedRoomTitle(room_title);
  };

  // 대화방 삭제 핸들러
  const handleDeleteRoom = (e, room) => {
    e.stopPropagation(); // 삭제버튼 클릭시 방 선택 안되게!
    if (window.confirm("정말 이 대화방을 삭제할까요?")) {
      fetch("http://localhost:8000/chat/delete-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberno: String(memberno),
          room_id: room.room_id
        })
      })
      .then(res => res.json())
      .then(data => {
        // 삭제 후 방 리스트 갱신
        fetchRooms();
        // 삭제된 방이 현재 선택된 방이면 선택 해제 또는 첫 번째 방으로 이동
        if (room.room_id === selectedRoomId) {
          if (rooms.length > 1) {
            const idx = rooms.findIndex(r => r.room_id === room.room_id);
            const nextRoom = rooms[idx === 0 ? 1 : 0];
            setSelectedRoomId(nextRoom.room_id);
            setSelectedRoomTitle(nextRoom.room_title);
          } else {
            setSelectedRoomId("");
            setSelectedRoomTitle("");
          }
        }
      });
    }
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* 좌측 채팅방 목록 */}
      <div style={{
      width: 240, background: "#f4f7fd", borderRight: "1px solid #e5e7eb", padding: "18px 0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 12px 18px 12px" }}>
        <span style={{ fontWeight: "bold", fontSize: 22 }}>채팅방</span>
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
      <div>
        {rooms.map(room => (
          <div
            key={room.room_id}
            style={{
              display: "flex", alignItems: "center",
              padding: "13px 10px 13px 20px", margin: "7px 9px",
              borderRadius: 10,
              background: selectedRoomId === room.room_id ? "#dde7fa" : "#e9ebf5",
              cursor: "pointer",
              fontWeight: selectedRoomId === room.room_id ? "bold" : "normal",
              color: "#222"
            }}
          >
            <span
              onClick={() => handleRoomClick(room.room_id, room.room_title)}
              style={{ flex: 1 }}
            >
              {room.room_title}
            </span>
            <button
              onClick={e => handleDeleteRoom(e, room)}
              style={{
                marginLeft: 8,
                border: "none",
                background: "transparent",
                color: "#888",
                fontSize: 18,
                cursor: "pointer"
              }}
              title="대화방 삭제"
            >🗑️</button>
          </div>
        ))}
      </div>
    </div>
      {/* 채팅 영역 */}
      <div style={{ flex: 1, background: "#fff" }}>
        {selectedRoomId &&
          <ChatBot
            memberno={memberno}
            room_id={selectedRoomId}
            room_title={selectedRoomTitle}
            setRoomTitle={setSelectedRoomTitle}
          />
        }
      </div>
    </div>
  );
}

export default ChatBotContainer;
