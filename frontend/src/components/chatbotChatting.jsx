import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import assistant from "../images/assistant.png";

import api from "../api";

function ChatbotChatting({ userID, chats, setChats, chatTitle, setChatTitle, chatIndex, setChatIndex, isSessionPrompt, setIsSessionPrompt }) {
  const [listMessages, setListMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState(true);

  useEffect(() => {
    // Clear session prompt state on reload
    window.onbeforeunload = () => {
      sessionStorage.removeItem("hasSessionPrompt");
    };

    // Check if session prompt has already been shown
    const hasSessionPrompt = sessionStorage.getItem("hasSessionPrompt");

    if (hasSessionPrompt) {
      // If the session prompt was already shown, load the chat or start a new session
      console.log("Session prompt already handled.");
      if (chats.length > 0) {
        setListMessages(chats.at(chatIndex).content); // Load previous chat
      } else {
        handleNewChat(); // Start a new chat if no chats exist
      }

      // Display a welcome message
      displayAnimatedMessage("Hi there! 🌟 Welcome to our chat! How can I assist you today? 🚀");
    } else {
      // First page load or reload: show session prompt
      console.log("Displaying session prompt.");
      setIsSessionPrompt(true); // Show session prompt
      setIsInputEnabled(false); // Disable input until a decision is made
    }

    return () => {
      // Cleanup to avoid memory leaks
      window.onbeforeunload = null;
    };
  }, []); // Dependency array ensures it runs only on mount

  const handlePreviousSession = () => {
    sessionStorage.setItem("hasSessionPrompt", "true");
    setIsSessionPrompt(false); // Hide session prompt
    setIsInputEnabled(true); // Show input field with Send button
    if (chats.length > 0) {
      setListMessages(chats.at(chatIndex).content); // Load previous chat
    }
    // Display a welcome message
    displayAnimatedMessage("Hi there! 🌟 Welcome to our chat! How can I assist you today? 🚀");
  };

  const handleNewChat = () => {
    // Start a new chat session
    const now = new Date();
    const formattedDate = now.toString().replace(" G", ".").split(".")[0]; // Format as "YYYY-MM-DD HH:MM:SS"
    const title = `Chat ${formattedDate}`;

    setChatTitle(title);
    setChatIndex(chats.length);
    setChats((prevMessages) => [...prevMessages, { title: title, content: [] }]);
    setListMessages([]);
    setIsSessionPrompt(false); // Hide session prompt
    setIsInputEnabled(true); // Enable input

    // Display a welcome message
    displayAnimatedMessage(
      "Hello! 👋 I'm your virtual assistant, here to make things easier for you. 🧠\n\n" +
        "I can help you with questions, guide you through our features, or assist with anything else you need. 💡\n\n" +
        "Go ahead, ask me anything! 🤔"
    );
  };

  const displayAnimatedMessage = (fullMessage) => {
    let currentMessage = "";
    let index = 0;

    // Insert a placeholder for the animated starting message at the top
    setListMessages((prevMessages) => [
      ...prevMessages, // Keep existing messages below
      { name: "Chatbot", message: "" }, // Placeholder for animation
    ]);

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        currentMessage += fullMessage[index];
        setListMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { name: "Chatbot", message: currentMessage }; // Update only the first message
          return updatedMessages;
        });
        index++;
      } else {
        clearInterval(interval); // Stop the interval when the full message is typed
      }
    }, 50); // Adjust typing speed as needed
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const addMessage = async (newMessage) => {
    const requestData = {
      title: chatTitle,
      content: newMessage,
    };
    console.log(requestData);

    try {
      const response = await api.post(`/chats/${userID}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      console.log("Response from server:", data.detail);

      // Update the main messages array
      setChats((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.at(chatIndex).content.unshift(newMessage);
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const now = new Date();
    const dateTime = now.toString().replace(" G", ".").split(".")[0];

    const userMessage = { name: "User", message: inputMessage, start: false };
    setListMessages((prevMessages) => [userMessage, ...prevMessages]);
    addMessage(userMessage);

    setInputMessage("");

    // Show typing animation
    setIsTyping(true);

    try {
      const response = await api.post(
        "/predict",
        {
          message: inputMessage,
          datetime: dateTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const botMessage = { name: "Chatbot", message: response.data.response, start: false };

      // Add bot response and stop typing animation
      setListMessages((prevMessages) => [botMessage, ...prevMessages]);
      addMessage(botMessage);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        name: "Chatbot",
        message: "Oops! 🤖 I'm still a baby bot, learning to chat like a pro! 🍼💻 Could you try rephrasing your question for me? 🚀✨",
        start: false,
      };

      // Add error message and stop typing animation
      setListMessages((prevMessages) => [errorMessage, ...prevMessages]);
      addMessage(errorMessage);
    } finally {
      // Stop typing animation and clear input
      setIsTyping(false);
    }
  };

  return (
    <div className="main-container">
      <div className="gif-container">
        <div className="messages-container">
          <div className="chatbox__messages">
            {isTyping && (
              <div className="message">
                <img src={assistant} alt="Chat Support" />
                <div className="messages__item messages__item--visitor">
                  <div className="is-typing">
                    <div className="jump1"></div>
                    <div className="jump2"></div>
                    <div className="jump3"></div>
                    <div className="jump4"></div>
                    <div className="jump5"></div>
                  </div>
                </div>
              </div>
            )}
            {isSessionPrompt && (
              <div className="start-message-container">
                <div className="start-message-card">
                  <p className="start-message-text">
                    Do you want to continue with your <b>previous session</b> or <b>start a new chat</b>? ⬇️
                  </p>
                  <div className="session-buttons">
                    {chats.length === 0 ? (
                      <button className="button new-chat" onClick={handleNewChat}>
                        New Chat
                      </button>
                    ) : (
                      <>
                        <button className="button" onClick={handlePreviousSession}>
                          Previous Session
                        </button>
                        <button className="button" onClick={handleNewChat}>
                          New Chat
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {listMessages.map((msg, index) => (
              <div className="message" key={index}>
                {msg.name === "Chatbot" && !msg.start ? <img src={assistant} alt="Chat Support" /> : <div></div>}
                <div className={`messages__item ${msg.name === "Chatbot" ? "messages__item--visitor" : "messages__item--operator"}`}>
                  {typeof msg.message === "string" ? (
                    msg.message.includes("\n") ? (
                      msg.message.split("\n").map((msgContent, i) => (
                        <div className="message-list" key={i}>
                          <ReactMarkdown>{msgContent}</ReactMarkdown>
                          {i !== msg.message.split("\n").length - 1 && <p style={{ margin: "16px 0" }}></p>}
                        </div>
                      ))
                    ) : (
                      <div className="message-list">
                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`input-button-container ${isInputEnabled ? "show-input-button" : ""}`}>
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
  );
}

export default ChatbotChatting;
