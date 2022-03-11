import * as mfs from './lib/filesystem.js';

const file = './sequence.json';
const sequence = mfs.loadJSONFile(file, 'array');

export default sequence;
