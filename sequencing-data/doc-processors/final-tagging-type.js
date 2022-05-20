import { join } from "path";
import { disambiguateOptions } from "../../config.js";
import { loadJSONFile } from "../../lib/filesystem.js";
import { tagPatterns } from "../../lib/data-file-structure.js";

export default function processor(doc) {
  function convertTagsToCompromise() {
    const filepath = join(tagPatterns, "compromise-tag-conversions.json");
    const returnType = "array";
    const conversionList = loadJSONFile(filepath, returnType);

    conversionList.forEach((conversion) => {
      const { enhancedTag, compromiseTags, unTag } = conversion;
      const matches = doc.match(enhancedTag);

      matches.forEach((match) => {
        console.log(match);
        match.tag(compromiseTags);
        if (unTag === true) {
          match.unTag(enhancedTag);
        }
      });
    });
  }

  switch (disambiguateOptions.tagType) {
    case "enhanced":
      return;
    case "compromise":
    default:
      convertTagsToCompromise();
      break;
  }
}
