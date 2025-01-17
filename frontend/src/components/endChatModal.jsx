import React from "react";

function EndChatModal({ isModalOpen, setIsModalOpen, setChats }) {
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const endChat = () => {
    localStorage.removeItem("chatbot_session_id"); // Clear the session ID
    setChats([]);
    toggleModal();
  };

  return (
    <div className={`modal ${isModalOpen ? "modal--open" : ""}`}>
      <div className="modal__content">
        <h3>Delete Chat History</h3>
        <p className="are-you-sure">
          Are you sure you want to delete all chat history?
        </p>
        <div className="modal__actions">
          <button className="btn btn--danger" onClick={endChat}>
            Delete history
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
