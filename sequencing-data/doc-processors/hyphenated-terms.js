export default function processor(doc) {
    function tagHyphenatedTerms(doc) {
    const hyphenatedTerms = doc.hyphenated();
    hyphenatedTerms.tag(["#Noun", "Singular", "Hyphenated"]);
  }
}
