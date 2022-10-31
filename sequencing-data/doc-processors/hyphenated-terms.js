export default function tagHyphenated(doc) {
    const hyphenatedTerms = doc.hyphenated();
    hyphenatedTerms.tag(["#Noun", "Singular", "Hyphenated"]);
    
}