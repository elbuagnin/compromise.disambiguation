import nlp from 'compromise';

export function addCustomTags (tagData) { // eslint-disable-line
    const obj = {};
    Object.keys(tagData).forEach((k) => {
      const tag = tagData[k];
      obj[k] = tag;
    });

    nlp.extend((_Doc, world) => {
      world.addTags(obj);
    })
  }

  export function addCustomWords (wordData) { // eslint-disable-line
    const obj = {};
    Object.keys(wordData).forEach((k) => {
      const word = wordData[k];
      obj[k] = word;
    });

    nlp.extend((_Doc, world) => {
      world.addWords(obj);
    }) 
  }

  // _Doc.prototype.previous = function () { // eslint-disable-line
  //   const precedingWords = this.all().before(this);
  //   const precedingWord = precedingWords.lastTerms();
  //
  //   if (precedingWord.found) {
  //     return precedingWord;
  //   } return this.match(nothing);
  // };
  //
  //   _Doc.prototype.next = function () { // eslint-disable-line
  //   const succeedingWords = this.all().after(this);
  //   const succeedingWord = succeedingWords.firstTerms();
  //
  //   if (succeedingWord.found) {
  //     return succeedingWord;
  //   } return this.match(nothing);
  // };
