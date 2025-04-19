/**
 * Mostly the same implementation as Zendesk's in Copenhagen, just with TS
 * https://github.com/zendesk/copenhagen_theme/blob/master/generate-import-map.mjs
 *
 * Also saves `style.css` in `theme` directory on build.
 *
 * This is done to preserve custom manifest variables in the output file, such as $brand_color and asset path variables.
 * Vite's default built .css file resolves all variables into their actual values.
 * Vite's build is explicitly configured to store the vite output file in a "dead" `theme/.temp` folder.
 * This folder is ignored by Zendesk when running zcli themes:import // zcli:themes:update
 *
 * If we were to use Vite's default .CSS bundle with resolved variables, an End-User won't be able to use
 * the manifest settings anymore to customize the theme.
 */

import path from "path";
import fs from "fs";
import { compileString } from "sass";
import type { Plugin } from "vite";
import type { ZassPluginOptions } from "./types/pluginTypes";
import type { ThemeSetting } from "./types/manifestTypes";

export function viteZassPlugin(options: ZassPluginOptions): Plugin {
  const themeDir = options.themeDir || ".";
  const outputFile = options.outputFile || "style.css";
  let processedCss = "";

  const manifestPath = path.resolve(themeDir, "manifest.json");
  const assetsPath = path.resolve(themeDir, "assets");

  let preamble = "";
  try {
    const data = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(data);

    const variables = manifest.settings.reduce(
      (vars: string[], setting: ThemeSetting) =>
        vars.concat(setting.variables.map((variable) => variable.identifier)),
      []
    );

    if (fs.existsSync(assetsPath)) {
      const filenames = fs.readdirSync(assetsPath);

      for (const file of filenames) {
        if (file === ".gitkeep") continue;

        const extname = path.extname(file);
        const basename = path.basename(file, extname).toLowerCase();

        // Skip files with illegal characters
        if (basename.match(/[^a-z0-9-_+.]/)) {
          console.warn(
            `Asset "${file}" has illegal characters in its name. Skipping.`
          );
          continue;
        }

        variables.push(
          `assets-${basename.replace(/\+|\./g, "-")}-${extname
            .split(".")
            .pop()}`
        );
      }
    }

    preamble = variables
      .map((variable: string) => `$${variable}: \\$${variable};`)
      .join("\n");
  } catch (error) {
    console.error("Error generating preamble:", error.message);
  }

  const unescapeVariables = (css: string) => css.replace(/\\\$/g, "$");

  const convertZassFunctions = (css: string) =>
    css.replace(/zass-lighten/g, "lighten").replace(/zass-darken/g, "darken");

  return {
    name: "vite-plugin-zass",
    enforce: "pre",

    async transform(code, id) {
      if (!id.endsWith(".scss") && !id.endsWith(".sass")) {
        return null;
      }

      try {
        const input = `${preamble}\n${code}`;

        const result = compileString(input, {
          style: "expanded",
          loadPaths: [path.dirname(id)],
        });

        let css = result.css;
        css = unescapeVariables(css);
        css = convertZassFunctions(css);

        processedCss = css;
        fs.writeFileSync(`${options.themeDir}/${options.outputFile}`, css);

        return {
          code: css,
          map: null,
        };
      } catch (error) {
        console.error("SASS compilation error:", error.message);
        return null;
      }
    },

    generateBundle() {
      if (outputFile && processedCss) {
        this.emitFile({
          type: "asset",
          fileName: outputFile,
          source: processedCss,
        });
      }
    },
  };
}
