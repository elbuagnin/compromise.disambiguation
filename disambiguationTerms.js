import * as mfs from './lib/filesystem.js';

const disambiguationFilePath = './data/disambiguation/';
const disambiguationTerms = (mfs.loadJSONDir(disambiguationFilePath, true));

export default (disambiguationTerms);
