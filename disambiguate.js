import posNameNormalize from './pos-name-table.js';
import posTests from './pos-tests.js';

export default function disambiguate(chunk, term) {
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
   if (!(chunk.has(word))) {
      return false;
   }

   const POSes = term.POSes.map(pos => (posNameNormalize(pos)));

  const results = {};
  Object.values(POSes).forEach((pos) => {
    results[pos] = 'untested';
  });
   console.log('Term: ' + word);
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
     console.log(word + ' changed to ' + foundPOS);
     docWord.tag(foundPOS);
  } else {
     console.log(word + ' already is correct POS');
  }
}

console.log(results);

}
