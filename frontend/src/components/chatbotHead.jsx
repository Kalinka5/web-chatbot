import React, { useState } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { BiMessageAdd } from "react-icons/bi";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { BiWindowOpen } from "react-icons/bi";

import assistant from "../images/assistant.png";

import "../styles/chatbotHead.css";

function ChatbotHeader({ onClickMinWindow, onClickEndChat, isEndChatButtonDisplayed, handleNewChat, isSoundOn, setIsSoundOn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSoundToggle = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsSoundOn(!isSoundOn);
  };

  const handlePopOut = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    // Add your pop out widget logic here
    setIsMenuOpen(false); // Close menu after action
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const closeMenu = (e) => {
      // Don't close if clicking inside the menu
      if (e.target.closest(".menu-dropdown")) {
        return;
      }
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  return (
    <div className="chatbox__header">
      <div className="img-name">
        <div className="chatbox__image">
          <img src={assistant} alt="Chat Support" />
        </div>
        <h4 className="chatbox__heading">AI Assistant</h4>
      </div>
      <div className="nav-buttons">
        <div className="block">
          <BsThreeDotsVertical className="dots nav-button" onClick={toggleMenu} />
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewChat();
                  setIsMenuOpen(false); // Close menu after creating new chat
                }}
              >
                <BiMessageAdd /> New Chat
              </button>
              <button onClick={handleSoundToggle}>
                {isSoundOn ? <IoVolumeHighOutline /> : <IoVolumeMuteOutline />}
                {isSoundOn ? "Sound On" : "Sound Off"}
              </button>
              <button onClick={handlePopOut}>
                <BiWindowOpen /> Pop Out Widget
              </button>
            </div>
          )}
        </div>
        <div>
          <FiMinus className="nav-button" onClick={onClickMinWindow} />
        </div>
        {isEndChatButtonDisplayed && (
          <div>
            <IoClose className="nav-button" onClick={onClickEndChat} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatbotHeader;
