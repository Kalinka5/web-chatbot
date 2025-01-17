import React from "react";

import { IoIosHome } from "react-icons/io";
import { TbMessages } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";

function ChatbotNavbar({ activeButton, setActiveButton, setActivePage }) {
  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
    setActivePage(buttonName);
  };

  return (
    <div className="navbar">
      <button
        className={activeButton === "home" ? "active" : ""}
        onClick={() => handleClick("home")}
      >
        <IoIosHome className="icon" />
        <span>Home</span>
      </button>
      <button
        className={activeButton === "chats" ? "active" : ""}
        onClick={() => handleClick("chats")}
      >
        <TbMessages className="icon" />
        <span>Chats</span>
      </button>
      <button
        className={activeButton === "help" ? "active" : ""}
        onClick={() => handleClick("help")}
      >
        <IoIosHelpCircleOutline className="icon" />
        <span>Help</span>
      </button>
    </div>
  );
}

export default ChatbotNavbar;
