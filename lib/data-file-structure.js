import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// establish path to module & module's data
// const here = fileURLToPath(import.meta.url);
// let modulePath = path.dirname(here);
// modulePath = path.normalize("./", modulePath);
// const dataPath = path.join(modulePath, "sequencing-data/");
const here = fileURLToPath(new URL('.', import.meta.url));
const baseDir = path.join("../", here);
const dataPath = path.join(baseDir, "sequencing-data");

// set up sub-paths for export
const sequencePath = path.join(dataPath, "sequence.json");
const classifiers = path.join(dataPath, "classifiers");
const classifierKeys = path.join(classifiers, "classification-keys");
const classifierByTerms = path.join(classifiers, "classifications-by-terms");
const classifierByClassifications = path.join(
  classifiers,
  "terms-by-classifications"
);
const classifierPatterns = path.join(classifiers, "classifier-patterns");
const processors = path.join(dataPath, "doc-processors");
const subSequences = path.join(dataPath, "sub-sequences");
const tagPatterns = path.join(dataPath, "tag-by-patterns");
const initialization = path.join(dataPath, "world-initialization");
const tags = path.join(initialization, "tags");
const words = path.join(initialization, "words");

export {
  dataPath,
  sequencePath,
  classifiers,
  classifierKeys,
  classifierByTerms,
  classifierByClassifications,
  classifierPatterns,
  processors,
  subSequences,
  tagPatterns,
  initialization,
  tags,
  words,
};
