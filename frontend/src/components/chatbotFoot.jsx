import React from "react";

import "../styles/chatbotFoot.css";

function ChatbotFooter({ poweredBy }) {
  return (
    <div className="chatbox__footer">
      <p className="powered">
        Powered by <a href="#">{poweredBy}</a>
      </p>
    </div>
  );
}

export default ChatbotFooter;
