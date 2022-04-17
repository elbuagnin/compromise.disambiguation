import initialize from "./initialize.js";
import sequencer from "./sequencer.js";

export const disambiguationPlugin = {
 api: (View) => {
   View.prototype.disambiguate = function () {
    initialize(this);
    sequencer(this);
    return this;
   }
 }
};
