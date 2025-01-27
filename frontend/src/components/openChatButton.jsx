import React from "react";

import chatBotIcon from "../images/chatbox-icon.svg";
import closeChatBotIcon from "../images/close-icon.svg";

import "../styles/openChatButton.css";

function OpenChatButton({ isChatboxActive, onClick }) {
  return (
    <div className="chatbox__button">
      <button className="open-chat-button" onClick={onClick}>
        <img src={isChatboxActive ? closeChatBotIcon : chatBotIcon} alt="Open Chatbox" />
      </button>
    </div>
  );
}

export default OpenChatButton;
