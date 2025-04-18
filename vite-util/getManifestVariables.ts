import path from "path";
import fs from "fs";
import type { ThemeManifest, ThemeSetting } from "./types/manifestTypes";

/**
 * Extract variables from manifest.json and assets directory
 * and create SCSS variable definitions for Vite's preprocessor
 */
export function getManifestVariables(
  themeDir: string = "theme"
): string[] | null {
  try {
    const manifestPath = path.resolve(themeDir, "manifest.json");
    const assetsPath = path.resolve(themeDir, "assets");

    if (!fs.existsSync(manifestPath)) {
      console.error(`Manifest file not found: ${manifestPath}`);
      return null;
    }

    const data = fs.readFileSync(manifestPath, "utf-8");
    const manifest: ThemeManifest = JSON.parse(data);

    const variableDefinitions: string[] = [];

    manifest.settings.forEach((setting: ThemeSetting) => {
      setting.variables.forEach((variable) => {
        const identifier = variable.identifier;

        let placeholderValue: string;

        switch (variable.type) {
          case "color":
            placeholderValue = "transparent";
            break;
          case "checkbox":
            placeholderValue = "false";
            break;
          case "list":
          case "text":
            placeholderValue = '""';
            break;
          case "range":
            placeholderValue = "0";
            break;
          case "file":
            placeholderValue = '""';
            break;
          default:
            placeholderValue = "null";
        }

        variableDefinitions.push(`$${identifier}: ${placeholderValue};`);
      });
    });

    if (fs.existsSync(assetsPath)) {
      const filenames = fs.readdirSync(assetsPath);

      for (const file of filenames) {
        if (file === ".gitkeep") continue;

        const extname = path.extname(file);
        const basename = path.basename(file, extname).toLowerCase();

        if (basename.match(/[^a-z0-9-_+.]/)) {
          continue;
        }

        const assetVar = `assets-${basename.replace(/\+|\./g, "-")}-${extname
          .split(".")
          .pop()}`;
        variableDefinitions.push(`$${assetVar}: "";`);
      }
    }

    variableDefinitions.push(`
@function zass-lighten($color, $amount) {
  @return lighten($color, $amount);
}

@function zass-darken($color, $amount) {
  @return darken($color, $amount);
}
`);

    return variableDefinitions;
  } catch (error) {
    console.error("Error generating manifest variables:", error);
    return null;
  }
}
