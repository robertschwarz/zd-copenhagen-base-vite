/**
 * TypeScript definitions for Zendesk Theme configuration
 * Based on Copenhagen theme version 4.3.6
 *
 * AI Generated, not 100% fact-checked. May contain slop.
 * AI was given following context:
 * 1. Latest manifest.json file
 * 2. Zendesk's Manifest Documentation https://support.zendesk.com/hc/en-us/articles/4408846524954-Customizing-the-Settings-panel-of-the-theme
 */

/**
 * Base types for common properties
 */
export type TranslationKey = string;
export type ColorHexValue = string;
export type FontStackValue = string;
export type BooleanValue = boolean;
export type FileValue = string;

/**
 * Manifest root object
 */
export interface ThemeManifest {
  name: string;
  author: string;
  version: string;
  api_version: number;
  default_locale: string;
  settings: ThemeSetting[];
}

/**
 * Setting group that contains related variables
 */
export interface ThemeSetting {
  label: TranslationKey;
  variables: ThemeVariable[];
}

/**
 * Base variable interface with common properties
 */
export interface BaseVariable {
  identifier: string;
  type: VariableType;
  description: TranslationKey;
  label: TranslationKey;
}

/**
 * All possible variable types
 */
export type VariableType =
  | "color"
  | "text"
  | "list"
  | "checkbox"
  | "file"
  | "range";

/**
 * Union type for all variable configurations
 */
export type ThemeVariable =
  | ColorVariable
  | TextVariable
  | ListVariable
  | CheckboxVariable
  | FileVariable
  | RangeVariable;

/**
 * Color picker variable
 */
export interface ColorVariable extends BaseVariable {
  type: "color";
  value: ColorHexValue;
}

/**
 * Text input variable
 */
export interface TextVariable extends BaseVariable {
  type: "text";
  value: string;
}

/**
 * Dropdown list variable
 */
export interface ListVariable extends BaseVariable {
  type: "list";
  value: string;
  options: ListOption[];
}

/**
 * Option for dropdown lists
 */
export interface ListOption {
  label: string;
  value: string;
}

/**
 * Checkbox variable
 */
export interface CheckboxVariable extends BaseVariable {
  type: "checkbox";
  value: BooleanValue;
}

/**
 * File uploader variable
 */
export interface FileVariable extends BaseVariable {
  type: "file";
  // No value property as it's determined by the system
}

/**
 * Range slider variable
 */
export interface RangeVariable extends BaseVariable {
  type: "range";
  value: number;
  min: number;
  max: number;
}

/**
 * Theme-specific variable groups based on Copenhagen theme
 */
export interface ColorSettings extends ThemeSetting {
  variables: ColorVariable[];
}

export interface FontSettings extends ThemeSetting {
  variables: ListVariable[];
}

export interface BrandSettings extends ThemeSetting {
  variables: (FileVariable | CheckboxVariable)[];
}

export interface ImageSettings extends ThemeSetting {
  variables: FileVariable[];
}

export interface SearchSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface HomePageSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface ArticlePageSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface SectionPageSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface CommunityPostSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface CommunityTopicSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

export interface RequestListSettings extends ThemeSetting {
  variables: CheckboxVariable[];
}

/**
 * Translation files structure
 */
export interface TranslationFile {
  [key: TranslationKey]: string;
}

/**
 * Required file variables
 */
export interface RequiredFileVariables {
  logo: FileVariable;
  favicon: FileVariable;
}
