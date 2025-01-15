import React from "react";

import chatBotIcon from "../images/chatbox-icon.svg";
import closeChatBotIcon from "../images/close-icon.svg";

function OpenChatButton({ isChatboxActive, setIsChatboxActive, setIsVisible }) {
  const toggleChatbox = () => {
    if (!isChatboxActive) {
      setIsVisible(true); // Ensure chatbox is visible before animation
      setTimeout(() => setIsChatboxActive(true), 0); // Trigger open animation
    } else {
      setIsChatboxActive(false); // Trigger close animation
      setTimeout(() => setIsVisible(false), 300); // Hide after animation completes
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
