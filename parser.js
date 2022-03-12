import filterTerms from './disambiguationTerms.js';
import disambiguate from './disambiguate.js';
import tagger from './tagger.js';
import sequence from './sequence.js';

export default function parser(document) {

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
    const {pattern} = payload;

    switch (action) {
      case 'disambiguate':
        disambiguate(chunk, {'word': pattern, 'POSes': payload.POSes});
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
       console.log(chunk.debug());
       if (parseBy === 'termList') {
         parseByTermList(chunk, instruction);
       } else if (parseBy === 'pattern') {
         parseByPattern(chunk, instruction);
       }
     });
   });
 });
}
