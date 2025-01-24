import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import assistant from "../images/assistant.png";

import api from "../api";

function ChatbotChatting({ userID, chats, setChats, lastChat, setLastChat, isSessionPrompt, setIsSessionPrompt }) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
        setLastChat((prevChat) => ({
          ...prevChat,
          messages: chats.at(lastChat.chatIndex).content,
        }));
      } else {
        handleNewChat(); // Start a new chat if no chats exist
      }

      // Display a welcome message
      displayAnimatedMessage("Hi there! 🌟 Welcome to our chat! How can I assist you today? 🚀");
    } else {
      // First page load or reload: show session prompt
      console.log("Displaying session prompt.");
      setIsSessionPrompt(true); // Show session prompt
      setLastChat((prevChat) => ({
        ...prevChat,
        isInputEnabled: false,
      })); // Disable input until a decision is made
    }

    return () => {
      // Cleanup to avoid memory leaks
      window.onbeforeunload = null;
    };
  }, []); // Dependency array ensures it runs only on mount

  const handlePreviousSession = () => {
    sessionStorage.setItem("hasSessionPrompt", "true");
    setIsSessionPrompt(false); // Hide session prompt
    setLastChat((prevChat) => ({
      ...prevChat,
      isInputEnabled: true,
    }));
    if (chats.length > 0) {
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: chats.at(lastChat.chatIndex).content, // Load previous chat
      }));
    }
    // Display a welcome message
    displayAnimatedMessage("Hi there! 🌟 Welcome to our chat! How can I assist you today? 🚀");
  };

  const handleNewChat = () => {
    // Start a new chat session
    const now = new Date();
    const formattedDate = now.toString().replace(" G", ".").split(".")[0]; // Format as "YYYY-MM-DD HH:MM:SS"
    const title = `Chat ${formattedDate}`;

    setLastChat(() => ({
      chatTitle: title,
      chatIndex: chats.length,
      messages: [],
      isInputEnabled: true,
    }));

    setChats((prevMessages) => [...prevMessages, { title: title, content: [] }]);
    setIsSessionPrompt(false); // Hide session prompt

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
    setLastChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, { name: "Chatbot", message: "" }],
    }));

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        currentMessage += fullMessage[index];
        setLastChat((prevChat) => {
          // Create a shallow copy of the existing messages array
          const updatedMessages = [...prevChat.messages];
          // Update the last message in the array
          updatedMessages[updatedMessages.length - 1] = {
            name: "Chatbot",
            message: currentMessage,
          };

          // Return the updated chat object
          return {
            ...prevChat, // Preserve other properties of the chat object
            messages: updatedMessages, // Update the messages property
          };
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
      title: lastChat.chatTitle,
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
        updatedMessages.at(lastChat.chatIndex).content.unshift(newMessage);
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
    setLastChat((prevChat) => ({
      ...prevChat,
      messages: [userMessage, ...prevChat.messages],
    }));
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
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: [botMessage, ...prevChat.messages],
      }));
      addMessage(botMessage);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        name: "Chatbot",
        message: "Oops! 🤖 I'm still a baby bot, learning to chat like a pro! 🍼💻 Could you try rephrasing your question for me? 🚀✨",
        start: false,
      };

      // Add error message and stop typing animation
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: [errorMessage, ...prevChat.messages],
      }));
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
            {lastChat.messages.map((msg, index) => (
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
      <div className={`input-button-container ${lastChat.isInputEnabled ? "show-input-button" : ""}`}>
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
