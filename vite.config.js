import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import apiPlugin from "./vite-plugin-api.js";

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2019",
    cssTarget: "safari12",
    rollupOptions: {
      output: {
        hoistTransitiveImports: false,
      },
    },
  },
});
