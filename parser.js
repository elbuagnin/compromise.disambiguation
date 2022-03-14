import * as mfs from './lib/filesystem.js';
import disambiguate from './disambiguate.js';
import tagger from './tagger.js';
import process from './processor.js';
import filterTerms from './disambiguationTerms.js';

export function byDocument(document, instruction) {
  const {action, payload} = instruction;
  switch (action) {
    case 'disambiguate':
      disambiguate(document, {'word': payload.pattern, 'POSes': payload.POSes});
      break;
    case 'process':
      process(document, payload);
      break;
    case 'tag':
      tagger(document, payload);
      break;
 }
}

export function byTermList(chunk, instruction) {
   const {list} = instruction.payload;
   const termList = filterTerms(list);
   chunk.terms().forEach((entry) => {

     termList.forEach((term) => {
        if (entry.text() === term.word) {
          disambiguate(chunk, term);
        }
     });
   });
}

export function byPattern(chunk, instruction) {
  const {action, payload} = instruction;
  let matches = [];

  switch (action) {
    case 'disambiguate':
      matches = chunk.match(payload.pattern);
      matches.forEach(match => {
         disambiguate(chunk, {'word': match.text(), 'POSes': payload.POSes});
      })
      break;
    case 'tag':
      tagger(chunk, payload);
      break;
    default:
      break;
  }
}

export function byPatternFile(chunk, instruction) {
   const {file} = instruction.payload;
   const filepath = './data/patterns/' + file + '.json';
   const returnType = 'array';
   const rules = mfs.loadJSONFile(filepath, returnType);
   rules.sort((a, b) => a.order - b.order);

   rules.forEach((rule) => {
      const passedInstruction = {'action': 'tag', 'payload': rule};
      byPattern(chunk, passedInstruction);
   });
}
