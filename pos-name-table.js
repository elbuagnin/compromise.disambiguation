import * as mfs from './lib/filesystem.js';

const posNameTableFile = './data/general/pos-name-table.json';
const posNameTable = mfs.loadJSONFile(posNameTableFile, 'array');

export default function posNameNormalize(posNameFromData) {
   const lowerCasePosNameFromData = posNameFromData.toLowerCase();
   let normalizedName = false;
   Object.values(posNameTable).forEach(pos => {
      if (pos.abbreviation === lowerCasePosNameFromData) {
        normalizedName = pos.fullname;
      } else if (pos.fullname === lowerCasePosNameFromData) {
        normalizedName = pos.fullname;
      }
   })

   return normalizedName;
}
