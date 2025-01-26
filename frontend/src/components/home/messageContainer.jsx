import React from "react";

import assistant from "../../images/assistant.png";

function MessageContainer({ name, children }) {
  return (
    <div className="message">
      {name === "Chatbot" ? <img src={assistant} alt="Chat Support" /> : <div></div>}
      <div className={`messages__item ${name === "Chatbot" ? "messages__item--visitor" : "messages__item--operator"}`}>{children}</div>
    </div>
  );
}

export default MessageContainer;
