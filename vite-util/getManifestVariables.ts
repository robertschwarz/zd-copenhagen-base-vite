import path from "path";
import fs from "fs";
import type {
  ThemeManifest,
  ThemeSetting,
  ThemeVariable,
} from "./types/manifestTypes";

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
    const settingsPath = path.resolve(themeDir, "settings");

    const settingAssets = fs.readdirSync(settingsPath);
    const mappedSettingAssets = settingAssets.map((i: string) => {
      return {
        name: i,
        identifier: i.split(".")[0],
      };
    });

    if (!fs.existsSync(manifestPath)) {
      console.error(`Manifest file not found: ${manifestPath}`);
      return null;
    }

    const data = fs.readFileSync(manifestPath, "utf-8");
    const manifest: ThemeManifest = JSON.parse(data);

    const variableDefinitions: string[] = [];

    manifest.settings.forEach((setting: ThemeSetting) => {
      setting.variables.forEach((variable: ThemeVariable) => {
        const identifier = variable.identifier;

        if (variable.type == "file") {
          const targetFile = mappedSettingAssets.find(
            (i) => i.identifier == identifier
          );

          if (!targetFile)
            throw new Error(`
           Build failed while trying to generate sass variables from manifest in ./themes/manifest.json.
           Reason: Manifest Setting with ${identifier} has no corresponding file in theme/settings.`);

          if ("value" in variable && variable.value === undefined) {
            throw new Error(`
          Build failed while trying to generate sass variables from manifest in ./themes/manifest.json.
          Reason: Undefined variable for identifier ${identifier}. Make sure to give it a value property.`);
          }

          return variableDefinitions.push(
            `$${identifier}: "/theme/settings/${targetFile.identifier}.jpg";`
          );
        }

        const variableValue = variable.value;

        variableDefinitions.push(`$${identifier}: ${variableValue};`);
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
