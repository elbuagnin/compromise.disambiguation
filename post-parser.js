import * as mfs from './lib/filesystem.js';

export default function postParser(document) {
  function assignValues(data) {
    Object.values(data).forEach((rule) => {
      const { term } = rule;
      const { pattern } = rule;

      let tag = '';
      if (rule.tag) { tag = rule.tag; }
      let untag = '';
      if (rule.untag) { untag = rule.untag; }

      if (term && pattern) {
        if (document.has(pattern)) {
          const matchedTerm = document.match(pattern).match(term);




          if (untag) {
            matchedTerm.untag(untag);

          }
          if (tag) {
            matchedTerm.tag(tag);

          }
        }
      }
    });
  }

  // Custom tags & words & disambiguation
  // Rule order is critical for correct assignments.
  const rulePath = './data/post-parser/';
  const list = true;
  const orderedRules = mfs.loadJSONDir(rulePath, list);

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder || a.order - b.order);

  assignValues(orderedRules);
}
