const audio = new Audio("https://kalinka5.github.io/web-chatbot/message-sound.mp3");

export const playMessageSound = (isSoundOn = true) => {
  // Only play sound if isSoundOn is true
  if (isSoundOn) {
    audio.currentTime = 0; // Reset sound to start
    audio.play().catch((error) => {
      console.log("Sound play failed:", error);
    });
  }
  // If sound is off, do nothing and continue with message sending
};
