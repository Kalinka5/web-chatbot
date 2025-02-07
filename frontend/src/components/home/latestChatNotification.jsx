import React, { useEffect, useState } from "react";
import "../../styles/latestChatNotification.css"; // Import styles

const LatestChatNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to check if the notification should be shown
    const checkIfShouldShowNotification = () => {
      const hasSessionPrompt = sessionStorage.getItem("hasSessionPrompt");

      if (!hasSessionPrompt) {
        // Only show the notification if not already shown
        console.log("Displaying 'Latest Chat' notification.");
        setIsVisible(true);

        // Set a flag in session storage to prevent showing again
        sessionStorage.setItem("hasSessionPrompt", "true");

        // Hide notification after 4 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 4000);

        return () => clearTimeout(timer); // Cleanup timer
      }
    };

    // Add event listener for page unload to reset session flag
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("hasSessionPrompt");
    };

    // Check when the component mounts
    checkIfShouldShowNotification();

    // Cleanup on page unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Cleanup event listener
    };
  }, []);

  return <div className={`latest-chat-notification ${isVisible ? "show" : "hide"}`}>📌 Latest Chat</div>;
};

export default LatestChatNotification;
