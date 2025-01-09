(function () {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://kalinka5.github.io/web-chatbot/assets/index-Crzw9MFy.css";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.type = "module";
  script.src =
    "https://kalinka5.github.io/web-chatbot/assets/index-XbW74EVx.js";
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);

  script.onload = () => {
    const chatbot = document.createElement("r2w-chatbot");
    document.body.appendChild(chatbot);
  };
})();
