import { resolve } from "path";
import { readFileSync as readFile, readdirSync as readDir } from "fs";

function resolvePath(path) {
  const baseDir = process.cwd();
  if (path.includes(baseDir)) {
    return path;
  } else {
    return baseDir + path;
  }
}

export function getFileNames(dir, fileType) {
  const path = resolvePath(dir);
  const filenames = [];
  const dirents = readDir(path, { withFileTypes: true });
  Object.values(dirents).forEach((dirent) => {
    const entry = resolve(path, dirent.name);
    if (dirent.isDirectory()) {
      getFileNames(entry, fileType);
    } else if (entry.substr(-5, 5) === fileType) {
      // a better way?
      filenames.push(entry);
    }
  });

  return filenames;
}

export function loadTextFile(file) {
  const path = resolvePath(file);
  let rawData = readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      rawData = data;
    }
  });

  const array = rawData
    .toString()
    .split("\n")
    .map((line) => {
      return line;
    });

  return array;
}

export function loadJSONFile(file, returnType = "JSON") {
  const path = resolvePath(file);
  let jsonObj = readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      jsonObj = JSON.parse(data);
    }
  });

  if (returnType === "array") {
    const array = [];
    Object.values(JSON.parse(jsonObj)).forEach((item) => {
      array.push(item);
    });
    return array;
  } else {
    return jsonObj;
  }
}

export function loadJSONDir(dir, list = false) {
  const fileType = ".json";
  const dataObj = {};
  const dataArr = [];
  let dataset;

  const path = resolvePath(dir);
  const files = getFileNames(path, fileType);

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
}
