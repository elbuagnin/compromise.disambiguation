import compoundNouns from "../sequencing-data/direct-processing/compound-nouns.js";

export default function runProcess(doc, payload) {
  const { process } = payload;

  switch (process) {
    case "compound-nouns":
      compoundNouns(doc);
      break;
    default:
      break;
  }
}
