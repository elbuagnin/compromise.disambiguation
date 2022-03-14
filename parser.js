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
