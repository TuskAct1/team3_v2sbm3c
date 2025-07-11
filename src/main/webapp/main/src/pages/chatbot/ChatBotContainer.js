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
    <div className="flex h-[90vh] rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-200">
      {/* 좌측 채팅방 목록 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-bold text-xl">채팅방</span>
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow transition"
          >
            + 새 채팅
          </button>
        </div>
        <div className="p-2 flex flex-col gap-1 overflow-y-auto flex-1">
          {rooms.map(room => (
            <div
              key={room.room_id}
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer select-none
                ${selectedRoomId === room.room_id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-800"
                }`}
              onClick={() => handleRoomClick(room.room_id, room.room_title)}
            >
              <span className="flex-1 truncate">{room.room_title}</span>
              <button
                onClick={e => handleDeleteRoom(e, room)}
                className="ml-2 text-gray-400 hover:text-red-400 text-lg"
                title="대화방 삭제"
              >🗑️</button>
            </div>
          ))}
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
          onClick={async () => {
            if(window.confirm("정말 모든 대화방과 메시지를 완전히 삭제하시겠습니까? 복구가 불가합니다.")) {
              const res = await fetch("http://localhost:8000/chat/delete-all-rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberno: String(memberno) }),
              });
              const data = await res.json();
              if(data.result === "success") {
                alert("모든 대화방과 메시지가 삭제되었습니다.");
                setRooms([]);
                setSelectedRoomId("");
                setSelectedRoomTitle("");
              } else {
                alert("삭제에 실패했습니다.");
              }
            }
          }}
        >
          전체 대화방 삭제
        </button>
      </div>
      {/* 채팅 영역 */}
      <div className="flex-1 bg-white flex flex-col">
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
