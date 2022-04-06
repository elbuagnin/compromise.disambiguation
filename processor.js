export default function process(doc, parsingData) {
  function equivalentDocs(docA, docB) {
    let m = 0;

    for (let i = 0; i < docA.termList().length; i++) {
      let n = 0;
      let tagCount = 0;
      const docATags = docA.termList()[i].tags;

      Object.keys(docATags).forEach((docATag) => {
        tagCount++;

        Object.keys(docB.termList()[i].tags).forEach((docBTag) => {
          if (docATag === docBTag) {
            n++;
          }
        });
      });
      if (n === tagCount) {
        m++;
      }
    }
    if (m === docA.termList().length) {
      return true;
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

  if (!equivalentDocs(before, after)) {
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

function tagHyphenatedTerms(doc) {
  const hyphenatedTerms = doc.hyphenated();
  hyphenatedTerms.tag(["#Noun", "Singular", "Hyphenated"]);
}

function ingVerbals(doc) {
  function isINGVerbal(word) {
    if (word.text().substring(word.text().length - 3) === "ing") {
      const testWord = word.clone();
      testWord.tag("#Verb");
      let stemmed = testWord.verbs().toInfinitive();
      if (stemmed.has("#Verb")) {
        if (stemmed.text() === word.text()) {
          return false;
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
