import nlp from "compromise";
import * as extend from "../lib/compromise-extensions.js";
import * as mfs from "../lib/filesystem.js";
import { tagsPath, wordsPath } from "../data-interface/data-file-structure.js";

export default function initialize() {
  console.log(tagsPath);
  const tags = mfs.loadJSONDir(tagsPath);
  const words = mfs.loadJSONDir(wordsPath);

  extend.addCustomTags(tags);
  extend.addCustomWords(words);
  nlp.plugin(extend.addDocMethods);
}
