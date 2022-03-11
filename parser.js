import disambiguationTerms from './disambiguationTerms.js';
import disambiguate from './disambiguate.js';

export default function parser(document, parseMethod, parseData) {
  let filteredDisambiguationTerms = [];

  function parseByTermList(chunk) {
     chunk.terms().forEach((entry) => {
       console.log(entry.text());

       filteredDisambiguationTerms.forEach((term) => {
          let disambiguatedPos = 'inconclusive';
          if (entry.text() === term.word) {
            console.log(term);
            disambiguatedPos = disambiguate(chunk, term);
            console.log(term.word + ' has been disambiguated to: ' + disambiguatedPos);
          }
       });
     });
  }

  function parseByPattern(chunk) {
    disambiguate(chunk, parseData);
  }

  // Process by Disambiguation Term File first, then ...
  // Process the document by sentences and then by non-list commas
    if (parseMethod === 'termList') {
      filteredDisambiguationTerms = disambiguationTerms.filter(term => (term.list === parseData.list));
    }
    
    const sentences = document.sentences();
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
       if (parseMethod === 'termList') {
         parseByTermList(chunk);
       } else if (parseMethod === 'pattern') {
         parseByPattern(chunk);
       }
     });
   });
}
