import React from "react";
import ChatBot from "./ChatBot";
import ChatBotContainer from "./ChatBotContainer";

function TodakiPage() {
  const memberno = String(JSON.parse(localStorage.getItem('user') || '{}').memberno);
  return (
    <div>
      {/* <ChatBot /> */}
      <ChatBotContainer memberno={memberno} />;
    </div>
  );
}

export default TodakiPage;