import * as mfs from './lib/filesystem.js';

export default function preParser(document) {
  function assignValues(data) {
    Object.values(data).forEach((rule) => {
      const { term } = rule;
      const { pattern } = rule;
      const { batchOrder } = rule;

      let tag = '';
      if (rule.tag) { tag = rule.tag; }
      let untag = '';
      if (rule.untag) { untag = rule.untag; }

      if (term && pattern) {
        if (document.has(pattern)) {
          const matchedTerm = document.match(pattern).match(term);
          console.log('\nPreparser:');
          console.log(`Batch: ${batchOrder}`);
          console.log(matchedTerm.text());

          if (untag) {
            matchedTerm.untag(untag);
            console.log(`Removing tag: ${untag}`);
          }
          if (tag) {
            matchedTerm.tag(tag);
            console.log(`Assigning tag: ${tag}`);
          }
        }
      }
    });
  }

  function tagProgressiveVerbals() {
     function isINGVerbal(word) {
       if (word.text().substring(word.text().length - 3) === 'ing') {
          const testWord = word.clone();
          testWord.tag('#Verb');
          let stemmed = testWord.verbs().toInfinitive();
          if (stemmed.has('#Verb')) {
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

      const INGs = document.match('/ing$/');
      INGs.forEach((word) => {
         if (isINGVerbal(word) === true) {
           word.tag('#ProgressiveVerbal');
         }
      });
  }

  function tagHyphenatedTerms() {
    const hyphenatedTerms = document.hyphenated();
    hyphenatedTerms.tag(['#Noun', 'Singular', 'Hyphenated']);
    console.log('Hyphenated:');
    console.log(hyphenatedTerms.debug());
  }

  function tagParentheses() {
    const parenthesesGroups = document.parentheses();
    if (parenthesesGroups.found) {
      parenthesesGroups.firstTerms().tag('BEGIN');
      parenthesesGroups.lastTerms().tag('END');
      parenthesesGroups.tag('parenthesesGroup');
      console.log('Parentheses:');
      console.log(parenthesesGroups.debug());
    }
  }

  function tagQuotations() {
    const quotationGroups = document.quotations();
    if (quotationGroups.found) {
      quotationGroups.firstTerms().tag('BEGIN');
      quotationGroups.lastTerms().tag('END');
      quotationGroups.tag('QuotationGroup');
      console.log('Quotations:');
      console.log(quotationGroups.debug());
    }
  }

  function tagDashGroups() {
    if (document.has('@hasDash')) {
      const sentences = document.sentences();
      sentences.forEach((sentence) => {
        const dashedWords = sentence.match('@hasDash');
        const totalDashes = dashedWords.length;

        dashedWords.forEach((word, i) => {
          if ((i % 2) === 0) {
            let segment = sentence.splitAfter(word).last();

            if (i < totalDashes) {
              const nextDash = segment.match('@hasDash');

              if (nextDash.next().found) {
                segment = segment.before(nextDash.next());
              }
            }

            segment.firstTerms().tag('BEGIN');
            segment.lastTerms().tag('END');
            segment.tag('DashGroup');
            console.log('Dashes:');
            console.log(word.debug());
          }
        });
      });
    }
  }

  function tagPunctuation() {
    document.sentences().forEach((sentence) => {
      sentence.if('@hasPeriod').lastTerms().tag('Period');
      sentence.if('@hasQuestionMark').lastTerms().tag('QuestionMark');
      sentence.if('@hasExclamation').lastTerms().tag('ExclamationMark');

      sentence.match('@hasComma').tag('Comma');
      sentence.match('@hasSemicolon').tag('Semicolon');
      // sentence.match('@hasColon').tag('Colon'); // implement?
    });
  }

  // Custom tags & words & disambiguation
  // Rule order is critical for correct assignments.
  const rulePath = './data/pre-parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(rulePath, list);
  const orderedRules = [];
  Object.values(ruleSets).forEach((ruleSet) => {
    Object.values(ruleSet).forEach((rule) => {
      orderedRules.push(rule);
    });
  });

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder);

  // Normalize the document for parsing.
  console.log('Contractions:');
  //document.contractions().expand().fix();
  tagHyphenatedTerms();
  //compromiseInfinitivesToSyntaxBaseVerbs();
  tagProgressiveVerbals();
  assignValues(orderedRules);
  tagParentheses();
  tagQuotations();
  tagDashGroups();
  tagPunctuation();
}
