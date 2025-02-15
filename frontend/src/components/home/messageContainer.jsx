import React from "react";

import assistant from "../../images/assistant.png";

function MessageContainer({ name, children, isTyping = false }) {
  return (
    <div className="message">
      {name === "Chatbot" ? <img src={assistant} alt="Chat Support" /> : <div></div>}
      {isTyping ? (
        <div className={`messages__item ${name === "Chatbot" ? "visitor" : "operator"}`}>{children}</div>
      ) : (
        <div className={`messages__item message-text ${name === "Chatbot" ? "visitor" : "operator"}`}>{children}</div>
      )}
    </div>
  );
}

export default MessageContainer;
