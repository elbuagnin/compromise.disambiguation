import * as mfs from './lib/filesystem.js';

export default function postParser(document) {
  function assignValues(data) {
    Object.values(data).forEach((rule) => {
      const { term } = rule;
      const { pattern } = rule;
      const { batchOrder } = rule;
      const { order } = rule;

      let tag = '';
      if (rule.tag) { tag = rule.tag; }
      let untag = '';
      if (rule.untag) { untag = rule.untag; }

      if (term && pattern) {
        if (document.has(pattern)) {
          const matchedTerm = document.match(pattern).match(term);
          console.log('\npostParser:');
          console.log(`Batch: ${batchOrder}: #${order}`);
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

  // Custom tags & words & disambiguation
  // Rule order is critical for correct assignments.
  const rulePath = './data/post-parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(rulePath, list);
  const orderedRules = [];
  Object.values(ruleSets).forEach((ruleSet) => {
    Object.values(ruleSet).forEach((rule) => {
      orderedRules.push(rule);
    });
  });

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder || a.order - b.order);

  assignValues(orderedRules);
}
