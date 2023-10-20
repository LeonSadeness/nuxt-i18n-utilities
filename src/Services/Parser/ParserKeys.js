import fs from "fs";

export default class ParserKeys {
  result = [];

  ParseTranslationKey(files) {
    this.result = [];
    const regex = /[ ]*[^\w]t\([ \n\r]*[\'\""](?<key>.*?)[\'\""][ \n\r]*\)/gm;
    let m;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = fs.readFileSync(file, "utf8");

      while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        this.result.push(m[1]);
      }
    }

    this.result.sort((a, b) => a.localeCompare(b));

    return this;
  }

  ToJson(valueIsKey = true) {
    let obj = {};
    this.result.forEach((item) => {
      obj[item] = valueIsKey ? item : "";
    });

    return JSON.stringify(obj, null, "\t");
  }
}
