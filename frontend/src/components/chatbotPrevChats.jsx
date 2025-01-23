import React from "react";

import ChatbotImg from "../images/chatbot.png";

function ChatbotPrevChats({ chats, setChatTitle, setActivePage, setActiveButton, setChatIndex, numChatsToShow, setNumChatsToShow, setIsSessionPrompt }) {
  const handleChooseChat = (chatTitle, chatIndex) => {
    sessionStorage.setItem("hasSessionPrompt", "true");
    setIsSessionPrompt(false);
    setChatTitle(chatTitle);
    setChatIndex(chatIndex);
    setActivePage("home");
    setActiveButton("home");
  };

  const handleRadioChange = (event) => {
    setNumChatsToShow(Number(event.target.value)); // Update the number of chats to show
  };

  return (
    <div className="main-container">
      <div className="chat-display-options">
        <p className="options-label">How many chats do you want to display?</p>
        <div className="radio-buttons">
          <label>
            <input type="radio" name="numChats" value="3" checked={numChatsToShow === 3} onChange={handleRadioChange} />
            <b>3</b>
          </label>
          <label>
            <input type="radio" name="numChats" value="5" checked={numChatsToShow === 5} onChange={handleRadioChange} />
            <b>5</b>
          </label>
          <label>
            <input type="radio" name="numChats" value="7" checked={numChatsToShow === 7} onChange={handleRadioChange} />
            <b>7</b>
          </label>
        </div>
      </div>
      {chats.length === 0 ? (
        <div className="no-msgs-container">
          <p className="no-messages">No messages yet...</p>
        </div>
      ) : (
        chats.map((chat, index) => (
          <div key={index} className="chat-item" onClick={() => handleChooseChat(chat.title, index)}>
            <div className="message-name">
              <img className="chatbot-img" src={ChatbotImg} alt="Chatbot"></img>
              {chat.title}
            </div>
            <div className="right-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatbotPrevChats;
