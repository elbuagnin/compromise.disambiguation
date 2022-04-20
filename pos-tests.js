import * as mfs from "./lib/filesystem.js";

const posTestsFilePath = "/data/pos-tests/";
const posTests = mfs.loadJSONDir(posTestsFilePath, true);

export default posTests;
