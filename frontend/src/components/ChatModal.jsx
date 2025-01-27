import React from "react";

import "../styles/chatModal.css";

function ChatModal({ isModalOpen, setIsModalOpen, onClick, headText, question, buttonText }) {
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={`modal ${isModalOpen ? "open" : ""}`}>
      <div className="modal__content">
        <h3>{headText}</h3>
        <p className="are-you-sure">{question}</p>
        <div className="modal__actions">
          <button className="btn danger" onClick={onClick}>
            {buttonText}
          </button>
          <button className="btn cancel" onClick={toggleModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
