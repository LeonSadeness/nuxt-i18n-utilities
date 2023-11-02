# nuxtjs-i18n-utiltties
A set of utilities for automatically collecting translation keys, and automatically translating these keys

## Installation

```bash
npm install nuxt-i18n-utilities --save-dev
```

## Config

Add `i18n-utilities.config.js` to the project root.
```js
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
```

or use bash script
```bash
npx i18nu-init
```

## Usage

```bash
npx i18nu-parse
```
Will search for keys for translation and offer to write the result to the folder specified in the config in the "langDir" field under the name of the locale file specified in the configuration as "sourceLanguage".
The utility only records json for now.

```bash
npx i18nu-translate
```
Will translate keys for all locales specified in the config and write the result to json files




