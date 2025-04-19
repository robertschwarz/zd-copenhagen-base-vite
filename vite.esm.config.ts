/**
 * This config will bundle the react-modules directory.
 * Resolves to chunks in src/assets/*.js
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { generateImportMapPlugin } from "./vite-util/vite.generate-import-map";

console.log("Starting React Server..");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = env.NODE_ENV === "production";

  if (isProduction) {
    console.log(
      "Bundling React Modules into theme/assets and updating theme/document_head.hbs."
    );
  } else {
    console.log(
      "Locally serving React Modules and inject vite snippets into theme/document_head.hbs."
    );
  }

  return {
    plugins: [react(), isProduction && generateImportMapPlugin(), mkcert()],
    server: {
      port: 9002,
    },
    build: {
      outDir: "theme/assets",
      /**
       * WYSIWYG Editor Bundle is really big (>1MB)
       * Zendesk already optimiased the bundle so that it bundle only gets loaded when it's really
       * needed. (in a text type field where wysiwyg = true)
       *
       * The setting below disables vite's chunk size warnings.
       */
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        input: {
          "new-request-form": "src/react-modules/new-request-form/index.tsx",
          "flash-notifications":
            "src/react-modules/flash-notifications/index.tsx",
        },
        output: {
          format: "es",
          manualChunks: (id) => {
            if (
              id.includes("node_modules/@zendesk/help-center-wysiwyg") ||
              id.includes("node_modules/@ckeditor5")
            ) {
              return "wysiwyg";
            }

            if (
              id.includes("node_modules") ||
              id.includes("src/react-modules/shared")
            ) {
              return "shared";
            }
          },
          entryFileNames: "[name]-bundle.js",
          chunkFileNames: "[name]-bundle.js",
        },
      },
    },
  };
});
