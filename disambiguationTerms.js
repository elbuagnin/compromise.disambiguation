import * as mfs from './lib/filesystem.js';

const disambiguationFilePath = './data/disambiguation/';
const disambiguationTerms = (mfs.loadJSONDir(disambiguationFilePath, true));

export default function filterTerms(list) {
  const filteredTerms = disambiguationTerms.filter(term => (term.list === list));
  return filteredTerms;
}
