// Compare two doc objects to see if they are equivalent in words and tags.
export function equivalentDocs(docA, docB) {
  let termListLength = 0;
  if (docA.length === docB.length) {
    termListLength = docA.length;

    let m = 0;

    for (let i = 0; i < termListLength; i++) {
      let n = 0;
      let tagCount = 0;
      const docATags = docA[i].tags;
      const docBTags = docB[i].tags;

      if (Object.keys(docATags).length === Object.keys(docBTags).length) {
        Object.keys(docATags).forEach((docATag) => {
          tagCount++;

          Object.keys(docBTags).forEach((docBTag) => {
            if (docATag === docBTag) {
              n++;
            }
          });
        });

        if (n === tagCount) {
          m++;
        }
      } else {
        return false;
      }
    }

    if (m === termListLength) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// Make a copy of doc of just what is needed for equivalentDocs().
export function surfaceCopy(doc) {
  const copy = doc.copy();
  const copycopy = copy.map((term) => {
    return { text: term.text, tags: term.tags };
  });
  return copycopy;
}
