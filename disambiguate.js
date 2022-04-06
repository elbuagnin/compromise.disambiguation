import posNameNormalize from "./pos-name-table.js";
import posTests from "./pos-tests.js";

export default function disambiguate(doc, term) {
  function compromiseTagged(pos) {
    return "#" + pos.charAt(0).toUpperCase() + pos.slice(1);
  }

  function clearOldTags(docWord) {
    const tagExceptions = [
      "Period",
      "Comma",
      "QuestionMark",
      "ExclamationPoint",
      "Semicolon",
      "OpenParentheses",
      "CloseParentheses",
      "OpenQuote",
      "CloseQuote",
    ];
    const oldTags = Object.values(docWord.out("tags")[0])[0];

    const filteredTags = oldTags.filter((tag) => {
      if (tagExceptions.indexOf(tag)) {
        return tag;
      }
    });

    docWord.unTag(filteredTags);
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
          result += score(test.type);
        }
      });
    }

    let result = 0;
    const testTypes = ["negative", "improbable", "probable", "positive"];
    const testSet = posTests.filter((test) => test.pos === pos);

    testTypes.forEach((type) => {
      const tests = testSet.filter((test) => test.type === type);
      testing(tests);
    });

    return result;
  }

  function compareResults(results) {
    const ties = [];
    const winner = Object.keys(results).reduce((previous, current) => {
      const diff = results[current] - results[previous];

      switch (Math.sign(diff)) {
        case -1:
          return previous;
        case 0:
          ties.push(previous);

          return current;
        case 1:
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
  if (doc.has(word) && !doc.match(word).has("#Resolved")) {
    const POSes = term.POSes.map((pos) => posNameNormalize(pos));

    const results = {};
    Object.values(POSes).forEach((pos) => {
      results[pos] = 0;
    });

    Object.values(POSes).forEach((pos) => {
      results[pos] = isPOS(word, pos);
    });

    const winner = compareResults(results);

    if (winner.length > 1) {
      return;
    } else {
      const disambiguatedPOS = compromiseTagged(winner[0]);
      const docWord = doc.match(word);
      if (docWord.has(disambiguatedPOS)) {
        docWord.tag("resolved");
        docWord.debug();
        return;
      } else {
        clearOldTags(docWord);
        docWord.tag(disambiguatedPOS);
        docWord.tag("resolved");
        docWord.debug();
        return;
      }
    }
  }
}
