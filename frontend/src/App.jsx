import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import ChatbotHeader from "./components/chatboxHead";
import ChatbotHome from "./components/chatbotHome";
import ChatbotMessages from "./components/chatbotMessages";
import ChatbotHelp from "./components/chatbotHelp";
import ChatbotChatting from "./components/chatbotChatting";
import ChatbotNavbar from "./components/chatbotNavbar";
import ChatbotFooter from "./components/chatbotFoot";
import EndChatModal from "./components/endChatModal";
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
  const [messages, setMessages] = useState([]);

  const [isChatNew, setIsChatNew] = useState(false);
  const [chatTitle, setChatTitle] = useState(null);
  const [chatIndex, setChatIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeButton, setActiveButton] = useState("home");
  const [activePage, setActivePage] = useState("home");

  const isLoggedIn = false;

  useEffect(() => {
    const sessionId = isLoggedIn ? "TestUser" : getSessionId();
    setUserID(sessionId);
  }, [isLoggedIn]);

  useEffect(() => {
    if (userID) {
      getMessages().then((data) => {
        data && setMessages(data);
      });
    }
  }, [userID]);

  const getMessages = async () => {
    console.log(userID);

    try {
      const response = await api.get(`/messages/${userID}`);
      console.log(response);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      console.log("Response from server:", data);
      return data.messages;
    } catch (error) {
      console.error("Error posting message:", error);
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
        {/* Header */}
        <ChatbotHeader
          setIsVisible={setIsVisible}
          isChatboxActive={isChatboxActive}
          setIsChatboxActive={setIsChatboxActive}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        {/* Main Part */}
        {activePage === "home" && (
          <ChatbotHome
            setActiveButton={setActiveButton}
            setActivePage={setActivePage}
            messages={messages}
            setIsChatNew={setIsChatNew}
          />
        )}
        {activePage === "messages" && (
          <ChatbotMessages
            messages={messages}
            setChatTitle={setChatTitle}
            setChatIndex={setChatIndex}
            setActivePage={setActivePage}
          />
        )}
        {activePage === "help" && <ChatbotHelp />}
        {activePage === "chatting" && (
          <ChatbotChatting
            userID={userID}
            messages={messages}
            setMessages={setMessages}
            chatTitle={chatTitle}
            setChatTitle={setChatTitle}
            chatIndex={chatIndex}
            setChatIndex={setChatIndex}
            isChatNew={isChatNew}
            setIsChatNew={setIsChatNew}
          />
        )}

        {/* Navigation Bar */}
        <ChatbotNavbar
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setActivePage={setActivePage}
        />

        {/* Footer */}
        <ChatbotFooter />

        {/* Modals */}
        <EndChatModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setMessages={setMessages}
        />
      </div>
      <OpenChatButton
        isChatboxActive={isChatboxActive}
        setIsChatboxActive={setIsChatboxActive}
        setIsVisible={setIsVisible}
      />
    </div>
  );
}

export default App;
