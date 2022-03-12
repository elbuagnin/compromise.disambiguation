import * as mfs from './lib/filesystem.js';

const posNameTableFile = './data/general/pos-name-table.json';
const posNameTable = mfs.loadJSONFile(posNameTableFile, 'array');

export default function posNameNormalize(posNameFromData) {
   let normalizedName = false;
   Object.values(posNameTable).forEach(pos => {
      if (pos.abbreviation === posNameFromData) {
        normalizedName = pos.fullname;
      } else if (pos.fullname === posNameFromData) {
        normalizedName = pos.fullname;
      }
   })

   return normalizedName;
}
