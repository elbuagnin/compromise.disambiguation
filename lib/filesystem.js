import { resolve, isAbsolute, extname } from "path";
import { readFileSync as readFile, readdirSync as readDir } from "fs";

function resolvePath(filepath) {
  if (isAbsolute(filepath)) {
    return filepath;
  } else {
    return resolve(filepath);
  }
  // const baseDir = process.cwd();
  // if (filepath.includes(baseDir)) {
  //   return filepath;
  // } else {
  //   return baseDir + filepath;
  // }
}

export function getFileNames(dir, fileType) {
  const filepath = resolvePath(dir);
  const filenames = [];

  try {
    const dirents = readDir(filepath, { withFileTypes: true });
    Object.values(dirents).forEach((dirent) => {
      const entry = resolve(filepath, dirent.name);
      if (dirent.isDirectory()) {
        getFileNames(entry, fileType);
      } else if (extname(entry) === fileType) {
        filenames.push(entry);
      } else {
        console.warn(`Filetype mismatch: ${entry} != *${fileType}.`);
      }
    });

    return filenames;
  } catch (err) {
    throw new Error(err);
  }
}

export function loadTextFile(file) {
  const filepath = resolvePath(file);

  try {
    let rawData = readFile(filepath, "utf8");

    const array = rawData
      .toString()
      .split("\n")
      .map((line) => {
        return line;
      });

    return array;
  } catch (err) {
    throw new Error(err);
  }
}

export function loadJSONFile(file, returnType = "JSON") {
  const filepath = resolvePath(file);
  try {
    let jsonObj = readFile(filepath, "utf8");

    if (returnType === "array") {
      const array = [];
      Object.values(JSON.parse(jsonObj)).forEach((item) => {
        array.push(item);
      });
      return array;
    } else {
      return jsonObj;
    }
  } catch (err) {
    throw new Error(err);
  }
}

export function loadJSONDir(dir, list = false) {
  const fileType = ".json";
  const dataObj = {};
  const dataArr = [];
  let dataset;

  const filepath = resolvePath(dir);
  try {
    const files = getFileNames(filepath, fileType);

    files.forEach((file) => {
      let data = loadJSONFile(file);
      data = JSON.parse(data);

      if (list === true) {
        Object.values(data).forEach((entry) => {
          dataArr.push(entry);
        });
        dataset = dataArr;
      } else {
        Object.assign(dataObj, data);
        dataset = dataObj;
      }
    });
    return dataset;
  } catch (err) {
    throw new Error(err);
  }
}
