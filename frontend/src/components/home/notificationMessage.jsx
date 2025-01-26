import React from "react";

function NotificationMessage({ chats, handleNewChat, handlePreviousChats }) {
  return (
    <div className="start-message-container">
      <div className="start-message-card">
        {chats.length === 0 ? (
          <>
            <p className="start-message-text">
              <b>You don’t have any previous chats. Start a new chat to get started!</b> 🌟
            </p>
            <div className="session-buttons">
              <button className="button new-chat" onClick={handleNewChat}>
                New Chat
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="start-message-text">
              <b>Do you want to continue with your previous session or start a new chat?</b> ⬇️
            </p>
            <div className="session-buttons">
              <button className="button" onClick={handlePreviousChats}>
                Previous Session
              </button>
              <button className="button" onClick={handleNewChat}>
                New Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationMessage;
