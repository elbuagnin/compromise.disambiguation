import * as mfs from "../lib/filesystem.js";
import { baseDataPath } from "./data-file-structure.js";
import path from "path";

export default function sequence() {
  const file = path.join(baseDataPath(), "sequence.json");
  return mfs.loadJSONFile(file, "array");
}
