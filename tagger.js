export default function tagger(doc, payload) {
  const { pattern, term, tag, untag, disambiguate } = payload;

  if (doc.has(pattern)) {
    const matchedTerm = doc.match(pattern).match(term);
    console.log("Tagger matched: " + matchedTerm.text());

    if (
      (disambiguate === true && !matchedTerm.has("Resolved")) ||
      disambiguate !== true
    ) {
      if (disambiguate === true) {
        const oldTags = Object.values(matchedTerm.out("tags")[0])[0];
        console.log(oldTags);
        matchedTerm.unTag(oldTags);
        matchedTerm.tag("resolved");
      }
      if (untag) {
        matchedTerm.untag(untag);
        console.log(`Tagger is removing tag: ${untag}`);
      }
      if (tag) {
        matchedTerm.tag(tag);
        console.log(`Tagger is assigning tag: ${tag}`);
        console.log(matchedTerm.debug());
      }

      console.log(matchedTerm.debug());
    } else {
      console.log("Not processing.");
    }
  }
}
