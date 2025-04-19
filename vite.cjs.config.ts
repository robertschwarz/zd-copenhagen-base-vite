/**
 * This config will bundle the js-modules and styles directories.
 * Resolves to src/theme/script.js and src/theme/style.css
 */
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getManifestVariables } from "./vite-util/getManifestVariables";
import { viteZassPlugin } from "./vite-util/vite.zass-plugin";
import type { ZassPluginOptions } from "./vite-util/types/pluginTypes";
import mkcert from "vite-plugin-mkcert";

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
    plugins: [viteZassPlugin(zassPluginOptions), mkcert()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssPreamble,
        },
      },
    },
    server: {
      hmr: true,
      port: 9001,
    },
    build: {
      type: "iife",
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
            /**
             * There's most likely a cleaner way to implement this.
             *
             * What happens:
             * Vite generates the images in theme/settings because of the sass preamble
             * They're not needed, because they inherently exist already.
             *
             * It also tries to create a CSS file from the themeStyle input.
             * But the real "style.css" file is created by the viteZassPlugin.
             *
             * My workaround is to bundle them in a .temp folder that's deleted
             * after the build is done.
             */
            const artifactFileTypes = ["css", "png", "jpg", "gif"];

            if (
              assetInfo.names[0] &&
              artifactFileTypes.includes(assetInfo.names[0].split(".")[1])
            ) {
              return ".temp/vite-artifact-[name].[ext]";
            }

            return "[name].[ext]";
          },
        },
      },
    },
  };
});
