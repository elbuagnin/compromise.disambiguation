export default function processor(doc) {
  if (doc.has("@hasDash")) {
    const sentences = doc.sentences();
    sentences.forEach(sentence => {
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

          segment.firstTerms().tag("openingDash");
          segment.lastTerms().tag("closingDash");
        }
      });
    });
  }
}
