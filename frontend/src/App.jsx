import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import assistant from "./images/assistant.png";
import chatBotIcon from "./images/chatbox-icon.svg";
import closeChatBotIcon from "./images/close-icon.svg";

import "./App.css";

const initializeChatWidget = (config) => {
  const rootElement = document.createElement("div");
  rootElement.id = "chat-widget-root";
  document.body.appendChild(rootElement);

  const root = ReactDOM.createRoot(rootElement); // Use createRoot
  root.render(<App {...config} />);
};

window.ChatWidget = { initialize: initializeChatWidget };

function App() {
  const [isChatboxActive, setIsChatboxActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getMessages().then((data) => {
      setMessages(data.reverse());
    });
    console.log(messages);
  }, []);

  const getSessionId = () => {
    let sessionId = localStorage.getItem("chatbot_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem("chatbot_session_id", sessionId); // Persist in localStorage
    }
    return sessionId;
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const endChat = () => {
    localStorage.removeItem("chatbot_session_id"); // Clear the session ID
    setMessages([]);
    toggleModal();
  };

  const toggleChatbox = () => {
    if (!isChatboxActive) {
      setIsVisible(true); // Ensure chatbox is visible before animation
      setTimeout(() => setIsChatboxActive(true), 0); // Trigger open animation
    } else {
      setIsChatboxActive(false); // Trigger close animation
      setTimeout(() => setIsVisible(false), 300); // Hide after animation completes
    }
  };

  const getMessages = async () => {
    const sessionId = getSessionId(); // Replace with dynamic user ID if needed
    const url = `http://127.0.0.1:8000/messages/${sessionId}`;

    try {
      const response = await fetch(url, {
        method: "GET", // Specify HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);
      return data.messages;
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const addMessage = async (message) => {
    const sessionId = getSessionId(); // Replace with dynamic user ID if needed
    const url = `http://127.0.0.1:8000/messages/${sessionId}`;

    try {
      const response = await fetch(url, {
        method: "POST", // Specify HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify([message]), // Convert the message object to a JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from server:", data.detail);
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { name: "User", message: inputMessage };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    addMessage(userMessage);

    const botTypping = {
      name: "Chatbot",
      message: (
        <div className="is-typing">
          <div className="jump1"></div>
          <div className="jump2"></div>
          <div className="jump3"></div>
          <div className="jump4"></div>
          <div className="jump5"></div>
        </div>
      ),
    };
    setMessages((prevMessages) => [botTypping, ...prevMessages]);

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: JSON.stringify({ message: inputMessage }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
        const botMessage = { name: "Chatbot", message: data.response };

        // Remove the loading message and add the bot's actual response
        setMessages((prevMessages) => {
          const [, ...updatedMessages] = prevMessages; // Remove the first message
          return [botMessage, ...updatedMessages]; // Add the new message
        });
        addMessage(botMessage);
      })
      .catch((error) => {
        console.error("Error:", error);

        const botMessage = {
          name: "Chatbot",
          message: "Sorry, something went wrong.",
        };

        // Remove the loading message and add an error message
        setMessages((prevMessages) => {
          const [, ...updatedMessages] = prevMessages; // Remove the first message
          return [botMessage, ...updatedMessages];
        });
        addMessage(botMessage);
      });

    setInputMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbox">
      <div
        className={`chatbox__support ${
          isChatboxActive ? "chatbox--active" : ""
        }`}
        style={{ zIndex: isVisible ? 123456 : -1 }}
      >
        <div className="chatbox__header">
          <div className="img-name">
            <div className="chatbox__image--header">
              <img src={assistant} alt="Chat Support" />
            </div>
            <h4 className="chatbox__heading--header">Chat support</h4>
          </div>
          <div className="nav-buttons">
            <div className="block">
              <svg
                className="block dots nav-button"
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </div>
            <div>
              <svg
                className="block nav-button"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={toggleChatbox}
              >
                <path d="M5 12h14"></path>
              </svg>
            </div>
            <div>
              <svg
                className="block nav-button"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={toggleModal}
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="messages-container">
            <div className="chatbox__messages">
              {messages.map((msg, index) => (
                <div className="message" key={index}>
                  {msg.name === "Chatbot" ? (
                    <img src={assistant} alt="Chat Support" />
                  ) : (
                    <div></div>
                  )}
                  <div
                    className={`messages__item ${
                      msg.name === "Chatbot"
                        ? "messages__item--visitor"
                        : "messages__item--operator"
                    }`}
                  >
                    {Array.isArray(msg.message) ? (
                      msg.message.map((msgContent, i) => (
                        <p key={i}>{msgContent}</p>
                      ))
                    ) : (
                      <p>{msg.message}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="message">
                <img src={assistant} alt="Chat Support" />
                <div className="messages__item messages__item--visitor">
                  <p className="chatbot-message">Hello, I'm a Chatbot. 🤖</p>
                  <p className="chatbot-message">
                    I can help you with all information about Kaidu platform. 📚
                  </p>
                  <p className="chatbot-message">Ask me a question. ❓</p>
                </div>
              </div>
            </div>
          </div>
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
        </div>
        <div className="chatbox__footer">
          <p className="powered">
            Powered by <a href="#">Daniil Kalinevych</a>
          </p>
        </div>
        {/* Modal */}
        <div className={`modal ${isModalOpen ? "modal--open" : ""}`}>
          <div className="modal__content">
            <h3>End Chat</h3>
            <p className="are-you-sure">
              Are you sure you want to end this chat?
            </p>
            <div className="modal__actions">
              <button className="btn btn--danger" onClick={endChat}>
                End Chat
              </button>
              <button className="btn btn--cancel" onClick={toggleModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="chatbox__button">
        <button className="open-chat-button" onClick={toggleChatbox}>
          <img
            src={isChatboxActive ? closeChatBotIcon : chatBotIcon}
            alt="Open Chatbox"
          />
        </button>
      </div>
    </div>
  );
}

export default App;
