import * as mfs from "./lib/filesystem.js";
import disambiguate from "./disambiguate.js";
import tagger from "./tagger.js";
import process from "./processor.js";
//import filterTerms from './disambiguationTerms.js';

function parsingDataPaths(parseBy) {
  const baseDir = "./data/";

  switch (parseBy) {
    case "pattern":
      return baseDir + "patterns/";
    case "term":
      return baseDir + "terms/";
    case "process":
      return baseDir + "processes/";
    default:
      break;
  }
}

export default function parse(doc, instruction) {
  const { source } = instruction;
  console.log("Source: " + source);
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
  //console.log('  parseBy: ' + parseBy);
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

  const filepath = parsingDataPaths(parseBy) + file + ".json";
  console.log("  Using file: " + filepath);
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

  const dirpath = parsingDataPaths(parseBy) + directory;
  console.log("  Using Directory: " + dirpath);
  const list = true;
  const parsingSets = mfs.loadJSONDir(dirpath, list);
  parsingSets.sort((a, b) => a.batch - b.batch || a.order - b.order);

  parsingSets.forEach((parsingData) => {
    parseByMethod(doc, instruction, parsingData);
  });
}

function parseByPattern(doc, action, parsingData) {
  let matches = [];
  console.log("    pattern " + parsingData.pattern);
  switch (action) {
    case "disambiguate":
      matches = doc.match(parsingData.pattern);
      matches.forEach((match) => {
        disambiguate(doc, { word: match.text(), POSes: parsingData.POSes });
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
  //console.log('pdata: ' + JSON.stringify(parsingData));
  const { term } = parsingData;
  doc.terms().forEach((entry) => {
    if (entry.text() === term.word) {
      console.log("    Found term: " + JSON.stringify(term));
      disambiguate(doc, term);
    }
  });
}
