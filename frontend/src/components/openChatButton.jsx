import React from "react";

import chatBotIcon from "../images/chatbox-icon.svg";
import closeChatBotIcon from "../images/close-icon.svg";

function OpenChatButton({ isChatboxActive, setIsChatboxActive }) {
  const toggleChatbox = () => {
    if (!isChatboxActive) {
      setIsChatboxActive(true); // Trigger open animation
    } else {
      setIsChatboxActive(false); // Hide after animation completes
    }
  };

  return (
    <div className="chatbox__button">
      <button className="open-chat-button" onClick={toggleChatbox}>
        <img
          src={isChatboxActive ? closeChatBotIcon : chatBotIcon}
          alt="Open Chatbox"
        />
      </button>
    </div>
  );
}

export default OpenChatButton;
