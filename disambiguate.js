import posNameNormalize from "./pos-name-table.js";
import posTests from "./pos-tests.js";

export default function disambiguate(doc, term) {
  function compromiseTagged(pos) {
    return "#" + pos.charAt(0).toUpperCase() + pos.slice(1);
  }

  function isPOS(word, pos) {
    function testing(tests) {
      function findChunk(scope) {
        if (scope === "phrase") {
          return doc;
        } else if (scope === "sentence") {
          if (doc.parent() === doc) {
            return doc;
          } else {
            return doc.parent();
          }
        }
      }

      function score(type) {
        switch (type) {
          case "negative":
            return -2;
          case "improbable":
            return -1;
          case "probable":
            return 1;
          case "positive":
            return 2;
          default:
            return 0;
        }
      }

      tests.forEach((test) => {
        let pattern = test.pattern.replace("%word%", word);
        let chunk = findChunk(test.scope);
        if (chunk.has(pattern)) {
          console.log("    " + test.type + "  " + pos + ": " + pattern);
          result += score(test.type);
        }
      });
    }

    let result = 0;
    let negativeTests = [];
    let improbableTests = [];
    let probableTests = [];
    let positiveTests = [];

    let testSet = posTests.filter((test) => test.pos === pos);

    if (testSet.length > 0) {
      negativeTests = testSet.filter((test) => test.type === "negative");
      improbableTests = testSet.filter((test) => test.type === "improbable");
      probableTests = testSet.filter((test) => test.type === "probable");
      positiveTests = testSet.filter((test) => test.type === "positive");
    }

    testing(negativeTests);
    testing(improbableTests);
    testing(probableTests);
    testing(positiveTests);

    return result;
  }

  function compareResults(results) {
    const ties = [];
    const winner = Object.keys(results).reduce((previous, current) => {
      console.log("Ties for now include: " + ties);
      const diff = results[current] - results[previous];
      console.log(current + " - " + previous);
      console.log(diff);
      switch (Math.sign(diff)) {
        case -1:
          console.log("previous is bigger");
          return previous;
        case 0:
          ties.push(previous);
          console.log("it is a tie");
          return current;
        case 1:
          console.log("current is bigger");
          ties.length = 0;
          return current;
        default:
          break;
      }
    });

    if (ties.length > 0) {
      ties.push(winner);
      return ties;
    } else {
      return [winner];
    }
  }

  ///////
  // Main

  const word = term.word;
  if (!doc.has(word)) {
    return false;
  }

  const POSes = term.POSes.map((pos) => posNameNormalize(pos));

  const results = {};
  Object.values(POSes).forEach((pos) => {
    results[pos] = 0;
  });

  console.log("Term: " + word);
  console.log("Possible POSes:" + JSON.stringify(POSes));

  Object.values(POSes).forEach((pos) => {
    console.log("Testing POS: [" + pos + "]");

    results[pos] = isPOS(word, pos);
  });

  console.log(results);
  const winner = compareResults(results);
  console.log(winner);

  if (winner.length > 1) {
    return;
  } else {
    const disambiguatedPOS = compromiseTagged(winner[0]);
    const docWord = doc.match(word);
    if (docWord.has(disambiguatedPOS)) {
      console.log("Already correct POS");
      return;
    } else {
      console.log("Changing POS on " + word + " to " + disambiguatedPOS);
      // const oldTags = docWord.out('tags');
      // docWord.unTag(oldTags);
      docWord.tag(disambiguatedPOS);
      return;
    }
  }
}
