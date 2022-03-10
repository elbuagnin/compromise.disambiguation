import * as mfs from './lib/filesystem.js';

const posTestsFilePath = './data/pos-tests/';
const posTests = [];
const posTestSets = mfs.loadJSONDir(posTestsFilePath, true);

Object.values(posTestSets).forEach((testSet) => {
  Object.values(testSet).forEach((test) => {
    posTests.push(test);
  });
});

export default posTests;
