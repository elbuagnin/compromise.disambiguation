import nlp from "compromise";

function addCustomTags(tagData) {
  const obj = {};
  Object.keys(tagData).forEach((k) => {
    const tag = tagData[k];
    obj[k] = tag;
  });

  nlp.plugin({
    tags: obj,
  });
}

function addCustomWords(wordData) {
  const obj = {};
  Object.keys(wordData).forEach((k) => {
    const word = wordData[k];
    obj[k] = word;
  });

  nlp.plugin({
    words: obj,
  });
}

const addDocMethods = {
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
      }),
      (View.prototype.copy = function () {
        const copy = this.termList().map((term) => {
          let text = term.text.toString();
          let tags = [];
          term.tags.forEach((tag) => {
            tags.push(tag.toString());
          });

          return { text: text, tags: tags };
        });
        return copy;
      });
  },
};

export { addDocMethods, addCustomTags, addCustomWords };
