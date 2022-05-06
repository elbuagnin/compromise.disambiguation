export default function processor(doc) {
    const hyphenatedTerms = doc.hyphenated();
    hyphenatedTerms.tag(["#Noun", "Singular", "Hyphenated"]);
}
