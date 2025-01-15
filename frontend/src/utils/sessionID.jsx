const getSessionId = () => {
  let sessionId = localStorage.getItem("chatbot_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    localStorage.setItem("chatbot_session_id", sessionId); // Persist in localStorage
  }
  return sessionId;
};

export default getSessionId;
