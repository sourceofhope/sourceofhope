import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.DEPLOY_ENV === "gh-pages" ? "/sourceofhope/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2017",
    minify: false,
    sourcemap: true,
    cssTarget: "safari12",
    rollupOptions: {
      output: {
        hoistTransitiveImports: false,
      },
    },
  },
  ssr: {
    noExternal: ["express", "cors", "dotenv", "stripe"],
  },
});
