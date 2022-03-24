import * as mfs from "./lib/filesystem.js";
import sequence from "./sequence.js";
import parse from "./parser.js";

export default function sequencer(document) {
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
          if (sentence.has("#Comma")) {
            const commas = sentence.match("#Comma");
            commas.forEach((comma) => {
              if (comma.ifNo("(#List|#CoordinatingAdjectives)").found) {
                chunks = chunks.splitAfter(comma);
              }
            });
          }

          chunks.forEach((chunk) => {
            console.log(chunk.text());
            parse(chunk, instruction);
          });
        }
      });
    }
  }

  function subSequencer(file) {
    const filepath = "./data/sub-sequences/" + file + ".json";
    console.log("  Using file: " + filepath);
    const returnType = "array";
    const subSequence = mfs.loadJSONFile(filepath, returnType);
    subSequence.sort((a, b) => a.order - b.order);

    subSequence.forEach((subInstruction) => {
      console.log(
        "   Sub-Sequence Instruction: " + JSON.stringify(subInstruction)
      );
      execute(subInstruction);
    });
  }

  // sequencer main

  const sentences = document.sentences();
  sequence.sort((a, b) => a.order - b.order);

  sequence.forEach((instruction) => {
    console.log(instruction);
    if (instruction.action === "sub-sequence") {
      subSequencer(instruction.payload.file);
    } else {
      execute(instruction);
    }
  });
}
