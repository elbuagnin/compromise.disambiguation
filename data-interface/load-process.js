import * as mfs from "../lib/filesystem.js";
import { processorsPath } from "./data-file-structure.js";
import path from "path";

export default function calledProcess(process) {
  function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
      return group1.toUpperCase();
    });
  }

  const processorFile = process + ".json";
  const processorName = camelCase(process);

  let json = mfs.loadJSONFile(
    path.join(processorsPath, processorFile)
  );

  const parsed = JSON.parse(json);
  const { fn } = parsed;

  // Thanks to stack overflow Kostiantyn question 36517173
  return fn;
}
