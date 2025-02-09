import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import ChatbotHeader from "./components/chatbotHead";
import ChatbotChats from "./components/chatbotChats";
import ChatbotHelp from "./components/chatbotHelp";
import ChatbotHome from "./components/chatbotHome";
import ChatbotNavbar from "./components/chatbotNavbar";
import ChatbotFooter from "./components/chatbotFoot";
import OpenChatButton from "./components/openChatButton";

import ChatModal from "./components/chatModal";
import ModalLimitation from "./components/modalLimitation";

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
  // Message that chat was ended
  const [isChatEnded, setIsChatEnded] = useState(false);
  // End chat button display
  const [isEndChatButtonDisplayed, setIsEndChatButtonDisplayed] = useState(false);
  // To handle new chat
  const [isChatNew, setIsChatNew] = useState(false);

  const [lastChat, setLastChat] = useState({
    chatTitle: null,
    chatIndex: -1,
    messages: [],
    isInputEnabled: false,
  });

  // Modals
  const [isEndChatModalOpen, setIsEndChatModalOpen] = useState(false);
  const [isDeleteChatsOpen, setIsDeleteChatsOpen] = useState(false);
  const [isAmountChatsOpen, setIsAmountChatsOpen] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId();
    setUserID(sessionId);
  }, []);

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
      const response = await api.delete(`/chats/${userID}/${window.chtlConfig.chatbotId}`);

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
    setIsEndChatButtonDisplayed(false); // Hide end chat button
    setIsEndChatModalOpen(false); // Close modal
    setActivePage("home");
  };

  const getChats = async () => {
    console.log(userID);

    try {
      const response = await api.get(`/chats/${userID}/${window.chtlConfig.chatbotId}`);
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
    if (chats.length >= 15) {
      setIsAmountChatsOpen(true); // Show modal when limit is reached
      return;
    }

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

    setChats((prevMessages) => [{ title: title, content: [] }, ...prevMessages]);
    setIsChatEnded(false);
    setIsEndChatButtonDisplayed(true); // Show end chat button
    setActivePage("home");

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
  };

  return (
    <div className={`chatbox ${isVisible ? "visible" : ""}`}>
      <div className={`chatbox__support ${isChatboxActive ? "active" : ""}`}>
        {/* Header */}
        <ChatbotHeader
          onClickMinWindow={toggleChatbox}
          onClickEndChat={() => {
            setIsEndChatModalOpen(true);
          }}
          isEndChatButtonDisplayed={isEndChatButtonDisplayed}
        />

        {/* Main Part */}
        <div className="main-container">
          {activePage === "home" && isVisible && (
            <ChatbotHome
              userID={userID}
              chats={chats}
              setChats={setChats}
              isChatNew={isChatNew}
              setIsChatNew={setIsChatNew}
              lastChat={lastChat}
              setLastChat={setLastChat}
              isChatEnded={isChatEnded}
              handleNewChat={handleNewChat}
              setIsEndChatButtonDisplayed={setIsEndChatButtonDisplayed}
              isChatboxActive={isChatboxActive}
            />
          )}
          {activePage === "chats" && (
            <ChatbotChats
              chats={chats}
              setChats={setChats}
              setLastChat={setLastChat}
              setActivePage={setActivePage}
              handleNewChat={handleNewChat}
              userID={userID}
              setIsChatNew={setIsChatNew}
              setIsDeleteChatsOpen={setIsDeleteChatsOpen}
              setIsEndChatButtonDisplayed={setIsEndChatButtonDisplayed}
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
        <ModalLimitation isOpen={isAmountChatsOpen} onClose={() => setIsAmountChatsOpen(false)} />
      </div>
      <OpenChatButton isChatboxActive={isChatboxActive} onClick={toggleChatbox} />
    </div>
  );
}

export default App;
