import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import assistant from "../images/assistant.png";

import api from "../api";

function ChatbotChatting({ userID, chats, setChats, chatTitle, setChatTitle, chatIndex, setChatIndex, isChatNew, setIsChatNew }) {
  const [listMessages, setListMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Create a chatTitle dynamically if it's not already set
    if (isChatNew) {
      const now = new Date();
      const formattedDate = now.toString().replace(" G", ".").split(".")[0]; // Format as "YYYY-MM-DD HH:MM:SS"
      const title = `Chat ${formattedDate}`;
      setChatTitle(title);
      setChatIndex(chats.length);
      setChats((prevMessages) => {
        return [...prevMessages, { title: title, content: [] }];
      });
      setIsChatNew(false);
    } else {
      setListMessages(chats[chatIndex]["content"]);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const addMessage = async (newMessage) => {
    const requestData = {
      title: chatTitle,
      content: newMessage,
    };
    console.log(requestData);

    try {
      const response = await api.post(`/chats/${userID}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      console.log("Response from server:", data.detail);

      // Update the main messages array
      setChats((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[chatIndex].content.unshift(newMessage);
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const now = new Date();
    const dateTime = now.toString().replace(" G", ".").split(".")[0];

    const userMessage = { name: "User", message: inputMessage };
    console.log(userMessage);
    setListMessages((prevMessages) => [userMessage, ...prevMessages]);
    console.log(listMessages);
    addMessage(userMessage);

    const botTypping = {
      name: "Chatbot",
      message: (
        <div className="is-typing">
          <div className="jump1"></div>
          <div className="jump2"></div>
          <div className="jump3"></div>
          <div className="jump4"></div>
          <div className="jump5"></div>
        </div>
      ),
    };
    setListMessages((prevMessages) => [botTypping, ...prevMessages]);

    api
      .post(
        "/predict",
        {
          message: inputMessage,
          datetime: dateTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data.response);
        const botMessage = { name: "Chatbot", message: data.response };

        // Remove the loading message and add the bot's actual response
        setListMessages((prevMessages) => {
          const [, ...updatedMessages] = prevMessages; // Remove the first message
          return [botMessage, ...updatedMessages]; // Add the new message
        });
        addMessage(botMessage);
      })
      .catch((error) => {
        console.error("Error:", error);

        const botMessage = {
          name: "Chatbot",
          message: "Oops! 🤖 I'm still a baby bot, learning to chat like a pro! 🍼💻 Could you try rephrasing your question for me? 🚀✨",
        };

        // Remove the loading message and add an error message
        setListMessages((prevMessages) => {
          const [, ...updatedMessages] = prevMessages; // Remove the first message
          return [botMessage, ...updatedMessages];
        });
        addMessage(botMessage);
      });

    setInputMessage("");
  };

  return (
    <div className="main-container">
      <div className="messages-container">
        <div className="chatbox__messages">
          {listMessages &&
            listMessages.map((msg, index) => (
              <div className="message" key={index}>
                {msg.name === "Chatbot" ? <img src={assistant} alt="Chat Support" /> : <div></div>}
                <div className={`messages__item ${msg.name === "Chatbot" ? "messages__item--visitor" : "messages__item--operator"}`}>
                  {typeof msg.message === "string" ? (
                    msg.message.includes("\n") ? (
                      msg.message
                        .split("\n") // Split by newlines
                        .map((msgContent, i) => (
                          <div className="message-list" key={i}>
                            <ReactMarkdown>{msgContent}</ReactMarkdown>
                            {i !== msg.message.split("\n").length - 1 && <p style={{ margin: "16px 0" }}></p>}
                          </div>
                        ))
                    ) : (
                      <div className="message-list">
                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                      </div> // Render as a single paragraph if no newlines
                    )
                  ) : Array.isArray(msg.message) ? (
                    msg.message.map((msgContent, i) => <p key={i}>{msgContent}</p>) // Render each item if it's an array
                  ) : (
                    <div className="is-typing">
                      <div className="jump1"></div>
                      <div className="jump2"></div>
                      <div className="jump3"></div>
                      <div className="jump4"></div>
                      <div className="jump5"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          <div className="message">
            <img src={assistant} alt="Chat Support" />
            <div className="messages__item messages__item--visitor">
              <p className="chatbot-message">Hello, I'm a Chatbot. 🤖</p>
              <p className="chatbot-message">I can help you with all information about Kaidu platform. 📚</p>
              <p className="chatbot-message">Ask me a question. ❓</p>
            </div>
          </div>
        </div>
      </div>
      <div className="input-button-container">
        <div className="input-button">
          <input
            className="input-message"
            type="text"
            placeholder="Write a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <button className="send__button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotChatting;
