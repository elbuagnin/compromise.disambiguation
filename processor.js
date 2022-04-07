import nlp from "compromise";

export default function process(doc, parsingData) {
  function equivalentDocs(docA, docB) {
    let termListLength = 0;
    if (docA.termList().length === docB.termList().length) {
      termListLength = docA.termList().length;

      let m = 0;

      for (let i = 0; i < termListLength; i++) {
        let n = 0;
        let tagCount = 0;
        const docATags = docA.termList()[i].tags;
        const docBTags = docB.termList()[i].tags;

        if (Object.keys(docATags).length === Object.keys(docBTags).length) {
          Object.keys(docATags).forEach((docATag) => {
            tagCount++;

            Object.keys(docBTags).forEach((docBTag) => {
              if (docATag === docBTag) {
                n++;
              }
            });
          });

          if (n === tagCount) {
            m++;
          }
        } else {
          return false;
        }
      }

      if (m === termListLength) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const { process } = parsingData;
  const before = doc.clone();

  switch (process) {
    case "tagDashGroups":
      tagDashGroups(doc);
      break;
    case "expandContractions":
      expandContractions(doc);
      break;
    case "compoundNouns":
      compoundNouns(doc);
      break;
    case "tagHyphenatedTerms":
      tagHyphenatedTerms(doc);
      break;
    case "ingVerbals":
      ingVerbals(doc);
      break;
    case "tagParentheses":
      tagParentheses(doc);
      break;
    case "tagPunctuation":
      tagPunctuation(doc);
      break;
    case "tagQuotations":
      tagQuotations(doc);
      break;
    default:
      break;
  }

  const after = doc.clone();
  if (equivalentDocs(before, after) === false) {
    console.log("Processed");
    doc.debug();
  }
}

function tagDashGroups(doc) {
  if (doc.has("@hasDash")) {
    const sentences = doc.sentences();
    sentences.forEach((sentence) => {
      const dashedWords = sentence.match("@hasDash");
      const totalDashes = dashedWords.length;

      dashedWords.forEach((word, i) => {
        if (i % 2 === 0) {
          let segment = sentence.splitAfter(word).last();

          if (i < totalDashes) {
            const nextDash = segment.match("@hasDash");

            if (nextDash.next().found) {
              segment = segment.before(nextDash.next());
            }
          }

          segment.firstTerms().tag("BEGIN");
          segment.lastTerms().tag("END");
          segment.tag("DashGroup");
        }
      });
    });
  }
}

function expandContractions(doc) {
  doc.contractions().expand();
}

function compoundNouns(doc) {
  const backToBackNouns = doc.match(
    "(#Noun && !#Pronoun) (#Noun && !#Pronoun)"
  );
  console.log(backToBackNouns);

  backToBackNouns.forEach((pair) => {
    let test = true;
    const first = pair.match("^.").clone();
    const last = pair.match(".$").clone();

    if (!first.has("#Noun")) {
      test *= false;
    }
    if (!last.has("#Noun")) {
      test *= false;
    }

    if (test === true) {
      pair.tag("resolved");
    }
  });
}

function tagHyphenatedTerms(doc) {
  const hyphenatedTerms = doc.hyphenated();
  hyphenatedTerms.tag(["#Noun", "Singular", "Hyphenated"]);
}

function ingVerbals(doc) {
  function isINGVerbal(word) {
    function stem(text) {
      function isVowel(character) {
        const vowels = "aeiou";
        if (vowels.includes(character)) {
          return true;
        } else {
          return false;
        }
      }

      function vowelPattern(string) {
        let pattern = "";
        string.forEach((character) => {
          if (isVowel(character) === true) {
            pattern += "v";
          } else {
            pattern += "c";
          }
        });

        return pattern;
      }

      text = text.substring(0, text.length - 3);
      const end = text.length;

      // Double character end
      if (
        text.substring(text.length - 1) ===
        text.substring(text.length - 2, text.length - 1)
      ) {
        const doubleEnd = text.substring(-2);
        console.log(doubleEnd);
        switch (doubleEnd) {
          case "ee":
            break;
          case "bb" | "gg" | "ll" | "nn" | "pp" | "rr" | "tt":
            text = text.substring(0, text.length - 1);
            break;
          default:
            break;
        }
        return text;
      }

      // Ends in 'y'
      if (text.substring(text.length - 1) === "y") {
        if (!isVowel(text.charAt(end - 2))) {
          text = text.substring(end - 1) + "ie";
          return text;
        }
      }

      // Ends in 'ck'
      if (text.substring(end - 2, end - 1) === "ck") {
        const option1 = text;
        const option2 = text.substring(0, end - 1);

        if (nlp(option1).has("#Verb")) {
          return option1;
        } else if (nlp(option2).has("#Verb")) {
          return option2;
        }
      }

      // Dropped 'e'
      if (vowelPattern(text.substring(end - 3, end - 1)) === "cvc") {
        const option1 = text;
        const option2 = text + "e";

        if (nlp(option1).has("#Verb")) {
          return option1;
        } else if (nlp(option2).has("#Verb")) {
          return option2;
        }
      }

      // Default: no adjustments
      return text;
    }

    if (word.text().substring(word.text().length - 3) === "ing") {
      const testWord = word.clone();
      testWord.tag("#Verb");
      let stemmed = testWord.verbs().toInfinitive();
      if (stemmed.has("#Verb") || stemmed.has("#Infinitive")) {
        if (stemmed.text() === word.text()) {
          const manualStemmed = nlp(stem(word.text()));
          if (manualStemmed.has("#Verb")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const INGs = doc.match("/ing$/");
  INGs.forEach((word) => {
    if (isINGVerbal(word) === true) {
      word.tag("#ProgressiveVerbal");
    }
  });
}

function tagParentheses(doc) {
  const parenthesesGroups = doc.parentheses();
  if (parenthesesGroups.found) {
    parenthesesGroups.firstTerms().tag("OpenParentheses");
    parenthesesGroups.lastTerms().tag("CloseParentheses");
  }
}

function tagPunctuation(doc) {
  doc.sentences().forEach((sentence) => {
    sentence.if("@hasPeriod").lastTerms().tag("Period");
    sentence.if("@hasQuestionMark").lastTerms().tag("QuestionMark");
    sentence.if("@hasExclamation").lastTerms().tag("ExclamationMark");

    sentence.match("@hasComma").tag("Comma");
    sentence.match("@hasSemicolon").tag("Semicolon");
    // sentence.match('@hasColon').tag('Colon'); // implement?
  });
}

function tagQuotations(doc) {
  const quotationGroups = doc.quotations();
  if (quotationGroups.found) {
    quotationGroups.firstTerms().tag("OpenQuote");
    quotationGroups.lastTerms().tag("CloseQuote");
  }
}
