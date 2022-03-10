import * as mfs from './lib/filesystem.js';
import posabbreviationToName from './pos-name-table.js';
import posTests from './pos-tests.js';

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

  function disambiguate(chunk, term) {
     function compromiseTagged(pos) {
        return '#' + pos.charAt(0).toUpperCase() + pos.slice(1);
     }

     function isPOS(word, pos) {
        let result = 'inconclusive';
        let negativeTests = [];
        let probableTests = [];
        let positiveTests = [];

        let testSet = posTests.filter(test => (test.pos === pos));

        if (testSet.length > 0) {
          negativeTests = testSet.filter(test => (test.type === 'negative'));
          probableTests = testSet.filter(test => (test.type === 'probable'));
          positiveTests = testSet.filter(test => (test.type === 'positive'));
        }

        negativeTests.forEach((test) => {
           let pattern = test.pattern.replace('%word%', word);
           if (chunk.has(pattern)) {
             console.log('    Not ' + pos +': ' + pattern);
             result = 'eliminated';
          }
        });

        if (result !== 'eliminated') {
           probableTests.forEach((test) => {
              let pattern = test.pattern.replace('%word%', word);
              if (chunk.has(pattern)) {
                console.log('    Probable ' + pos + ': ' + pattern);
                result = 'probable';
             }
           });

           positiveTests.forEach((test) => {
              let pattern = test.pattern.replace('%word%', word);
              if (chunk.has(pattern)) {
                console.log('    Confirmed ' + pos + ': ' + pattern);
                result = 'confirmed';
             }
           });
        }

        return result;
     }

     const word = term.word;
     const POSes = term.POSes.map(pos => (posabbreviationToName(pos)));

    const results = {};
    Object.values(POSes).forEach((pos) => {
      results[pos] = 'untested';
    });

     console.log('Possible POSes:' + JSON.stringify(POSes));

     Object.values(POSes).forEach((pos) => {
       console.log('Testing POS: [' + pos + ']');

       results[pos] = isPOS(word, pos);
     });

     let confirmed = [];
     let probable = [];
     let eliminated = [];
     let docWord = chunk.match(word);
     let foundPOS = false;

     // Check for a clear winner.
     Object.keys(results).forEach((pos) => {
        let result = results[pos];
        if (result === 'confirmed') {
           confirmed.push(pos);
        }
     });

     if (confirmed.length === 1) {
        foundPOS = compromiseTagged(confirmed[0]);
     } else {

        if (confirmed.length > 1) {
          Object.values(confirmed).forEach((pos) => {
             let posTag = compromiseTagged(pos);
             if (docWord.has(posTag)) {
               foundPOS = posTag;
             }
          });
          if (foundPOS === false) {
             probable = confirmed;
          }
        }

        if (foundPOS === false) {
          Object.keys(results).forEach((pos) => {
             let result = results[pos];
              if ( result === 'probable') {
                probable.push(pos);
              }
          });

          if (probable.length === 1) {
             foundPOS = compromiseTagged(probable[0]);
          } else if (probable.length > 1) {
             Object.values(probable).forEach((pos) => {
                let posTag = compromiseTagged(pos);
                if (docWord.has(posTag)) {
                   foundPOS = posTag;
                }
             });
          }
       }

       if (foundPOS === false) {
          Object.keys(results).forEach((pos) => {
             let result = results[pos];
             if (result === 'eliminated') {
                eliminated.push(pos);
             }
          });

          console.log('checking eliminated');
          Object.values(eliminated).forEach((pos) => {
             let posTag = compromiseTagged(pos);
             if (docWord.has(posTag)) {
                console.log('fix word pos');
                foundPOS = 'fixPOS';
             }
          });
       }
  }

  if (foundPOS === 'fixPOS') {
     console.log('fixing bad POS.');
     let candidates = probable;
     let remainders = [];

     Object.keys(results).forEach((pos) => {
       let result = results[pos];
       if (result === 'inconclusive') {
          candidates.push(pos);
       }
    });

    let docBeforePOS = chunk.match(word).lookBehind('.');
    let docAfterPOS = chunk.match(word).lookAhead('.');

    Object.values(candidates).forEach((pos) => {
       let posTag = compromiseTagged(pos);
       if ((!docBeforePOS.has(posTag)) && (!docAfterPOS.has(posTag))) {
          remainders.push(posTag);
       }
    });

    if (remainders.length === 0) {
       foundPOS = false;
    } else {
       foundPOS = remainders[0];
    }
  }

  if (foundPOS !== false) {
    console.log('Updating POS');

    if (!(docWord.has(foundPOS))) {
       console.log('Changed to ' + foundPOS);
       docWord.tag(foundPOS);
    } else {
       console.log('Already correct POS');
    }
  }

  console.log(results);
  return (foundPOS);

 }


 // Initialize all Data

  const disambiguationFilePath = './data/disambiguation/';
  const disambiguationFileType = '.json';
  const disambiguationFiles = mfs.getFileNames(disambiguationFilePath, disambiguationFileType);
  let disambiguationTerms = [];

  const sentences = doc.sentences();

  // Process by Disambiguation Term File first, then ...
  // Process the document by sentences and then by non-list commas

  disambiguationFiles.forEach((file) => {
    disambiguationTerms = mfs.loadJSONFile(file, 'array');

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
  });
}
