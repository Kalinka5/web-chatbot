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
  const [numChatsToShow, setNumChatsToShow] = useState(5); // Default to 5 chats
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
          setChats(data.slice(-numChatsToShow, data.length));
        }
        setIsVisible(true);
      });
    }
  }, [userID, numChatsToShow]);

  const toggleChatbox = () => {
    setIsChatboxActive(!isChatboxActive); // Trigger open animation
  };

  const clearChats = () => {
    localStorage.removeItem("chatbot_session_id"); // Clear the session ID
    setChats([]);
    setIsDeleteChatsOpen(!isDeleteChatsOpen);
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

  return (
    <div className={`chatbox ${isVisible ? "visible" : ""}`}>
      <div className={`chatbox__support ${isChatboxActive ? "chatbox--active" : ""}`}>
        {/* Header */}
        <ChatbotHeader onClick={toggleChatbox} isModalOpen={isEndChatModalOpen} setIsModalOpen={setIsEndChatModalOpen} />

        {/* Main Part */}
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
          />
        )}
        {activePage === "chats" && (
          <ChatbotPrevChats
            chats={chats}
            setLastChat={setLastChat}
            setActivePage={setActivePage}
            numChatsToShow={numChatsToShow}
            setNumChatsToShow={setNumChatsToShow}
            setIsSessionPrompt={setIsSessionPrompt}
          />
        )}
        {activePage === "help" && <ChatbotHelp />}

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
          question="Are you sure you want to delete all chat history?"
          buttonText="Delete history"
        />
      </div>
      <OpenChatButton isChatboxActive={isChatboxActive} onClick={toggleChatbox} />
    </div>
  );
}

export default App;
