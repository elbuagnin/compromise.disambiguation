export default function tagger(doc, payload) {
  const { pattern, term, tag, untag } = payload;

  if (doc.has(pattern)) {
    const matchedTerm = doc.match(pattern).match(term);
    console.log('Tagger matched: ' + matchedTerm.text());

    if (untag) {
      matchedTerm.untag(untag);
      console.log(`Tagger is removing tag: ${untag}`);
    }
    if (tag) {
      matchedTerm.tag(tag);
      console.log(`Tagger is assigning tag: ${tag}`);
    }
  }
}
