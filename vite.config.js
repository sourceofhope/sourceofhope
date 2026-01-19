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
    outDir: "dist",
    emptyOutDir: true,

    target: "es2017",

    minify: "terser",
    sourcemap: true,

    terserOptions: {
      safari10: true,
      mangle: { safari10: true },
      compress: {
        safari10: true,
        passes: 2,
      },
    },
  },
  ssr: {
    noExternal: ["express", "cors", "dotenv", "stripe"],
  },
});
