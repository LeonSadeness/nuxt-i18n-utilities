import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { minimatch } from "minimatch";

export default class FileManager {
  static GetFiles(dir, masks) {
    if (!Array.isArray(masks)) {
      if (typeof masks === "string") {
        masks = [masks];
      } else {
        return [];
      }
    }

    let result = [];
    let dirs = Array.isArray(dir) ? dir : [dir];
    for (let i = 0; i < dirs.length; i++) {
      const dirItem = dirs[i];
      const files = readdirSync(dirItem);

      files.forEach((file) => {
        const filename = join(dirItem, file);
        const stat = lstatSync(filename);

        if (stat.isDirectory()) {
          result = result.concat(FileManager.GetFiles(filename, masks));
        } else {
          masks.forEach((mask) => {
            if (minimatch(file, mask)) {
              result.push(filename);
            }
          });
        }
      });
    }

    return result;
  }
}
