(async function () {
  // Fetch the manifest file
  const response = await fetch(
    "https://kalinka5.github.io/web-chatbot/.vite/manifest.json"
  );
  const manifest = await response.json();

  // Get the hashed file names from the manifest
  const cssFile = manifest["index.html"].file;
  const jsFile = manifest["index.html"].css;

  // Dynamically load the CSS file
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://kalinka5.github.io/web-chatbot/${cssFile}`;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);

  // Dynamically load the JS file
  const script = document.createElement("script");
  script.type = "module";
  script.src = `https://kalinka5.github.io/web-chatbot/${jsFile}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);

  // Initialize the chatbot once the script is loaded
  script.onload = () => {
    const chatbot = document.createElement("r2w-chatbot");
    document.body.appendChild(chatbot);
  };
})();
