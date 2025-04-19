/**
 * This is the counterpart to generate-import-map.
 * During development, we don't want `script.js`, `style.css` and the modules of `theme/assets`
 * to load.
 *
 * Instead, we want to load the vite client and all of our modules from the vite-hosted server.
 *
 * This plugin updates theme/document_head.hbs and adds the required vite imports.
 */
import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import type { ImportMap, OutputBundle } from "./types/pluginTypes";

export function zendeskThemeDevModePlugin(): Plugin {
  return {
    name: "zendesk-theme-dev-mode-plugin",
    /**Plugin goes here */
    },
  };