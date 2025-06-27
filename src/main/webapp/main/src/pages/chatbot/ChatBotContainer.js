import React from "react";
import ChatBot from "./ChatBot";

function ChatBotContainer({ memberno }) {
  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* 왼쪽 세로바 */}
      <div style={{
        width: 220,
        background: "#f3f4f6",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 0"
      }}>
        <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 30, fontSize: 22 }}>채팅방</div>
        {/* (여기에 나중에 대화방 리스트, 새 대화 추가 버튼 등 구현 가능) */}
        <div style={{
          padding: "12px 18px", marginBottom: 10,
          borderRadius: 10, background: "#e5e7eb"
        }}>토닥이 챗봇</div>
      </div>
      {/* 채팅 영역 */}
      <div style={{ flex: 1, background: "#fff" }}>
        <ChatBot memberno={memberno} />
      </div>
    </div>
  );
}

export default ChatBotContainer;
