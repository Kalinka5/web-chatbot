import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import ChatbotHeader from "./components/chatbotHead";
import ChatbotPrevChats from "./components/chatbotPrevChats";
import ChatbotHelp from "./components/chatbotHelp";
import ChatbotChatting from "./components/chatbotChatting";
import ChatbotNavbar from "./components/chatbotNavbar";
import ChatbotFooter from "./components/chatbotFoot";
import ChatModal from "./components/ChatModal";
import OpenChatButton from "./components/openChatButton";

import getSessionId from "./utils/sessionID";
import displayAnimatedMessage from "./utils/animatedMessage";

import api from "./api";

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
  const [userID, setUserID] = useState("");

  // Display main part of Chat bot
  const [isChatboxActive, setIsChatboxActive] = useState(false);
  // Display Open/Close Chat bot button when chats was gotten
  const [isVisible, setIsVisible] = useState(false);

  const [activePage, setActivePage] = useState("home"); // Main page
  const [chats, setChats] = useState([]);
  // Control reloading page (Previous session or new chat)
  const [isSessionPrompt, setIsSessionPrompt] = useState(false);
  // Message that chat was ended
  const [isChatEnded, setIsChatEnded] = useState(false);

  const [lastChat, setLastChat] = useState({
    chatTitle: null,
    chatIndex: -1,
    messages: [],
    isInputEnabled: false,
  });

  const [isEndChatModalOpen, setIsEndChatModalOpen] = useState(false);
  const [isDeleteChatsOpen, setIsDeleteChatsOpen] = useState(false);

  const isLoggedIn = false; // In future

  useEffect(() => {
    const sessionId = isLoggedIn ? "TestUser" : getSessionId();
    setUserID(sessionId);
  }, [isLoggedIn]);

  useEffect(() => {
    if (userID) {
      getChats().then((data) => {
        if (data) {
          setChats(data);
        }
        setIsVisible(true);
      });
    }
  }, [userID]);

  const toggleChatbox = () => {
    setIsChatboxActive(!isChatboxActive); // Trigger open animation
  };

  const clearChats = async () => {
    try {
      const response = await api.delete(`/chats/${userID}`);

      if (response.data.ok) {
        console.log("All chats deleted successfully.");
        setChats([]); // Clear all chats
        setIsDeleteChatsOpen(false); // Close the modal
      } else {
        console.log("Failed to delete chats.");
      }
    } catch (error) {
      console.error("Error deleting chats:", error);
    }
  };

  const endChat = () => {
    setLastChat((previous) => ({
      ...previous,
      isInputEnabled: false,
    }));
    setIsChatEnded(true); // Show ended message
    setIsEndChatModalOpen(false); // Close modal
    setActivePage("home");
  };

  const getChats = async () => {
    console.log(userID);

    try {
      const response = await api.get(`/chats/${userID}`);
      console.log(response);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      console.log("Response from server:", data);
      return data.chats;
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleNewChat = () => {
    // Start a new chat session
    const now = new Date();
    const formattedDate = now.toString().replace(" G", ".").split(".")[0]; // Format as "YYYY-MM-DD HH:MM:SS"
    const title = `Chat ${formattedDate}`;

    setLastChat(() => ({
      chatTitle: title,
      chatIndex: 0,
      messages: [],
      isInputEnabled: true,
    }));

    sessionStorage.setItem("hasSessionPrompt", "true");
    setChats((prevMessages) => [{ title: title, content: [] }, ...prevMessages]);
    setIsSessionPrompt(false); // Hide session prompt
    setIsChatEnded(false);
    setActivePage("home");

    // Display a welcome message
    displayAnimatedMessage({
      fullMessage:
        "Hello! 👋 I'm your virtual assistant, here to make things easier for you. 🧠\n\n" +
        "I can help you with questions, guide you through our features, or assist with anything else you need. 💡\n\n" +
        "Go ahead, ask me anything! 🤔",
      setLastChat,
    });
  };

  return (
    <div className={`chatbox ${isVisible ? "visible" : ""}`}>
      <div className={`chatbox__support ${isChatboxActive ? "active" : ""}`}>
        {/* Header */}
        <ChatbotHeader onClick={toggleChatbox} isModalOpen={isEndChatModalOpen} setIsModalOpen={setIsEndChatModalOpen} />

        {/* Main Part */}
        <div className="main-container">
          {activePage === "home" && isVisible && (
            <ChatbotChatting
              userID={userID}
              chats={chats}
              setChats={setChats}
              lastChat={lastChat}
              setLastChat={setLastChat}
              isSessionPrompt={isSessionPrompt}
              setIsSessionPrompt={setIsSessionPrompt}
              isChatEnded={isChatEnded}
              setIsChatEnded={setIsChatEnded}
              handleNewChat={handleNewChat}
            />
          )}
          {activePage === "chats" && (
            <ChatbotPrevChats
              chats={chats}
              setChats={setChats}
              setLastChat={setLastChat}
              setActivePage={setActivePage}
              setIsSessionPrompt={setIsSessionPrompt}
              handleNewChat={handleNewChat}
              userID={userID}
              setIsDeleteChatsOpen={setIsDeleteChatsOpen}
            />
          )}
          {activePage === "help" && <ChatbotHelp />}
        </div>

        {/* Navigation Bar */}
        <ChatbotNavbar activePage={activePage} setActivePage={setActivePage} />

        {/* Footer */}
        <ChatbotFooter poweredBy="Daniil Kalinevych" />

        {/* Modals */}
        <ChatModal
          isModalOpen={isEndChatModalOpen}
          setIsModalOpen={setIsEndChatModalOpen}
          onClick={endChat}
          headText="End Chat"
          question="Are you sure you want to end this chat?"
          buttonText="End chat"
        />
        <ChatModal
          isModalOpen={isDeleteChatsOpen}
          setIsModalOpen={setIsDeleteChatsOpen}
          onClick={clearChats}
          headText="Delete Chat History"
          question="Are you sure want to delete all chat history?"
          buttonText="Delete history"
        />
      </div>
      <OpenChatButton isChatboxActive={isChatboxActive} onClick={toggleChatbox} />
    </div>
  );
}

export default App;
