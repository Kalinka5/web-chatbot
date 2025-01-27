import React from "react";

import "../../styles/startChatButton.css";

function StartChatButton({ onClick }) {
  return (
    <div className="start-chat-container">
      <button className="start-chat-button" onClick={onClick}>
        Start new chat
      </button>
    </div>
  );
}

export default StartChatButton;
