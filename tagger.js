export default function tagger(chunk, payload) {
  const { pattern, term, tag, untag } = payload;

  if (chunk.has(pattern)) {
    const matchedTerm = chunk.match(pattern).match(term);
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
