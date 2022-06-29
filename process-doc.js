import path from "path";
import { loadJSONFile } from "./lib/filesystem.js";
import { dataPath, sequencePath } from "./lib/data-file-structure.js";
import runProcess from "./lib/run-process.js";

export default function processDoc(doc) {
  function execSubset(subSet) {
    if (subSet.length > 0) {
      doc.sequence(subSet);
      subSet = [];
    }
  }

  const instructions = loadJSONFile(sequencePath, "array");
  instructions[0] = { order: 1, baseDataPath: dataPath };
  var subSet = [];

  instructions.forEach((instruction) => {
    if (instruction.action === "process-direct") {
      execSubset(subSet);
      runProcess(doc, instruction.payload);
    } else {
      subSet.push(instruction);
    }
  });

  execSubset(subSet);
}
