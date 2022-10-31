import path from "path";
import { fileURLToPath } from "url";

const here = fileURLToPath(new URL(".", import.meta.url));
const baseDir = path.join(here, "../");
const dataPath = path.join(baseDir, "sequencing-data");
const classifiersPath = path.join(dataPath, "classifiers");
const initializationPath = path.join(dataPath, "world-initialization");
const classifierKeysPath = path.join(classifiersPath, "classification-keys");
const classifierByTermsPath = path.join(
  classifiersPath,
  "classifications-by-terms"
);
const classifierByClassificationsPath = path.join(
  classifiersPath,
  "terms-by-classifications"
);
const classifierPatternsPath = path.join(
  classifiersPath,
  "classifier-patterns"
);
const processorsPath = path.join(dataPath, "doc-processors");
const directProcessesPath = path.join(dataPath, "processing");
const sequencePath = path.join(dataPath, "sequence.json");
const subSequencesPath = path.join(dataPath, "sub-sequences");
const tagPatternsPath = path.join(dataPath, "tag-by-patterns");
const tagsPath = path.join(initializationPath, "tags");
const wordsPath = path.join(initializationPath, "words");

export {
  dataPath,
  classifiersPath,
  initializationPath,
  classifierKeysPath,
  classifierByTermsPath,
  classifierByClassificationsPath,
  classifierPatternsPath,
  processorsPath,
  directProcessesPath,
  sequencePath,
  subSequencesPath,
  tagPatternsPath,
  tagsPath,
  wordsPath,
};
