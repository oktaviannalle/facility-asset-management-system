import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Enables listening on all network interfaces (0.0.0.0) for HP Wi-Fi testing
    port: 5173,
  },
});
