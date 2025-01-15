import React from "react";

function ChatbotHome({
  setActiveButton,
  setActivePage,
  messages,
  setIsChatNew,
}) {
  const handlePrevChat = () => {
    setActiveButton("messages");
    setActivePage("messages");
    setIsChatNew(false);
  };

  const handleNewChat = () => {
    setActiveButton("messages");
    setActivePage("chatting");
    setIsChatNew(true);
  };

  return (
    <div className="main-container">
      <div className="intro-text">
        <div className="blur-effect">
          <div className="text-container animation">
            <h2 className="text blue">Hello, I'm an AI Assistant 🤖</h2>
            <h3 className="text light-blue">
              I can help you with all information about Kaidu platform 📚
            </h3>
          </div>
          <h3 className="text question-text animation">
            Let’s get to it! Ask me anything, ❓
            <br /> and I'll find the answers ❓
          </h3>
          <div className="buttons-container animation">
            {messages.length === 0 ? (
              <>
                <p className="text center blue">
                  <i>
                    Feel free to ask your questions, and I'll do my best to
                    help. What’s on your mind?
                  </i>
                </p>
                <button className="nav-button" onClick={handleNewChat}>
                  New Chat
                </button>
              </>
            ) : (
              <>
                <p className="text center blue">
                  Do you want continue with your previous session or start a new
                  chat?
                </p>
                <button className="nav-button" onClick={handlePrevChat}>
                  Previous Session
                </button>
                <button className="nav-button" onClick={handleNewChat}>
                  New Chat
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotHome;
