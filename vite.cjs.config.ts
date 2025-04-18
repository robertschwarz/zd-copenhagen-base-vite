/**
 * This config will bundle the js-modules and styles directories.
 * Resolves to src/theme/script.js and src/theme/style.css
 */
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
