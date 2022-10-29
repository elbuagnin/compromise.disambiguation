import * as mfs from "../lib/filesystem.js";
import { classifierPatternsPath } from "./data-file-structure.js";

export default function classifyByPatternTests() {
  return mfs.loadJSONDir(classifierPatternsPath, true);
}
