import fs from "fs";
import path from "path";
import consola from "consola";
import { fileURLToPath, pathToFileURL } from "url";

export const fileNameConfig = "i18n-utilities.config.js";

/**
 * Load the configuration from the specified directory.
 * If the directory is not specified, loads the configuration from the script calling directory.
 * @param {string | null} dir - directory in which the configuration is stored
 * @returns {Promise<import('../Config/defineConfig.cjs').i18nUtilitiesConfig>}
 */
export const LoadConfig = async (dir = null) => {
  let result = null;

  let dirConfig = process.cwd();
  if (dir && fs.existsSync(dir)) {
    dirConfig = dir;
  }

  const file = path.join(dirConfig, fileNameConfig);
  if (!fs.existsSync(file)) {
    consola.error(`Configuration file (${fileNameConfig}) not found.`);
    return result;
  }

  let exampleConfigPath = path.join(pathToFileURL(file).href);
  let config = await import(exampleConfigPath);

  return config.default;
};

/**
 * Creates a basic configuration in the specified directory.
 * If directory is not specified, creates the configuration in the directory where the script is called.
 * @param {string} dir - directory for creating a starting configuration in it
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
    consola.error(`Read example config - ${error.message}`);
    return false;
  }

  try {
    fs.writeFileSync(file, content, { flag: "w+" });
    consola.success(`${fileNameConfig} - successfully created.`);

    return true;
  } catch (error) {
    consola.error(`Write config - ${error.message}`);

    return false;
  }
};
