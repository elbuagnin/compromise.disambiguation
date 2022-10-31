import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const here = fileURLToPath(dirname("."));
const baseDataPath = path.join(here, "sequencing-data");
const classifiersPath = path.join(baseDataPath, "classifiers");
const initializationPath = path.join(baseDataPath, "world-initialization");
const classifierKeysPath = path.join(classifiersPath, "classification-keys");
const classifierByTermsPath = path.join(classifiersPath, "classifications-by-terms");
const classifierByClassificationsPath = path.join(classifiersPath, "terms-by-classifications");
const classifierPatternsPath = path.join(classifiersPath, "classifier-patterns");
const processorsPath = path.join(baseDataPath, "doc-processors");
const directProcessesPath = path.join(baseDataPath, "processing");
const subSequencesPath = path.join(baseDataPath, "sub-sequences");
const tagPatternsPath = path.join(baseDataPath, "tag-by-patterns");
const tagsPath = path.join(initializationPath, "tags");
const wordsPath = path.join(initializationPath, "words");

export { baseDataPath, classifiersPath, initializationPath, classifierKeysPath, classifierByTermsPath, classifierByClassificationsPath, classifierPatternsPath,
         processorsPath, directProcessesPath, subSequencesPath, tagPatternsPath, tagsPath, wordsPath }
