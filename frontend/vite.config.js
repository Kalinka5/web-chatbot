import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "https://kalinka5.github.io/web-chatbot/",
  build: {
    cssCodeSplit: false, // Ensure all CSS is merged into one file
    rollupOptions: {
      output: {
        entryFileNames: "chatbot.js",
        chunkFileNames: "chatbot.js",
        assetFileNames: (assetInfo) => {
          const fileNames = assetInfo.names || []; // Use "names" instead of "name"
          const ext = fileNames.length > 0 ? fileNames[0].split(".").pop() : "";

          if (ext === "css") {
            return "chatbot.css"; // Ensure all CSS is merged into one file
          }
          return "assets/[name][extname]"; // Keep original names for images & other assets
        },
      },
    },
  },
});
