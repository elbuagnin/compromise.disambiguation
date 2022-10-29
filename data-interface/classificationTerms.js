import * as mfs from "../lib/filesystem.js";
import dataPaths from "./data-file-structure.js";

export default function filterTerms(list) {
  const classificationTerms = mfs.loadJSONDir(
    classifierByTermsPath,
    true
  );
  const filteredTerms = classificationTerms.filter(
    (term) => term.list === list
  );
  return filteredTerms;
}
