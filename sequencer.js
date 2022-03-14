import sequence from './sequence.js';
import parse from './parser.js';

export default function sequencer(document) {

  const sentences = document.sentences();
  sequence.sort((a, b) => a.order - b.order);

  sequence.forEach((instruction) =>  {
    console.log(instruction);
    const {scope} = instruction;

    if (scope === 'document') {
      parse(document, instruction);
   } else {

       sentences.forEach((sentence) => {

         if (scope === 'sentence') {
           parse(sentence, instruction);
         } else {

           // Scope = 'phrase' assumed
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
            parse(chunk, instruction);
          });
         }
      });
   }
 });
}
