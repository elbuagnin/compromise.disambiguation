import { hasPOS } from "./../../lib/word-helpers.js";

export default function processor(doc) {
    function compoundNouns(doc) {
    const backToBackNouns = doc.match(
      "(#Noun && !#Pronoun) (#Noun && !#Pronoun)"
    );

    backToBackNouns.forEach(pair => {
      let test = true;
      const first = pair.match("^.").clone();
      const last = pair.match(".$").clone();

      if (!helpers.hasPOS(first.text("reduced"), "nn")) {
        test *= false;
      }
      if (!helpers.hasPOS(last.text("reduced"), "nn")) {
        test *= false;
      }

      if (test === true) {
        pair.tag("Resolved");
      }
    });
  }
}
