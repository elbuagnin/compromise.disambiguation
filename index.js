import initialize from './initialize.js';
import sequencer from './sequencer.js';

export default function disambiguation(Doc, world) { // eslint-disable-line
  Doc.prototype.disambiguation = function () {  // eslint-disable-line

    const document = this;
    
    
    
    

    

    initialize(document);
    sequencer(document);


    
    
    
  };
}
