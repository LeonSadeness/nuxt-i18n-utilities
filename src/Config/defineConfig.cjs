/**
 * @typedef {Object} LocaleFileI18n
 * @property {String} path - example "en.json"
 * @property {Boolean} cache
 */

/**
 * @typedef {Object} LocaleI18n
 * @property {String} code - en | es | ...
 * @property {String | LocaleFileI18n} file
 */

/**
 * Свойства и медоты формы
 * @typedef {Object} i18nUtilitiesConfig
 * @property {Array<String>} directories - Default directories for searching translation keys. In these directories, the parser will look for calls to the "$t('key)" function and collect keys for the translation dictionary. (example: "["./layouts", "./pages", "./components"]")
 * @property {Array<String>} files - File extensions in which to look for translation keys (example: "['*.vue', '*.js']")
 * @property {String} sourceLanguage - Default localization in sources. Represents the short country code (example: "en")
 * @property {String} langDir - Folder with locales
 * @property {Array<LocaleI18n>} locales - Array of required locales
 */

/**
 *
 * @param {i18nUtilitiesConfig} obj
 * @returns {i18nUtilitiesConfig}
 */
module.exports = function defineI18nUtilitiesConfig(obj) {return obj};