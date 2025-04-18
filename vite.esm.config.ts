/**
 * This config will bundle the react-modules directory.
 * Resolves to chunks in src/assets/*.js
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
