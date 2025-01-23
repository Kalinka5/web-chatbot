import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import ChatbotHeader from "./components/chatbotHead";
import ChatbotHome from "./components/chatbotHome";
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

  const [isChatboxActive, setIsChatboxActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chats, setChats] = useState([]);

  const [numChatsToShow, setNumChatsToShow] = useState(5); // Default to 5 chats

  const [chatTitle, setChatTitle] = useState(null);
  const [chatIndex, setChatIndex] = useState(-1);

  const [isEndChatModalOpen, setIsEndChatModalOpen] = useState(false);
  const [isDeleteChatsOpen, setIsDeleteChatsOpen] = useState(false);
  const [isSessionPrompt, setIsSessionPrompt] = useState(false);

  const [activeButton, setActiveButton] = useState("home");
  const [activePage, setActivePage] = useState("home");

  const isLoggedIn = false;

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

  const toggleModal = ({ isModalOpen, onHandle }) => {
    onHandle(!isModalOpen);
  };

  const clearChats = (isDeleteChatsOpen, setIsDeleteChatsOpen) => {
    localStorage.removeItem("chatbot_session_id"); // Clear the session ID
    setChats([]);
    toggleModal(isDeleteChatsOpen, setIsDeleteChatsOpen);
  };

  const endChat = () => {
    console.log("Ending Chat...");
    // sessionStorage.removeItem("hasSessionPrompt"); // Reset session prompt
    // setIsSessionPrompt(true); // Show session prompt
    // setIsEndChatModalOpen(false); // Close modal
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
        <ChatbotHeader
          isChatboxActive={isChatboxActive}
          setIsChatboxActive={setIsChatboxActive}
          isModalOpen={isEndChatModalOpen}
          setIsModalOpen={setIsEndChatModalOpen}
        />

        {/* Main Part */}
        {activePage === "home" && isVisible && (
          <ChatbotChatting
            userID={userID}
            chats={chats}
            setChats={setChats}
            chatTitle={chatTitle}
            setChatTitle={setChatTitle}
            chatIndex={chatIndex}
            setChatIndex={setChatIndex}
            isSessionPrompt={isSessionPrompt}
            setIsSessionPrompt={setIsSessionPrompt}
          />
        )}
        {activePage === "chats" && (
          <ChatbotPrevChats
            chats={chats}
            setChatTitle={setChatTitle}
            setChatIndex={setChatIndex}
            setActivePage={setActivePage}
            setActiveButton={setActiveButton}
            numChatsToShow={numChatsToShow}
            setNumChatsToShow={setNumChatsToShow}
            setIsSessionPrompt={setIsSessionPrompt}
          />
        )}
        {activePage === "help" && <ChatbotHelp />}

        {/* Navigation Bar */}
        <ChatbotNavbar activeButton={activeButton} setActiveButton={setActiveButton} setActivePage={setActivePage} />

        {/* Footer */}
        <ChatbotFooter />

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
      <OpenChatButton isChatboxActive={isChatboxActive} setIsChatboxActive={setIsChatboxActive} />
    </div>
  );
}

export default App;
