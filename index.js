import startPlayerPiano from "./startup/startPlayerPiano.js";
import { setPlayerPianoOptions } from "./startup/playerPianoConfig.js";
import { setDisambiguationOptions } from "./startup/disambiguationConfig.js";

const disambiguation = {
  api: (View) => {
    View.prototype.disambiguate = function () {
      if (arguments.length > 0) {
        setDisambiguationOptions(arguments);
      }

      const playerPianoOptions = "verbose=details";
      setPlayerPianoOptions(playerPianoOptions);

      startPlayerPiano(this);
    };
  },
};

export default disambiguation;
