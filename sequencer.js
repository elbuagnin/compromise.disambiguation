import sequence from './sequence.js';
import * as parse from './parser.js';

export default function sequencer(document) {
  function parseTree(doc, instruction) {
     const {parseBy} = instruction;
     
     switch (parseBy) {
      case 'document':
         parse.byDocument(doc, instruction);
         break;
      case 'termList':
         parse.byTermList(doc, instruction);
         break;
      case 'pattern':
         parse.byPattern(doc, instruction);
         break;
      case 'patternFile':
         parse.byPatternFile(doc, instruction);
         break;
      default:
         break;
    }
  }

  const sentences = document.sentences();
  sequence.sort((a, b) => a.order - b.order);

  sequence.forEach((instruction) =>  {
    console.log(instruction);
    const {source} = instruction;

    if (source === 'document') {
      parseTree(document, instruction);
   } else {

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
          parseTree(chunk, instruction);
        });
      });
   }
 });
}
