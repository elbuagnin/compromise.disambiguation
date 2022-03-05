import './compromise-extensions.js';
import * as mfs from './lib/filesystem.js';

export default function initialize(doc) {
  const baseDir = './data/initialize/';
  const tagDir = `${baseDir}tags/`;
  const wordDir = `${baseDir}words/`;

  const tags = mfs.loadJSONDir(tagDir, 'tags');
  const words = mfs.loadJSONDir(wordDir, 'words');

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Initialization');
  doc.addCustomTags(tags);
  doc.addCustomWords(words);

  console.log('Doc, post-Initialization');
  console.log(doc.debug());
}
