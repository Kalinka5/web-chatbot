import React from "react";

function SendMessage({ lastChat, inputMessage, setInputMessage, handleSendMessage }) {
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
        <button className="send__button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
