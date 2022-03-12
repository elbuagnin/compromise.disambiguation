import sequence from './sequence.js';
import filterTerms from './disambiguationTerms.js';
import disambiguate from './disambiguate.js';
import tagger from './tagger.js';
import process from './processor.js';

export default function parser(document) {
  function parseDocument(document, instruction) {
    const {action, payload} = instruction;
    switch (action) {
      case 'disambiguate':
        disambiguate(document, {'word': payload.pattern, 'POSes': payload.POSes});
        break;
      case 'process':
        process(payload);
        break;
      case 'tag':
        tagger(document, payload);
        break;
   }
  }

  function parseByTermList(chunk, instruction) {
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

  function parseByPattern(chunk, instruction) {
    const {action, payload} = instruction;

    switch (action) {
      case 'disambiguate':
        disambiguate(chunk, {'word': payload.pattern, 'POSes': payload.POSes});
        break;
      case 'tag':
        tagger(chunk, payload);
        break;
      default:
        break;
    }
  }

  // Process by Disambiguation Term File first, then ...
  // Process the document by sentences and then by non-list commas

  const sentences = document.sentences();

  sequence.forEach((instruction) =>  {
    console.log(instruction);
    const {parseBy} = instruction;

    sentences.forEach((sentence) => {
      let chunks = sentence;
      if (sentence.has('#Comma')) {
        const commas = sentence.match('#Comma');
        commas.forEach((comma) => {
          if (comma.ifNo('(#List|#CoordinatingAdjectives)').found) {
            chunks = chunks.splitAfter(comma);
          }
        });
      }

     chunks.forEach((chunk) => {
       switch (parseBy) {
          case 'termList':
            parseByTermList(chunk, instruction);
            break;
          case 'pattern':
            parseByPattern(chunk, instruction);
            break;
          case 'document':
            parseDocument(document, instruction);
            break;
          default:
            break;
       }


     });
   });
 });
}
