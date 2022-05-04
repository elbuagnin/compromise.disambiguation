import path from "path";
import fs from 'fs';

//const here = import.meta.url;

const topDir = process.cwd(); //path.normalize(here + '/..//..//');

const baseData = path.join(topDir, "/sequencing-data/");
const classifiers = path.join(baseData, "classifiers");
const classifierKeys = path.join(classifiers, "classification-keys");
const classifierByTerms = path.join(classifiers, "classifications-by-terms");
const classifierByClassifications = path.join(
  classifiers,
  "terms-by-classifications"
);
const classifierPatterns = path.join(classifiers, "classifier-patterns");
const processors = path.join(baseData, "doc-processors");
const subSequences = path.join(baseData, "sub-sequences");
const tagPatterns = path.join(baseData, "tag-by-patterns");
const initialization = path.join(baseData, "world-initialization");
const tags = path.join(initialization, "tags");
const words = path.join(initialization, "words");

export {
  topDir,
  baseData,
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
  words
};
