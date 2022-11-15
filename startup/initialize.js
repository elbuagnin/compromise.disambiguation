import nlp from "compromise";
import * as extend from "../lib/compromise-extensions.js";
import * as mfs from "../lib/filesystem.js";
import { tagsPath, wordsPath } from "../data-interface/data-file-structure.js";

export default function initialize() {
  const tags = mfs.loadJSONDir(tagsPath);
  const words = mfs.loadJSONDir(wordsPath);

  // extend.addCustomTags(tags);
  // extend.addCustomWords(words);
  nlp.addWords(words);
  nlp.addTags(tags);
  nlp.plugin(extend.addDocMethods);
}
