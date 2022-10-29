import startPlayerPiano from "./startup/startPlayerPiano.js";
import { setPlayerPianoOptions } from "./startup/playerPianoConfig.js";
//import processDoc from "./process-doc.js";
import { setDisambiguationOptions } from "./startup/disambiguationConfig.js";

const disambiguation = {
  api: (View) => {
    View.prototype.disambiguate = function () {
      if (arguments.length > 0) {
        setDisambiguationOptions(arguments);
      }

      const playerPianoOptions = "verbose=instructions";
      setPlayerPianoOptions(playerPianoOptions);

      startPlayerPiano(this);
      //processDoc(this);
    };
  },
};

export default disambiguation;
