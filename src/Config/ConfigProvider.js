import fs from "fs";
import path from "path";
import consola from "consola";
import { fileURLToPath, pathToFileURL } from "url";

export const fileNameConfig = "i18n-utilities.config.js";

/**
 * Загружает конфигурацию из указанной дирректории.
 * Если дирректория не указан, загружает конфигурацию из дирректории вызова скрипта.
 * @param {string} dir - дирректория в которой хранится конфигурация
 * @returns {Promise<i18nUtilitiesConfig>}
 */
export const LoadConfig = async (dir) => {
  let result = null;

  let dirConfig = process.cwd();
  if (fs.existsSync(dir)) {
    dirConfig = dir;
  }

  const file = path.join(dirConfig, fileNameConfig);
  if (!fs.existsSync(file)) {
    consola.error(`Файл конфигурации (${fileNameConfig}) не найден.`);
    return result;
  }

  let exampleConfigPath = path.join(pathToFileURL(file).href);
  let config = await import(exampleConfigPath);

  return config.default;
};

/**
 * Создает базовую конфигурацию в указанной дирректории.
 * Если дирректория не указан, создает конфигурацию в дирректории вызова скрипта.
 * @param {string} dir - дирректория для создания в ней стартовой конфигурации
 */
export const CreateConfig = (dir) => {
  let dirConfig = process.cwd();
  if (fs.existsSync(dir)) {
    dirConfig = dir;
  }

  const file = path.join(dirConfig, fileNameConfig);
  if (fs.existsSync(file)) {
    consola.warn(`${fileNameConfig} - already exists.`);
    return true;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let exampleConfigPath = path.join(__dirname, "configExample.js");
  let content;

  try {
    content = fs.readFileSync(exampleConfigPath, {
      flag: "r",
      encoding: "utf8",
    });
  } catch (error) {
    consola.error(`Read example config - ${err}`);
    return false;
  }

  try {
    fs.writeFileSync(file, content, { flag: "w+" });
    consola.success(`${fileNameConfig} - successfully created.`);

    return true;
  } catch (error) {
    consola.error(`Write config - ${error}`);

    return false;
  }
};
