import compoundNouns from "../sequencing-data/doc-processors/compound-nouns.js";
import ingVerbals from "../sequencing-data/doc-processors/ing-verbals.js";
import finalTaggingType from "../sequencing-data/doc-processors/final-tagging-type.js";
import tagDashes from "../sequencing-data/doc-processors/dash-groups.js";
import expandContractions from "../sequencing-data/doc-processors/expand-contractions.js";
import tagHyphenated from "../sequencing-data/doc-processors/hyphenated-terms.js";
import tagLists from "../sequencing-data/doc-processors/lists.js";
import tagParentheses from "../sequencing-data/doc-processors/parentheses.js";
import tagPunctuation from "../sequencing-data/doc-processors/punctuation.js";
import tagQuotes from "../sequencing-data/doc-processors/quotations.js";

export default function runProcess(doc, payload) {
  const { process } = payload;

  switch (process) {
    case "compound-nouns":
      compoundNouns(doc);
      break;
    case "expandContractions":
      expandContractions(doc);
      break;
    case "final-tagging-type":
      finalTaggingType(doc);
      break;
    case "ing-verbals":
      ingVerbals(doc);
      break;
    case "dash-groups":
      tagDashes(doc);
      break;
    case "hyphenated-terms":
      tagHyphenated(doc);
      break;
    case "lists":
      tagLists(doc);
      break;
    case "parentheses":
      tagParentheses(doc);
      break;
    case "punctuation":
      tagPunctuation(doc);
      break;
    case "quotations":
      tagQuotes(doc);
      break;
    default:
      break;
  }
}
