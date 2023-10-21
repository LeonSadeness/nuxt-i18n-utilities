const defineI18nUtilitiesConfig = require("nuxt-i18n-utilities/config");

module.exports = defineI18nUtilitiesConfig({
  // Default directories for searching translation keys.
  // In these directories, the parser will look for calls to the "$t('key')" function and collect keys for the translation dictionary.
  directories: ["./layouts", "./pages", "./components"],
  // Default files extensions
  files: ["*.vue", "*.js"],
  // Default localization in sources
  // Represents the short country code
  sourceLanguage: "en",
  langDir: 'lang',
  locales: [
    {
      code: 'en',
      file: 'en.json'
    },
    {
      code: 'ru',
      file: 'ru.json'
    },
  ],
  googleProjectId: null
});
