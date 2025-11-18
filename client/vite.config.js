import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 무조건 백엔드(3001번)로 토스해라!
      "/api": {
        target: "http://localhost:3001", // (백엔드 포트 확인! 3001 맞지?)
        changeOrigin: true,
      },
    },
  },
});
