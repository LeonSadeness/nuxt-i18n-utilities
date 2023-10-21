import axios from "axios";
import querystring from "querystring";
import { v2 } from "@google-cloud/translate";

export default class Translator {
  result = {};
  googleTranslate;

  /**
   * @param {String | null} googleProjectId
   */
  constructor(googleProjectId = null) {
    if (googleProjectId) {
      this.googleTranslate = new v2.Translate({
        projectId: googleProjectId,
      });
    }
  }

  async TranslateArray(fromLocale, toLocale, arr) {
    this.result = {};
    // Translate V1
    if (!this.googleTranslate) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        this.result[item] = await Translator.TranslateGoogleV1(
          fromLocale,
          toLocale,
          item
        );
      }
    }
    // Translate V2
    else {
      Translator.TranslateGoogleV2();
    }

    return this.result;
  }

  /**
   *
   * @param {String} fromLocale
   * @param {String} toLocale
   * @param {String} text
   * @returns {Promise<String>}
   */
  static async TranslateGoogleV1(fromLocale, toLocale, text) {
    const queryString = querystring.stringify({
      q: text.trim(),
      sl: fromLocale,
      tl: toLocale,
      ie: "UTF-8",
      oe: "UTF-8",
      hl: "en",
      client: "gtx",
      dt: ["t", "at", "bd"],
    });
    const url = `http://translate.googleapis.com/translate_a/single?${queryString}`;
    const requestOptions = { headers: { Accept: "*/*" } };

    let response;
    try {
      response = await axios.get(url, requestOptions);
      return response.data?.[0]?.[0]?.[0] ?? null;
    } catch (err) {
      consola.error(err.message);
      return null;
    }
  }

  static async TranslateGoogleV2() {
    throw new Error(
      "The translation function using GoogleTranslateV2 is not implemented"
    );

    // let [translations] = await translate.translate(text, target);
    // translations = Array.isArray(translations) ? translations : [translations];
    // console.log('Translations:');
    // translations.forEach((translation, i) => {
    //   console.log(`${text[i]} => (${target}) ${translation}`);
    // });

    //https://cloud.google.com/translate/docs/basic/translating-text
  }
}
