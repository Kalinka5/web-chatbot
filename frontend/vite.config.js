import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Adjust the base URL for GitHub Pages
  base: "https://kalinka5.github.io/web-chatbot/", // Set the base to your repo name
});
