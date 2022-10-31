import * as mfs from "../lib/filesystem.js";
import { tagPatternsPath, classifierByTermsPath, processorsPath, directProcessesPath } from "../data-interface/data-file-structure.js";
import path from "path";
import discern from "./discern.js";
import tagger from "./tagger.js";
import process from "./processor.js";

function parsingDataPaths(parseBy) {
  switch (parseBy) {
    case "pattern":
      return tagPatternsPath;
    case "term":
      return classifierByTermsPath;
    case "process":
      return processorsPath;
    default:
      break;
  }
}

export default function parse(doc, instruction) {
  const { source } = instruction;

  switch (source) {
    case "payload":
      parseByMethod(doc, instruction);
      break;
    case "file":
      parseUsingFile(doc, instruction);
      break;
    case "directory":
      parseUsingDirectory(doc, instruction);
      break;
    default:
      break;
  }
}

function parseByMethod(doc, instruction, parsingData = false) {
  const { parseBy, action } = instruction;
  if (parsingData === false) {
    parsingData = instruction.payload;
  }
  //
  switch (parseBy) {
    case "pattern":
      parseByPattern(doc, action, parsingData);
      break;
    case "term":
      parseByTerm(doc, action, parsingData);
      break;
    case "process":
      process(doc, parsingData);
      break;
    default:
      break;
  }
}

function parseUsingFile(doc, instruction) {
  const { parseBy } = instruction;
  const { file } = instruction.payload;

  const filepath = path.join(parsingDataPaths(parseBy), file + ".json");

  const returnType = "array";
  const parsingSets = mfs.loadJSONFile(filepath, returnType);
  parsingSets.sort((a, b) => a.order - b.order);

  parsingSets.forEach((parsingData) => {
    parseByMethod(doc, instruction, parsingData);
  });
}

function parseUsingDirectory(doc, instruction) {
  const { parseBy } = instruction;
  const { directory } = instruction.payload;

  const dirpath = path.join(parsingDataPaths(parseBy), directory);

  const list = true;
  const parsingSets = mfs.loadJSONDir(dirpath, list);
  parsingSets.sort((a, b) => a.batch - b.batch || a.order - b.order);

  parsingSets.forEach((parsingData) => {
    parseByMethod(doc, instruction, parsingData);
  });
}

function parseByPattern(doc, action, parsingData) {
  let matches = [];

  switch (action) {
    case "discern":
      matches = doc.match(parsingData.pattern);
      matches.forEach((match) => {
        discern(
          doc,
          { word: match, classifications: parsingData.classifications },
          match
        );
      });
      break;
    case "tag":
      tagger(doc, parsingData);
      break;
    default:
      break;
  }
}

function parseByTerm(doc, action, parsingData) {
  //
  const { term } = parsingData;
  doc.terms().forEach((entry) => {
    const root = entry.text("root");
    if (root === term.word) {
      discern(doc, term, entry);
    }
  });
}
