import React from "react";

import { IoIosHome } from "react-icons/io";
import { TbMessages } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";

import "../styles/chatbotNavbar.css";

function ChatbotNavbar({ activePage, setActivePage }) {
  return (
    <div className="navbar">
      <button className={activePage === "home" ? "active" : ""} onClick={() => setActivePage("home")}>
        <IoIosHome className="icon" />
        <span>Home</span>
      </button>
      <button className={activePage === "chats" ? "active" : ""} onClick={() => setActivePage("chats")}>
        <TbMessages className="icon" />
        <span>Chats</span>
      </button>
      <button className={activePage === "help" ? "active" : ""} onClick={() => setActivePage("help")}>
        <IoIosHelpCircleOutline className="icon" />
        <span>Help</span>
      </button>
    </div>
  );
}

export default ChatbotNavbar;
