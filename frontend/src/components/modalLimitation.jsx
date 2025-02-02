import React from "react";

import "../styles/modalLimitation.css";

const ModalLimitation = ({ isOpen, onClose }) => {
  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Chat Limit Reached</h2>
        <p>You can't create more than 15 chats.</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ModalLimitation;
