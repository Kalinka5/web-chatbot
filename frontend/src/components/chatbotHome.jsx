import React, { useEffect, useState } from "react";

import TyppingLoader from "./home/typping";
import MessageContainer from "./home/messageContainer";
import Message from "./home/message";
import SendMessage from "./home/sendMessage";
import StartChatButton from "./home/startChatButton";
import LatestChatNotification from "./home/latestChatNotification";

import api from "../api";

import "../styles/chatbotHome.css";

function ChatbotHome({
  userID,
  chats,
  setChats,
  isChatNew,
  setIsChatNew,
  lastChat,
  setLastChat,
  isChatEnded,
  handleNewChat,
  setIsEndChatButtonDisplayed,
  isChatboxActive,
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.log(isChatboxActive);
    if (chats.length === 0 || isChatNew) {
      handleNewChat(); // Start a new chat if no chats exist
    } else if (lastChat.chatTitle === null) {
      setLastChat(() => ({
        chatTitle: chats.at(0).title,
        chatIndex: 0,
        isInputEnabled: true,
        messages: chats.at(0).content, // Load previous chat
      }));
      setIsEndChatButtonDisplayed(true); // Show end chat button

      // Display a welcome message
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: [
          ...prevChat.messages,
          {
            name: "Chatbot",
            message:
              "Hello! 👋 I'm your virtual assistant, here to make things easier for you. 🧠\n\n" +
              "I can help you with questions, guide you through our features, or assist with anything else you need. 💡\n\n" +
              "Go ahead, ask me anything! 🤔",
          },
        ],
      }));
    } else {
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: [
          ...chats.at(lastChat.chatIndex).content, // Load previous chat messages
          {
            name: "Chatbot",
            message:
              "Hello! 👋 I'm your virtual assistant, here to make things easier for you. 🧠\n\n" +
              "I can help you with questions, guide you through our features, or assist with anything else you need. 💡\n\n" +
              "Go ahead, ask me anything! 🤔",
          },
        ],
      }));
    }
    setIsChatNew(false);
  }, []); // Dependency array ensures it runs only on mount

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

      // Move updated chat to the beginning of the list
      setChats((prevMessages) => {
        const updatedChats = [...prevMessages];

        // Find the chat being updated
        const chatIndex = updatedChats.findIndex((chat) => chat.title === lastChat.chatTitle);
        if (chatIndex !== -1) {
          updatedChats[chatIndex].content.unshift(newMessage); // Add new message to chat
          const updatedChat = updatedChats.splice(chatIndex, 1)[0]; // Remove from list
          updatedChats.unshift(updatedChat); // Move to beginning
        }

        return updatedChats;
      });
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const now = new Date();
    const dateTime = now.toString().replace(" G", ".").split(".")[0];

    const userMessage = { name: "User", message: inputMessage };
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
        `/predict/${window.chtlConfig.chatbotId}`,
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
      const botMessage = { name: "Chatbot", message: response.data.response };

      // Add bot response
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
      };

      // Add error message
      setLastChat((prevChat) => ({
        ...prevChat,
        messages: [errorMessage, ...prevChat.messages],
      }));
      addMessage(errorMessage);
    } finally {
      // Stop typing animation
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Show latest chat notification when page reloads */}
      {isChatboxActive && <LatestChatNotification />}

      <div className="gif-container">
        <div className="messages-container">
          <div className="chatbox__messages">
            {/* Show line of ended chat */}
            {isChatEnded && <div className="chat-ended-message">The chat has ended</div>}
            {/* Loading typping */}
            {isTyping && (
              <MessageContainer name="Chatbot">
                <TyppingLoader />
              </MessageContainer>
            )}
            {/* List of all messages */}
            {lastChat.messages.map((msg, index) => (
              <MessageContainer name={msg.name} key={index}>
                <Message message={msg.message} />
              </MessageContainer>
            ))}
          </div>
        </div>
      </div>
      {/* Input field and Send message button */}
      {lastChat.isInputEnabled && (
        <SendMessage lastChat={lastChat} inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} />
      )}
      {/* Display "Start new chat" button */}
      {isChatEnded && <StartChatButton onClick={handleNewChat} />}
    </>
  );
}

export default ChatbotHome;
