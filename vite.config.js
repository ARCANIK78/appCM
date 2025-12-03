import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    https: true,
    host: "localhost",  // importante
    port: 5173,
  },
  plugins: [react(), mkcert()],
});
