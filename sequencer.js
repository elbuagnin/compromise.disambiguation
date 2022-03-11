import parser from './parser.js';
import sequence from './sequence.js';

export default function sequencer(document) {
  sequence.forEach((instructions) => {
    switch (instructions.action) {
      case 'disambiguate':
        if (instructions.parseMethod === 'pattern') {
          const parseData = {'word': instructions.pattern, 'POSes': instructions.POSes}
          parser(document, instructions.parseMethod, parseData);
        } else if (instructions.parseMethod === 'termList') {
          const parseData = {'file': instructions.list};
          parser(document, instructions.parseMethod, parseData);
        }
        break;
      default:
        break;
    }
  });
}
