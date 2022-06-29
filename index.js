import nlp from "compromise";
import { playerpiano, setPlayerPianoOptions } from "compromise.playerpiano";
import processDoc from "./process-doc.js";
import { setOptions, disambiguateOptions } from "./config.js";

const disambiguation = {
  api: (View) => {
    View.prototype.disambiguate = function () {
      // if (arguments.length > 0) {
      //   setOptions(arguments);
      // }

      const playerPianoOptions = "verbose=instructions";
      setPlayerPianoOptions(playerPianoOptions);

      nlp.plugin(playerpiano);
      processDoc(this);
    };
  },
};

export default disambiguation;
