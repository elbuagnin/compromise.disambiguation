import sequence from './sequence.js';
import * as parse from './parser.js';


export default function sequencer(document) {


  // Process by Disambiguation Term File first, then ...
  // Process the document by sentences and then by non-list commas

  const sentences = document.sentences();

  sequence.sort((a, b) => a.order - b.order);
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
            parse.byTermList(chunk, instruction);
            break;
          case 'pattern':
            parse.byPattern(chunk, instruction);
            break;
          case 'document':
            parse.byDocument(document, instruction);
            break;
          default:
            break;
       }


     });
   });
 });
}
