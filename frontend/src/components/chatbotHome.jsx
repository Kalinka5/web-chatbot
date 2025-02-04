import React, { useEffect, useState } from "react";

import TyppingLoader from "./home/typping";
import MessageContainer from "./home/messageContainer";
import Message from "./home/message";
import NotificationMessage from "./home/notificationMessage";
import LastChatsMessage from "./home/lastChatsMessage";
import SendMessage from "./home/sendMessage";
import StartChatButton from "./home/startChatButton";

import api from "../api";

import "../styles/chatbotHome.css";

function ChatbotHome({ userID, chats, setChats, lastChat, setLastChat, isSessionPrompt, setIsSessionPrompt, isChatEnded, handleNewChat }) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLastChatsVisible, setIsLastChatsVisible] = useState(false);

  useEffect(() => {
    console.log(isSessionPrompt);
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
        ], // Add a new empty message for typing
      }));
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

  const handlePreviousChats = () => {
    setIsSessionPrompt(false);
    setIsLastChatsVisible(true); // Show last chats section
  };

  const handleChooseChat = (chatTitle, chatIndex) => {
    sessionStorage.setItem("hasSessionPrompt", "true");
    setIsLastChatsVisible(false);
    setLastChat((prevChat) => ({
      ...prevChat,
      chatTitle: chatTitle,
      chatIndex: chatIndex,
      isInputEnabled: true,
      messages: chats.at(chatIndex).content, // Load previous chat
    }));
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
      ], // Add a new empty message for typing
    }));
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

            {/* Show notification each rerender of component (Previous chats or new chat) */}
            {!isChatEnded && isSessionPrompt && <NotificationMessage chats={chats} handleNewChat={handleNewChat} handlePreviousChats={handlePreviousChats} />}

            {/* Last Chats Section */}
            {isLastChatsVisible && (
              <LastChatsMessage
                chats={chats}
                setIsLastChatsVisible={setIsLastChatsVisible}
                setIsSessionPrompt={setIsSessionPrompt}
                handleChooseChat={handleChooseChat}
              />
            )}

            {/* List of all messages */}
            {!isSessionPrompt &&
              !isLastChatsVisible &&
              lastChat.messages.map((msg, index) => (
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
