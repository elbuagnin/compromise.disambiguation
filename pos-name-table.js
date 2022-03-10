import * as mfs from './lib/filesystem.js';

const posNameTableFile = './data/initialize/pos-name-table.json';
const posNameTable = mfs.loadJSONFile(posNameTableFile, 'array');

export default function posabbreviationToName(abbreviation) {
   let fullName = false;
   Object.values(posNameTable).forEach(pos => {
      if (pos.abbreviation === abbreviation) {
         fullName = pos.fullname;
      }
   })

   return fullName;
}
