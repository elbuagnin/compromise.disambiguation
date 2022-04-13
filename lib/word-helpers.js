import * as mfs from "./filesystem.js";

function loadWordNet(pos) {
  const dirpath = "./data/terms/pos-terms/";
  const returnType = "array";
  let filepath = dirpath;

  switch (pos) {
    case "jj":
      filepath += "adj.terms";
      break;
    case "rb":
      filepath += "adv.terms";
      break;
    case "nn":
      filepath += "noun.terms";
      break;
    case "vv":
      filepath += "verb.terms";
      break;
    default:
      break;
  }

  return mfs.loadTextFile(filepath, returnType);
}

export function hasPOS(word, pos) {
  word = word.toLowerCase();
  let termEntry = "";
  termEntry = loadWordNet(pos).find((entry) => entry === word);
  if (termEntry !== "" && termEntry !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function isVowel(character) {
  const vowels = "aeiou";
  if (vowels.includes(character)) {
    return true;
  } else {
    return false;
  }
}

export function vowelPattern(string) {
  let pattern = "";
  Object.values(string).forEach((character) => {
    if (isVowel(character) === true) {
      pattern += "v";
    } else {
      pattern += "c";
    }
  });
  return pattern;
}
