import r2wc from "@r2wc/react-to-web-component";

import App from "./App.jsx";

import "./index.css";

const chatbot = r2wc(App);

customElements.define("r2w-chatbot", chatbot);
