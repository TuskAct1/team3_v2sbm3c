import React from "react";
import ChatBot from "./ChatBot";
import ChatBotContainer from "./ChatBotContainer";

function TodakiPage() {
  const memberno = "testuser";
  return (
    <div>
      {/* <ChatBot /> */}
      <ChatBotContainer memberno={"testuser"} />;
    </div>
  );
}

export default TodakiPage;