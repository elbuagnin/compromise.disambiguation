import { pianoOptions } from "./playerPianoConfig.js";
import devLogger from "../lib/dev-logger.js";
import { surfaceCopy, equivalentDocs } from "../lib/doc-helpers.js";
import { loadJSONFile } from "../lib/filesystem.js";
import { sequencePath } from "../data-interface/data-file-structure.js";
import initialize from "./initialize.js";
import sequencer from "../workers/sequencer.js";

export default function startPlayerPiano(doc) {
  function snapshot(doc, format = "formatless", message = "") {
    if (pianoOptions.verbose !== "none") {
      devLogger("results", doc, format, message);
      return surfaceCopy(doc);
    } else {
      return false;
    }
  }

  initialize(doc);
  const entryDoc = snapshot(doc, "title", "Entry Document");
  const instructions = loadJSONFile(sequencePath, "array");
  sequencer(doc, instructions);
  const exitDoc = snapshot(doc, "title", "Exit Document");

  if (entryDoc !== false && exitDoc !== false) {
    if (!equivalentDocs(entryDoc, exitDoc)) {
      devLogger("results", "There are changes to the Document.", "header");
    }
  }
}
