export default function tagLists(doc) {
  if (doc.has("#Comma") && doc.has("#CoordinatingConjunction")) {
    const sentences = doc.sentences();
    sentences.forEach((sentence) => {
      if (sentence.has("#Comma") && sentence.has("#CoordinatingConjunction")) {
        const coordinatingConjunctions = sentence.match(
          "#CoordinatingConjunction"
        );
        coordinatingConjunctions.forEach((conjunction) => {
          const list = [],
            penultimateWord = conjunction.lookBehind(".").last(),
            listPOS = "#" + Object.values(penultimateWord.out("tags")[0])[0][0];
          list.push(conjunction.lookAfter(listPOS).first());
          let commaWord = conjunction.lookBehind("#Comma").last();
          for (; commaWord.has("#Comma"); )
            list.push(commaWord),
              (commaWord = commaWord.lookBehind("#Comma").last());
          list.length > 2 &&
            list.forEach((word) => {
              word.tag("#ListItem");
            });
        });
      }
    });
  }
  
}