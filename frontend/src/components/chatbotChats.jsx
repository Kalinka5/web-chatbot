import React, { useState, useEffect } from "react";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDeleteOutline } from "react-icons/md";

import ChatbotImg from "../images/chatbot.png";

import ModalDeleteChat from "./modalDeleteChat";

import api from "../api";

import "../styles/chatbotChats.css";

function ChatbotChats({ chats, setChats, setLastChat, setActivePage, handleNewChat, userID, setIsDeleteChatsOpen, setIsEndChatButtonDisplayed }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [chatTitle, setChatTitle] = useState("");

  const [isDeleteOneChatOpen, setIsDeleteOneChatOpen] = useState(false);

  const itemsPerPage = 5; // Display 5 chats per pag

  // Get only the 5 chats for the current page
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const paginatedChats = chats.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setTotalPages(Math.ceil(chats.length / itemsPerPage));
  }, [chats]);

  const handlePrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const handleChooseChat = (chatTitle, index) => {
    // Calculate the actual index based on the current page
    const actualIndex = (pageNumber - 1) * itemsPerPage + index;

    console.log(actualIndex);
    setLastChat((prevChat) => ({
      ...prevChat,
      chatTitle: chatTitle,
      chatIndex: actualIndex,
      isInputEnabled: true,
    }));
    setIsEndChatButtonDisplayed(true);
    setActivePage("home");
  };

  const handleDeleteChat = async () => {
    try {
      const response = await api.delete(`/chats/${userID}/${window.chtlConfig.chatbotId}/${encodeURIComponent(chatTitle)}`);

      if (response.data.ok) {
        console.log(`Chat "${chatTitle}" deleted successfully.`);
        setChats((prevChats) => prevChats.filter((chat) => chat.title !== chatTitle)); // Remove from state

        setIsDeleteOneChatOpen(false); // Close the modal

        // If deleting the last item on the page, move to previous page
        if (paginatedChats.length === 1 && pageNumber > 1) {
          setPageNumber(pageNumber - 1);
        }
      } else {
        console.log("Failed to delete chat.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const DeleteAllChats = () => {
    setIsDeleteChatsOpen(true);
  };

  const DeleteOneChat = (chatTitle) => {
    setChatTitle(chatTitle);
    setIsDeleteOneChatOpen(true);
  };

  return (
    <>
      <div className="chat-display-options">
        <div className="title-container">
          <span className="chat-display-title">Previous Chats</span>
        </div>
        <div className="buttons-container">
          <button className="chat-button new-chat" onClick={handleNewChat}>
            +
          </button>
          <button className="chat-button delete-chats" onClick={DeleteAllChats} disabled={chats.length === 0}>
            <MdDeleteOutline />
          </button>
        </div>
      </div>
      {chats.length === 0 ? (
        <div className="chats-container no-msgs-container">
          <p className="no-messages">No chats yet...</p>
        </div>
      ) : (
        <div className="chats-container">
          {paginatedChats.map((chat, index) => (
            <div key={index} className="chat-item">
              <div className="message-name" onClick={() => handleChooseChat(chat.title, index)}>
                <img className="chatbot-img" src={ChatbotImg} alt="Chatbot" />
                {chat.title}
              </div>

              <div className="chat-actions">
                {/* Delete Button */}
                <button className="delete-chat-button" onClick={() => DeleteOneChat(chat.title)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2V1H10V2H13V3H3V2H6ZM4 4V14C4 14.55 4.45 15 5 15H11C11.55 15 12 14.55 12 14V4H4Z" fill="currentColor" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <div className="right-arrow" onClick={() => handleChooseChat(chat.title, index)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="chats-pagination">
        <button className="pagination-button prev-page" onClick={handlePrevPage} disabled={pageNumber === 1}>
          <MdKeyboardArrowLeft />
        </button>
        <span className="page-number">{pageNumber}</span>
        <button className="pagination-button next-page" onClick={handleNextPage} disabled={pageNumber >= totalPages}>
          <MdKeyboardArrowRight />
        </button>
      </div>

      {/* Modals */}
      <ModalDeleteChat
        isOpen={isDeleteOneChatOpen}
        onClose={() => setIsDeleteOneChatOpen(false)}
        headText="Delete Chat"
        question={`Are you sure you want to delete`}
        chatTitle={chatTitle}
        buttonText="Delete chat"
        onClick={handleDeleteChat}
        setIsModalOpen={isDeleteOneChatOpen}
        isModalOpen={setIsDeleteChatsOpen}
      />
    </>
  );
}

export default ChatbotChats;
