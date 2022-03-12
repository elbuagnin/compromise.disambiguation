import initialize from './initialize.js';
import preParser from './pre-parser.js';
import parser from './parser.js';
import postParser from './post-parser.js';
//import sequencer from './sequencer.js';

export default function disambiguation(Doc, world) { // eslint-disable-line
  Doc.prototype.disambiguation = function () {  // eslint-disable-line

    const document = this;
    console.log('\n\n');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('Document before Disambiguation:');

    console.log(document.debug());

    initialize(document);
    preParser(document);
    parser(document);
    //sequencer(document);
    postParser(document);


    console.log('############################################################');
    console.log('Document after Disambiguation:');
    console.log(document.debug());
  };
}
