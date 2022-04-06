import { resolve } from 'path';
import { readFileSync as readFile, readdirSync as readDir } from 'fs';

export function getFileNames(dir, fileType) {
  const filenames = [];
  const dirents = readDir(dir, { withFileTypes: true });
  Object.values(dirents).forEach((dirent) => {
    const entry = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      getFileNames(entry, fileType);
    } else if (entry.substr(-5, 5) === fileType) { // a better way?
      filenames.push(entry);
    }
  });

  return filenames;
}

export function loadJSONFile(file, returnType = 'JSON') {
  let jsonObj = readFile(file, 'utf8', (err, data) => {
    if (err) {
      
    } else {
      jsonObj = JSON.parse(data);
    }
  });

  if (returnType === 'array') {
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
  const fileType = '.json';
  const dataObj = {};
  const dataArr = [];
  let dataset;

  const files = getFileNames(dir, fileType);

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
