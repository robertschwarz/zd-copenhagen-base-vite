import type { Plugin } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  CheckboxVariable,
  ThemeManifest,
  ThemeVariable,
} from "./types/manifestTypes";

export function zendeskThemeDevModePlugin(themeDir: string): Plugin {
  return {
    name: "zendesk-theme-dev-mode-plugin",
    configResolved(config) {
      const isDevelopment =
        config.command === "serve" && config.mode === "development";
      updateManifestVariable(isDevelopment, themeDir);
    },
  };
}

async function updateManifestVariable(
  isDevelopment: boolean,
  themeDir: string
) {
  const manifestPath = path.resolve(process.cwd(), `${themeDir}/manifest.json`);

  try {
    const data = await fs.readFile(manifestPath, "utf-8");
    const manifest: ThemeManifest = JSON.parse(data);

    for (const group of manifest.settings) {
      const devModeVar = group.variables?.find(
        (v: ThemeVariable) => v.identifier === "vite_is_development_mode"
      );

      if (devModeVar) {
        (devModeVar as CheckboxVariable).value = isDevelopment;

        await fs.writeFile(
          manifestPath,
          JSON.stringify(manifest, null, 2),
          "utf-8"
        );

        console.log(
          `zendesk-theme-dev-mode-plugin: Set the vite_is_development_mode to ${isDevelopment} in manifest.json`
        );
        break;
      }
    }
  } catch (error) {
    console.error("Error updating manifest.json:", error);
  }
}
