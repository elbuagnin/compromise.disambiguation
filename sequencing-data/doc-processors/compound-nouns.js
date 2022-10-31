import { hasPOS } from "../../lib/word-helpers.js";

export default function compoundNouns(doc) {
    console.log("in compound nouns");
    
    const backToBackNouns = doc.match(
      "(#Noun && !#Pronoun) (#Noun && !#Pronoun)"
    );

    backToBackNouns.forEach(pair => {
      let test = true;
      const first = pair.match("^.").clone();
      const last = pair.match(".$").clone();

      if (!hasPOS(first.text("reduced"), "nn")) {
        test *= false;
      }
      if (!hasPOS(last.text("reduced"), "nn")) {
        test *= false;
      }

      if (test === true) {
        pair.tag("Resolved");
      }
    });
  
}
