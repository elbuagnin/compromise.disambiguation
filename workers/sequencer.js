import path from "path";
import * as mfs from "../lib/filesystem.js";
import { subSequencesPath } from "../data-interface/data-file-structure.js";
import devLogger from "../lib/dev-logger.js";
import parse from "./parser.js";

export default function sequencer(document, instructions) {
  function execute(instruction) {
    const { scope } = instruction;

    if (scope === "document") {
      parse(document, instruction);
    } else {
      sentences.forEach((sentence) => {
        if (scope === "sentence") {
          parse(sentence, instruction);
        } else {
          // Scope = 'phrase' assumed
          let chunks = sentence;
          if (sentence.has("#PhraseBreak")) {
            const phraseBreaks = sentence.match("#PhraseBreak");
            phraseBreaks.forEach((phraseBreak) => {
              chunks = chunks.splitAfter(phraseBreak);
            });
          }

          chunks.forEach((chunk) => {
            parse(chunk, instruction);
          });
        }
      });
    }
  }

  function subSequencer(file) {
    const filepath = path.join(subSequencesPath, file + ".json");

    let subSequence = [];
    const returnType = "array";
    subSequence = mfs.loadJSONFile(filepath, returnType);
    subSequence.sort((a, b) => a.order - b.order);
    subSequence.forEach((subInstruction) => {
      devLogger(
        "instructions",
        subInstruction,
        "subtitle",
        "sub-sequence instruction"
      );
      execute(subInstruction);
    });
  }

  // sequencer main

  const sentences = document.sentences();
  instructions.sort((a, b) => a.order - b.order);

  instructions.forEach((instruction, key) => {
    devLogger("instructions", instruction, "title", "instruction");

      if (instruction.action) {
      if (instruction.action === "sub-sequence") {
        subSequencer(instruction.payload.file);
      } else {
        execute(instruction);
      }
    }

    devLogger("changes", document, "label", "post-instruction");
  });
}
