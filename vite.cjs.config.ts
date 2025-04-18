/**
 * This config will bundle the js-modules and styles directories.
 * Resolves to src/theme/script.js and src/theme/style.css
 */
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//import { viteZassPlugin } from "./vite-util/vite.zass-plugin";
import { getManifestVariables } from "./vite-util/getManifestVariables";
import { viteZassPlugin } from "./vite-util/vite.zass-plugin";
import type { ZassPluginOptions } from "./vite-util/types/pluginTypes";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(() => {
  const zassPluginOptions: ZassPluginOptions = {
    themeDir: "theme",
    outputFile: "style.css",
  };

  const manifestVariables = getManifestVariables("theme");
  if (!manifestVariables)
    throw new Error(
      "Manifest file not found, or no manifest definitions found."
    );

  const scssPreamble = manifestVariables.join("\n");

  return {
    plugins: [viteZassPlugin(zassPluginOptions)],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssPreamble,
        },
      },
    },
    build: {
      type: "es",
      minify: false,
      outDir: "theme",
      emptyOutDir: false,
      rollupOptions: {
        input: {
          themeIndex: resolve(__dirname, "src/js-modules/index.ts"),
          themeStyle: resolve(__dirname, "src/styles/index.scss"),
        },
        output: {
          entryFileNames: () => "script.js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names[0] && assetInfo.names[0].endsWith(".css")) {
              return ".temp/vite-artifact.css";
            }
            return "[name].[ext]";
          },
        },
      },
    },
  };
});
