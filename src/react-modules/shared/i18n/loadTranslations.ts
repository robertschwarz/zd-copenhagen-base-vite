import i18next from "i18next";

const translationModules = import.meta.glob("./translations/locales/*.json", {
  eager: true,
});

export async function loadTranslations(locale: string) {
  try {
    const localeFilePath = `./translations/locales/${locale}.json`;

    const translations = translationModules[localeFilePath] as {
      default: Record<string, string>;
    };

    if (translations) {
      i18next.addResourceBundle(locale, "translation", translations.default);
    }
  } catch (e) {
    console.error(`Cannot load translations for ${locale}`, e);
  }
}
