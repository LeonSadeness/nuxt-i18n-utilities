#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

import fs from "fs";
import path from "path";
import consola from "consola";
import { LoadConfig } from "../Config/ConfigProvider.js";
import FileManager from "../FileManager/FileManager.js";
import Translator from "../Services/Translate/Translator.js";
import ParserKeys from "../Services/Parser/ParserKeys.js";

const TranslateCommand = async () => {
  const config = await LoadConfig();

  if (!config) {
    consola.error(
      'You can create a config using the command "npx i18nu-init" or create a config file manually (\x1b[33m./i18n-utilities.config.js\x1b[0m)'
    );
    return;
  }

  // #region Parse
  let files = FileManager.GetFiles(config.directories, ["*.vue", "*.js"]);
  let parser = new ParserKeys();
  parser.ParseTranslationKey(files);
  // #endregion

  let translator = new Translator(config.googleProjectId);
  // cmd arg
  const langArg = process.argv?.[2] || "";
  const localeArg = config.locales?.find(
    (i) => i.code.toLowerCase() === langArg.toLowerCase()
  );
  let localesForTranslation =
    config.locales?.filter(
      (i) => i.code?.toLowerCase() != config.sourceLanguage?.toLowerCase()
    ) ?? [];

  // if locale arg find
  if (
    localeArg &&
    localeArg.code?.toLowerCase() != config.sourceLanguage?.toLowerCase()
  ) {
    localesForTranslation = [localeArg];
  }

  for (let i = 0; i < localesForTranslation.length; i++) {
    const item = localesForTranslation[i];

    if (!item?.file) {
      consola.error(
        `In the \x1b[33mconfiguration\x1b[0m file in the "\x1b[33mlocales\x1b[0m" field, the locale file (\x1b[33m${item.code}\x1b[0m) could not be found`
      );
      return;
    }

    let resultJson;
    const fileLocale = path.join(process.cwd(), config.langDir, item.file);

    if (fs.existsSync(fileLocale)) {
      try {
        let jsonLocale = fs.readFileSync(fileLocale, {
          flag: "r",
          encoding: "utf8",
        });

        let objLocale = JSON.parse(jsonLocale);
        let arrLocale = Object.keys(objLocale);
        let arrToTranslate = [];

        parser.result.forEach((key) => {
          if (!arrLocale.includes(key)) {
            arrToTranslate.push(key);
          }
        });

        let translated = await translator.TranslateArray(
          config.sourceLanguage,
          item.code,
          arrToTranslate
        );

        for (const key in translated) {
          objLocale[key] = translated[key];
        }
        resultJson = JSON.stringify(objLocale, null, "\t");
      } catch (error) {
        consola.error(error.message);
        return;
      }
    } else {
      let translated = await translator.TranslateArray(
        config.sourceLanguage,
        item.code,
        parser.result
      );
      resultJson = JSON.stringify(translated, null, "\t");
    }

    // write result locale
    try {
      fs.writeFileSync(fileLocale, resultJson, {
        flag: "w",
        encoding: "utf8",
      });
      consola.success(
        `The file "\x1b[33m${item.file}\x1b[0m" was successfully written.\n`
      );
    } catch (error) {
      consola.error(error);
    }
  }

  consola.success("Completed 🏁\n");
};

TranslateCommand();
