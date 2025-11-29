import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    https: true,   // ← activa HTTPS
  },
  plugins: [
    react(),
    mkcert(),      // ← genera certificados automáticamente
  ],
});
