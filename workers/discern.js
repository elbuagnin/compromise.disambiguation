import devLogger from "../lib/dev-logger.js";
import nlp from "compromise";
import classificationNameNormalize from "../data-interface/classifications-key.js";
import classifyByPatternTests from "../data-interface/classifier-patterns.js";
import tagExceptions from "../data-interface/remove-old-tag-exceptions-list.js";

export default function discern(doc, term, match) {
  function compromiseTagFormat(tag) {
    return "#" + tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  function clearOldTags(docWord) {
    const oldTags = Object.values(docWord.out("tags")[0])[0];

    const filteredTags = oldTags.filter((tag) => {
      if (!tagExceptions().includes(tag)) {
        return tag;
      }
    });

    devLogger("details", "Removing Old Tags", "header");
    devLogger("details", filteredTags, "label", "Untagging");

    docWord.unTag(filteredTags);
  }

  function isClassification(word, classification, match) {
    function testing(tests, match) {
      function findChunk(scope) {
        if (scope === "phrase") {
          return doc;
        } else if (scope === "sentence") {
          if (doc.all() === doc) {
            return doc;
          } else {
            return doc.all();
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

      function wordsInPattern(pattern) {
        if (pattern.includes("+")) {
          return doc.wordCount();
        }

        let count = 0;

        count -= pattern.split(/\(.+&&.+\)/).length - 1; // ( term && other )
        count -= pattern.split(/\|/).length - 1; // ( term | term )
        count += pattern.split(/[\w|-|_|#|\?|\+]+/).length - 1; // word
        count += pattern.split(/\s\d+\s/).length - 1; // number

        if (count < 0) {
          count = 0;
        }

        return count;
      }

      // testing main
      devLogger(
        "workers",
        classification,
        "header",
        "Testing for Classification"
      );

      let singleTestResult = 0;

      tests.forEach((test) => {
        let result = 0;
        let chunk = findChunk(test.scope);
        let patternWord = "%word%";

        const regex = /\(\s?%word%\s?&&\s?\/?\^?\!?#?(?:\w|-|_)+\$?\/?\s?\)|\(\s?\/?\^?\!?#?(?:\w|-|_)+\$?\/?\s?&&\s?%word%\s?\)/;
        if (test.pattern.match(regex)) {
          patternWord = test.pattern.match(regex);
        }

        const splitPatterns = test.pattern.split(patternWord);
        const frontPattern = splitPatterns[0].trim();
        const backPattern = splitPatterns[1].trim();

        let patternType = 0;

        if (frontPattern) {
          patternType += 1;
        }
        if (backPattern) {
          patternType += 2;
        }

        let length = 0;
        let extraWords = "";
        let selection = "";
        let wholePattern = "";

        switch (patternType) {
          case 1:
            length = wordsInPattern(frontPattern) + 1;
            extraWords = ".{0," + length + "}";
            wholePattern = [frontPattern, patternWord].join(" ");
            selection = chunk.match(match).growLeft(extraWords);
            selection = selection.intersection(chunk);
            break;
          case 2:
            length = wordsInPattern(backPattern) + 1;
            extraWords = ".{0," + length + "}";
            wholePattern = [patternWord, backPattern].join(" ");
            selection = chunk.match(match).growRight(extraWords);
            selection = selection.intersection(chunk);
            break;
          case 3:
            length = wordsInPattern(frontPattern) + 1;
            extraWords = ".{0," + length + "}";
            selection = chunk.match(match).growLeft(extraWords);
            length = wordsInPattern(backPattern) + 1;
            extraWords = "";
            extraWords = ".{0," + length + "}";
            selection = selection.growRight(extraWords);
            selection = selection.intersection(chunk);
            wholePattern = [frontPattern, patternWord, backPattern].join(" ");

            break;
          default:
            break;
        }
        if (typeof word === "object") {
          word = word.text();
        }
        wholePattern = wholePattern.replace("%word%", word).trim();
        const selectionMatch = selection.match(wholePattern);

        if (selectionMatch.found) {
          result = score(test.type);
          singleTestResult += result;
        }

        devLogger("details", "Single Test", "header");
        const devSubHeader = "Is '" + word + "' a " + classification + "?";
        devLogger("details", devSubHeader, "subheader");
        devLogger("details", wholePattern, "label", "pattern");
        devLogger("details", chunk, "label", "chunk");
        devLogger("details", selection, "label", "selection");
        devLogger("details", result, "label", "score");
      });

      return singleTestResult;
    }

    const testTypes = ["negative", "improbable", "probable", "positive"];
    devLogger(
      "details",
      classifyByPatternTests(),
      "label",
      "Classification Test: "
    );
    const testSet = classifyByPatternTests().filter(
      (test) => test.classification === classification
    );

    let totalTestsResult = 0;
    testTypes.forEach((type) => {
      const tests = testSet.filter((test) => test.type === type);
      totalTestsResult += testing(tests, match);
    });

    const devSummarySubHeader = "Is '" + word + "' a " + classification + "?";
    devLogger("workers", "Classification Tests Summary", "header");
    devLogger("workers", devSummarySubHeader, "subheader");
    devLogger("workers", totalTestsResult, "label", "Total Test Result");
    devLogger("workers", "".padStart(28, "~"));

    return totalTestsResult;
  }

  function discernResults(results) {
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
  devLogger("workers", word, "subtitle", "term");

  if (!match.has("#Resolved")) {
    const classifications = term.classifications.map((classification) =>
      classificationNameNormalize(classification)
    );

    const results = {};
    Object.values(classifications).forEach((classification) => {
      results[classification] = 0;
    });

    Object.values(classifications).forEach((classification) => {
      results[classification] = isClassification(word, classification, match);
    });

    const winner = discernResults(results);

    if (winner.length > 1) {
      return;
    } else {
      const discernedClassification = compromiseTagFormat(winner[0]);
      devLogger("changes", "Discerned Classicication", "header");
      devLogger("changes", results, "label", "Results");
      devLogger("changes", match, "label", discernedClassification);

      if (match.has(discernedClassification)) {
        match.tag("Resolved");

        return;
      } else {
        clearOldTags(match);
        match.tag(discernedClassification);
        match.tag("Resolved");

        return;
      }
    }
  }
}
