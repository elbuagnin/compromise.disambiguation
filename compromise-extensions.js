import nlp from 'compromise';

nlp.extend((Doc, world) => {
  const nothing = nlp('');

  Doc.prototype.fix = function () { // eslint-disable-line
    const expandedContractions = this;
    if (expandedContractions.found) {
      const initialTags = nlp(expandedContractions.text()).out('tags');
      const expandedTags = expandedContractions.out('tags');

      if (initialTags !== expandedTags) {
        const words = expandedContractions.text().split(' ');

        words.forEach((word) => {
          const tags = initialTags[0][word];
          expandedContractions.match(word).tag(tags);
        });
      }
    }
  };

  Doc.prototype.addCustomTags = function (tagData) { // eslint-disable-line
    const obj = {};
    Object.keys(tagData).forEach((k) => {
      const tag = tagData[k];
      obj[k] = tag;
    });

    console.log('Custom Tags:');
    console.log(obj);
    world.addTags(obj);
  };

  Doc.prototype.addCustomWords = function (wordData) { // eslint-disable-line
    const obj = {};
    Object.keys(wordData).forEach((k) => {
      const word = wordData[k];
      obj[k] = word;
    });

    console.log('Custom Words:');
    console.log(obj);
    world.addWords(obj);
  };

  // Generates unique IDs for by Tag.
  const tagIDs = {};
  function* generateID(tag) {
    if (tag in tagIDs) {
      tagIDs[tag]++;
    } else {
      tagIDs[tag] = 0;
    }

    yield tag + tagIDs[tag];
  }

  Doc.prototype.tagWithID = function (tag) { // eslint-disable-line
    if (!tag) return;

    // Tag with syntax tag and unique id.
    const id = generateID(tag).next().value;

    // Tag original sentence.
    this.tag(tag);
    this.tag(id);
  };

  Doc.prototype.previous = function () { // eslint-disable-line
    const precedingWords = this.all().before(this);
    const precedingWord = precedingWords.lastTerms();

    if (precedingWord.found) {
      return precedingWord;
    } return this.match(nothing);
  };

    Doc.prototype.next = function () { // eslint-disable-line
    const succeedingWords = this.all().after(this);
    const succeedingWord = succeedingWords.firstTerms();

    if (succeedingWord.found) {
      return succeedingWord;
    } return this.match(nothing);
  };
});
