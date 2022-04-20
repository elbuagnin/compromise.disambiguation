import * as mfs from "./lib/filesystem.js";

const file = "/data/general/sequence.json";
const sequence = mfs.loadJSONFile(file, "array");

export default sequence;
