import * as mfs from './lib/filesystem.js';
import disambiguate from './disambiguate.js';
import tagger from './tagger.js';
import process from './processor.js';
import filterTerms from './disambiguationTerms.js';

export default function parse(doc, instruction) {
   const {action, parseBy} = instruction;

   if (action === 'process') {
     process(doc, instruction);
   } else {

    switch (parseBy) {
      case 'termList':
         byTermList(doc, instruction);
         break;
      case 'pattern':
         byPattern(doc, instruction);
         break;
      case 'patternFile':
         byPatternFile(doc, instruction);
         break;
      case 'byPatternDirectory':
        byPatternDirectory(doc, instruction);
        break;
      default:
         break;
    }
  }
}

function byTermList(doc, instruction) {
   const {list} = instruction.payload;
   const termList = filterTerms(list);

   doc.terms().forEach((entry) => {
     termList.forEach((term) => {
        if (entry.text() === term.word) {
          disambiguate(doc, term);
        }
     });
   });
}

function byPattern(doc, instruction) {
  const {action, payload} = instruction;
  let matches = [];

  switch (action) {
    case 'disambiguate':
      matches = doc.match(payload.pattern);
      matches.forEach(match => {
         disambiguate(doc, {'word': match.text(), 'POSes': payload.POSes});
      })
      break;
    case 'tag':
      tagger(doc, payload);
      break;
    default:
      break;
  }
}

function byPatternFile(doc, instruction) {
   const {file} = instruction.payload;
   const filepath = './data/patterns/' + file + '.json';
   const returnType = 'array';
   const rules = mfs.loadJSONFile(filepath, returnType);
   rules.sort((a, b) => a.order - b.order);

   rules.forEach((rule) => {
      const passedInstruction = {'action': 'tag', 'payload': rule};
      byPattern(doc, passedInstruction);
   });
}

function byPatternDirectory(doc, instruction) {
  const {directory} = instruction.payload;
  const filepath = './data/' + directory;
  const list = true;
  const rules = mfs.loadJSONDir(filepath, list);
  rules.sort((a, b) => a.batch - b.batch || a.order - b.order);

  rules.forEach((rule) => {
     const passedInstruction = {'action': 'tag', 'payload': rule};
     byPattern(doc, passedInstruction);
  });
}
