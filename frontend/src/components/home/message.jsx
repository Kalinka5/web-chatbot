import React from "react";

import ReactMarkdown from "react-markdown";

function Message({ message }) {
  return typeof message === "string" ? (
    message.includes("\n") ? (
      message.split("\n").map((msgContent, i) => (
        <div className="message-list" key={i}>
          <ReactMarkdown>{msgContent}</ReactMarkdown>
          {i !== message.split("\n").length - 1 && <p style={{ margin: "16px 0" }}></p>}
        </div>
      ))
    ) : (
      <div className="message-list">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    )
  ) : null;
}

export default Message;
