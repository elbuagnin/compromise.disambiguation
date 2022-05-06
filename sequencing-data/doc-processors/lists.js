export default function processor(doc) {
  if (doc.has("#Comma") && doc.has("#CoordinatingConjunction")) {
    const sentences = doc.sentences();
    sentences.forEach(sentence => {
      if (sentence.has("#Comma") && sentence.has("#CoordinatingConjunction")) {
        // console\.log.*
        const coordinatingConjunctions = sentence.match(
          "#CoordinatingConjunction"
        );
        coordinatingConjunctions.forEach(conjunction => {
          // console\.log.*
          const list = [];
          const penultimateWord = conjunction.lookBehind(".").last();
          // console\.log.*
          const listPOS =
            "#" + Object.values(penultimateWord.out("tags")[0])[0][0];
          // console\.log.*
          list.push(conjunction.lookAfter(listPOS).first());
          let commaWord = conjunction.lookBehind("#Comma").last();
          while (commaWord.has("#Comma")) {
            list.push(commaWord);
            commaWord = commaWord.lookBehind("#Comma").last();
          }
          // console\.log.*

          if (list.length > 2) {
            list.forEach(word => {
              word.tag("#ListItem");
            });
          }
        });
      }
    });
  }
}
