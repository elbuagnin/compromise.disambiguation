import nlp from "compromise";

export function addCustomTags(tagData) {
  const obj = {};
  Object.keys(tagData).forEach((k) => {
    const tag = tagData[k];
    obj[k] = tag;
  });

  nlp.extend((_Doc, world) => {
    world.addTags(obj);
  });
}

export function addCustomWords(wordData) {
  const obj = {};
  Object.keys(wordData).forEach((k) => {
    const word = wordData[k];
    obj[k] = word;
  });

  nlp.extend((_Doc, world) => {
    world.addWords(obj);
  });
}

nlp.plugin({
  api: (View) => {
    (View.prototype.previous = function (quantity = 0) {
      const precedingSegment = this.before();
      let precedingWord = precedingSegment.lastTerms();
      let precedingWords = precedingWord;

      for (let i = 1; i < quantity; i++) {
        precedingWords = precedingWord.union(precedingWords);
        precedingWord = precedingWord.before().lastTerms();
      }

      if (precedingWords.found) {
        return precedingWords;
      } else {
        return this.match("");
      }
    }),
      (View.prototype.next = function (quantity = 0) {
        const succedingSegment = this.after();
        let succedingWord = succedingSegment.firstTerms();
        let succedingWords = succedingWord;

        for (let i = 1; i < quantity; i++) {
          succedingWords = succedingWords.union(succedingWord);
          succedingWord = succedingWord.after().firstTerms();
        }

        if (succedingWords.found) {
          return succedingWords;
        } else {
          return this.match("");
        }
      });
  },
});
