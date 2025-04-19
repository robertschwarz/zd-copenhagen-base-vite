export interface ZassPluginOptions {
  outputFile?: string;
  themeDir?: string;
}

export type OutputBundle = {
  [fileName: string]: { fileName: string; name?: string };
};
export type ImportMap = {
  imports: Record<string, string>;
};
