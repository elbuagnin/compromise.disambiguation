import * as extend from "./compromise-extensions.js";
import * as mfs from "./lib/filesystem.js";

export default function initialize() {
  const dataDir = "/data/initialize/";
  const tagDir = `${dataDir}tags/`;
  const wordDir = `${dataDir}words/`;

  const tags = mfs.loadJSONDir(tagDir, "tags");
  const words = mfs.loadJSONDir(wordDir, "words");

  extend.addCustomTags(tags);
  extend.addCustomWords(words);
}
