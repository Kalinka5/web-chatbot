import React from "react";

import "../styles/modalLimitation.css";

const ModalDeleteChat = ({ isOpen, onClose, headText, question, chatTitle, buttonText, onClick }) => {
  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{headText}</h3>
        <p className="are-you-sure">
          {question}
          <br />
          <i>"{chatTitle}"</i>?
        </p>
        <div className="modal__actions">
          <button className="btn danger" onClick={onClick}>
            {buttonText}
          </button>
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteChat;
