import React from "react";
import { IoSendSharp } from "react-icons/io5";

import "../../styles/sendMessage.css";

function SendMessage({ inputMessage, setInputMessage, handleSendMessage }) {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="input-button-container">
      <div className="input-button">
        <input
          className="input-message"
          type="text"
          placeholder="Write a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        <button className={`send__button ${inputMessage.trim() ? "active" : ""}`} onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          <IoSendSharp size={20} />
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
