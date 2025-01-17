import React from "react";

import assistant from "../images/assistant.png";

function ChatbotHeader({
  isChatboxActive,
  setIsChatboxActive,
  isModalOpen,
  setIsModalOpen,
}) {
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleChatbox = () => {
    if (!isChatboxActive) {
      setIsChatboxActive(true); // Trigger open animation
    } else {
      setIsChatboxActive(false); // Hide after animation completes
    }
  };

  return (
    <div className="chatbox__header">
      <div className="img-name">
        <div className="chatbox__image--header">
          <img src={assistant} alt="Chat Support" />
        </div>
        <h4 className="chatbox__heading--header">AI Assistant</h4>
      </div>
      <div className="nav-buttons">
        <div className="block">
          <svg
            className="block dots nav-button"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </div>
        <div>
          <svg
            className="block nav-button"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={toggleChatbox}
          >
            <path d="M5 12h14"></path>
          </svg>
        </div>
        <div>
          <svg
            className="block nav-button"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={toggleModal}
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChatbotHeader;
