import React from "react";

import { FaArrowLeft } from "react-icons/fa6";

function LastChatsMessage({ chats, setIsLastChatsVisible, setIsSessionPrompt, handleChooseChat }) {
  return (
    <div className="start-message-container">
      <div className="start-message-card">
        <p className="start-message-text">
          <b>Here are your recent chat sessions:</b>
        </p>
        <div className="last-chats-buttons">
          {chats.slice(-3).map((chat, index) => (
            <button
              key={index}
              className="button"
              onClick={() => handleChooseChat(chat.title, chats.length - 3 + index)} // Adjust index to map correctly
            >
              {chat.title}
            </button>
          ))}
        </div>
        <div className="back-container">
          <button className="back-button" onClick={() => setIsLastChatsVisible(false) || setIsSessionPrompt(true)}>
            <FaArrowLeft className="back-icon" />
            <span className="back-text">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LastChatsMessage;
