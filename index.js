import initialize from './initialize.js';
import sequencer from './sequencer.js';

export default function disambiguation(Doc, world) { // eslint-disable-line
  Doc.prototype.disambiguation = function () {  // eslint-disable-line

    const document = this;
    console.log('\n\n');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('Document before Disambiguation:');

    console.log(document.debug());

    initialize(document);
    sequencer(document);


    console.log('############################################################');
    console.log('Document after Disambiguation:');
    console.log(document.debug());
  };
}
