import nlp from "compromise";
import playerpiano from "compromise.playerpiano";
import path from "path";
import { setOptions, disambiguateOptions } from "./config.js";

const disambiguation = {
  api: (View) => {
    View.prototype.disambiguate = function () {
      if (arguments.length > 0) {
        setOptions(arguments);
      }

      nlp.plugin(playerpiano);
      const doc = nlp(this);
      const dataDir = "./sequencing-data/";
      const dataPath = path.normalize(dataDir);
      const playerPianoOptions = "verbose=results";
      doc.sequence(dataPath, playerPianoOptions);
    };
  },
};

export default disambiguation;
