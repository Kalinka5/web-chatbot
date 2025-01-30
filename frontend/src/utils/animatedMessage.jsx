const displayAnimatedMessage = ({ fullMessage, setLastChat }) => {
  let currentMessage = ""; // Tracks the currently typed message
  let index = 0; // Tracks the current character being typed

  // Insert a new placeholder message for the animated typing effect
  setLastChat((prevChat) => ({
    ...prevChat,
    messages: [...prevChat.messages, { name: "Chatbot", message: "" }], // Add a new empty message for typing
  }));

  // Start the typing animation
  const interval = setInterval(() => {
    if (index < fullMessage.length) {
      currentMessage += fullMessage[index]; // Add the next character
      setLastChat((prevChat) => {
        // Append the typing effect to the most recent message without replacing other messages
        const updatedMessages = [...prevChat.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1], // Preserve message metadata
          message: currentMessage, // Update only the message content
        };

        return {
          ...prevChat, // Preserve other chat properties
          messages: updatedMessages, // Update the messages array
        };
      });
      index++;
    } else {
      clearInterval(interval); // Stop the typing animation when done
    }
  }, 50); // Adjust the typing speed as needed
};

export default displayAnimatedMessage;
