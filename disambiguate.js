import posNameNormalize from "./pos-name-table.js";
import posTests from "./pos-tests.js";

export default function disambiguate(doc, term, match) {
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

  function isPOS(word, pos, match) {
    function testing(tests, match) {
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
        let pattern = test.pattern.replace("%word%", match.text());

        let chunk = findChunk(test.scope);
        if (chunk.has(pattern)) {
          result += score(test.type);
          console.log('"' + pattern + '" - score: ' + pos + " is " + result);
        }
      });
    }

    let result = 0;
    const testTypes = ["negative", "improbable", "probable", "positive"];
    const testSet = posTests.filter((test) => test.pos === pos);

    testTypes.forEach((type) => {
      const tests = testSet.filter((test) => test.type === type);
      testing(tests, match);
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

  if (!match.has("#Resolved")) {
    const POSes = term.POSes.map((pos) => posNameNormalize(pos));

    const results = {};
    Object.values(POSes).forEach((pos) => {
      results[pos] = 0;
    });

    Object.values(POSes).forEach((pos) => {
      results[pos] = isPOS(word, pos, match);
    });
    console.log(JSON.stringify(results));
    const winner = compareResults(results);

    if (winner.length > 1) {
      return;
    } else {
      const disambiguatedPOS = compromiseTagged(winner[0]);

      if (match.has(disambiguatedPOS)) {
        match.tag("resolved");
        match.debug();
        return;
      } else {
        clearOldTags(match);
        match.tag(disambiguatedPOS);
        match.tag("resolved");
        console.log("Disambiguated");
        match.debug();
        return;
      }
    }
  }
}
