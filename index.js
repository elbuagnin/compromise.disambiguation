import initialize from "./initialize.js";
import sequencer from "./sequencer.js";

export default function disambiguation(Doc, world) {
  Doc.prototype.disambiguation = function () {
    const document = this;

    initialize(document);
    sequencer(document);
  };
}
