import fs from "fs";

export default class ParserKeys {
  result = [];

  ParseTranslationKey(files) {
    this.result = [];
    const regex = /[ ]*[^\w]t\([ \n\r]*['"`](?<key>.*?)['"`][ \n\r]*\)/gm;
    let m;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = fs.readFileSync(file, "utf8");

      while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (!this.result.includes(m[1])) {
          this.result.push(m[1]);
        }
      }
    }

    this.result.sort((a, b) => a.localeCompare(b));

    return this;
  }

  MergeResultWithJson(json) {
    let obj = JSON.parse(json);
    if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
      let arr = Object.keys(obj);
      return this.MergeResultWithArray(arr);
    }
  }

  MergeResultWithArray(arr) {
    arr.forEach((item) => {
      if (!this.result.includes(item)) {
        this.result.push(item);
      }
    });

    this.result.sort((a, b) => a.localeCompare(b));
  }

  ToJson(valueIsKey = true) {
    let obj = {};
    this.result.forEach((item) => {
      obj[item] = valueIsKey ? item : "";
    });

    return JSON.stringify(obj, null, "\t");
  }
}
