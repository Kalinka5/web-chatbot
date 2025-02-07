const displayTyppingMessage = ({ fullMessage, setLastChat }) => {
  let index = 0;

  setLastChat((prevChat) => ({
    ...prevChat,
    messages: [...prevChat.messages, { name: "Chatbot", message: "" }],
  }));

  const interval = setInterval(() => {
    setLastChat((prevChat) => {
      const updatedMessages = [...prevChat.messages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      if (index < fullMessage.length) {
        // Only update the message progressively
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          message: fullMessage.slice(0, index + 1), // Instead of accumulating, slice only the current text
        };
        index++;
        return { ...prevChat, messages: updatedMessages };
      } else {
        clearInterval(interval);
        return prevChat; // No need to update state anymore
      }
    });
  }, 50);
};

export default displayTyppingMessage;
