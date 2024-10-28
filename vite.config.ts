import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
