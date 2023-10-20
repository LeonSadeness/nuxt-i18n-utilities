#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

import fs from "fs";
import path from "path";
import consola from "consola";
import { LoadConfig } from "../Config/ConfigProvider.js";
import FileManager from "../FileManager/FileManager.js";
import ParserKeys from "../Services/Parser/ParserKeys.js";

const ParseCommand = async () => {
  const config = await LoadConfig();

  if (!config) {
    consola.error(
      'You can create a config using the command "npx i18nu-init" or create a config file manually (\x1b[33m./i18n-utilities.config.js\x1b[0m)'
    );
    return;
  }

  let files = FileManager.GetFiles(config.directories, ["*.vue", "*.js"]);
  let parser = new ParserKeys();
  parser.ParseTranslationKey(files);

  consola.success(`Parsing completed successfully\nResult:`);

  // #region Preview result
  const maxCount = 10;
  let count =
    parser.result.length <= maxCount ? parser.result.length : maxCount;
  let moreCount = parser.result.length - maxCount;

  for (let i = 0; i < count; i++) {
    consola.log(`${i}. \x1b[32m${parser.result[i]}\x1b[0m`);
  }
  if (moreCount > 0) {
    consola.log(`\x1b[33m...and ${moreCount} more\x1b[0m\n`);
  }
  // #endregion

  // #region Write confirm
  let defaultLocale = config.locales?.find(
    (i) => i.code === config.sourceLanguage
  );
  if (!defaultLocale?.file) {
    consola.error(
      `In the \x1b[33mconfiguration\x1b[0m file in the "\x1b[33mlocales\x1b[0m" field, the locale file (\x1b[33m${config.sourceLanguage}\x1b[0m) could not be found`
    );
    return;
  }
  if (!defaultLocale.file.endsWith(".json")) {
    consola.error(
      `😔 Unfortunately, the utility only supports "\x1b[33mjson\x1b[0m" files. Change the file extension in your locale locale(\x1b[33m${defaultLocale.file}\x1b[0m)`
    );
    return;
  }

  let relativeWritePath = path.join(config.langDir, defaultLocale.file);
  let isWriteConfirm = await consola.prompt(
    `Write the collected keys as the default locale(\x1b[33m${config.sourceLanguage}\x1b[0m) to the file "\x1b[33m${relativeWritePath}\x1b[0m"?\nIf the file already exists, it will be overwritten ❗❗❗\nThe end result will be:\x1b[33m\n{\n\x1b[32m"first key"\x1b[0m: \x1b[32m"first key"\x1b[0m,\n\x1b[32m"second key"\x1b[0m: \x1b[32m"second key"\x1b[0m,\n...\n\x1b[32m"some key"\x1b[0m: \x1b[32m"some key"\x1b[33m\n}\x1b[0m`,
    { type: "confirm" }
  );
  // #endregion

  // #region Write
  if (isWriteConfirm) {
    let writeDir = path.join(process.cwd(), config.langDir);
    let writePath = path.join(writeDir, defaultLocale.file);

    if (!fs.existsSync(writeDir)) {
      fs.mkdir(writeDir, (err) => {
        if (err) consola.error(err);
      });
    }

    try {
      fs.writeFileSync(writePath, parser.ToJson(), {
        flag: "w",
        encoding: "utf8",
      });
      consola.log(`\n`);
      consola.success(`The file "\x1b[33m${defaultLocale.file}\x1b[0m" was successfully written.\n`)
    } catch (error) {
      consola.error(error);
    }
  }
  // #endregion
};

ParseCommand();
