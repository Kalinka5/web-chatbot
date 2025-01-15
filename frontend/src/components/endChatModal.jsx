import React from "react";

function EndChatModal({ isModalOpen, setIsModalOpen, setMessages }) {
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const endChat = () => {
    localStorage.removeItem("chatbot_session_id"); // Clear the session ID
    setMessages([]);
    toggleModal();
  };

  return (
    <div className={`modal ${isModalOpen ? "modal--open" : ""}`}>
      <div className="modal__content">
        <h3>End Chat</h3>
        <p className="are-you-sure">Are you sure you want to end this chat?</p>
        <div className="modal__actions">
          <button className="btn btn--danger" onClick={endChat}>
            End Chat
          </button>
          <button className="btn btn--cancel" onClick={toggleModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndChatModal;
