import disambiguationTerms from './disambiguationTerms.js';
import disambiguate from './disambiguate.js';

export default function parser(doc) {

  function parseChunk(chunk) {
     chunk.terms().forEach((entry) => {
       console.log(entry.text());
       disambiguationTerms.forEach((term) => {
          let disambiguatedPos = 'inconclusive';
          if (entry.text() === term.word) {
            console.log(term);
            disambiguatedPos = disambiguate(chunk, term);
            console.log(term.word + ' has been disambiguated to: ' + disambiguatedPos);
          }
       });
     });
  }

  const sentences = doc.sentences();

  // Process by Disambiguation Term File first, then ...
  // Process the document by sentences and then by non-list commas
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
       parseChunk(chunk);
     });
   });
}
