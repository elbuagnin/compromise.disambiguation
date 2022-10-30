import compoundNouns from "../sequencing-data/direct-processing/compound-nouns.js";
import ingVerbals from "../sequencing-data/direct-processing/ing-verbals.js";
import finalTaggingType from "../sequencing-data/direct-processing/final-tagging-type.js";

export default function runProcess(doc, payload) {
  const { process } = payload;

  switch (process) {
    case "compound-nouns":
      console.log("in switch");
      compoundNouns(doc);
      break;
    case "ing-verbals":
      ingVerbals(doc);
      break;
    case "final-tagging-type":
      finalTaggingType(doc);
      break;
    default:
      break;
  }
}
