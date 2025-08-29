import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@types": path.resolve(__dirname, "src/types"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3001" },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles" as *;`,
      },
    },
  },
});
