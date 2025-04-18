/**
 * This config will bundle the react-modules directory.
 * Resolves to chunks in src/assets/*.js
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateImportMap } from "./generate-import-map.mjs";

const TRANSLATION_FILE_REGEX =
  /src\/modules\/(.+?)\/translations\/locales\/.+?\.json$/;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generateImportMap()],
  build: {
    minify: true,
    outDir: "theme/assets",
    rollupOptions: {
      //preserveEntrySignatures: "exports-only",
      input: {
        "new-request-form": "src/react-modules/new-request-form/index.tsx",
        "flash-notifications": "src/react-modules/flash-notifications/index.ts",
      },
      //treeshake: false,
      output: {
        format: "esm",
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

          // Bundle all files from `src/modules/MODULE_NAME/translations/locales/*.json to `${MODULE_NAME}-translations.js`
          const translationFileMatch = id.match(TRANSLATION_FILE_REGEX);
          if (translationFileMatch) {
            return `${translationFileMatch[1]}-translations`;
          }
        },
        entryFileNames: "[name]-bundle.js",
        chunkFileNames: "[name]-bundle.js",
      },
    },
  },
});
