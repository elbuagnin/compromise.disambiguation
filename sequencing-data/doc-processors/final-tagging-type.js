import { join } from "path";
import { disambiguateOptions } from "../../startup/disambiguationConfig.js";
import { loadJSONFile } from "../../lib/filesystem.js";
import { tagPatterns } from "../../lib/data-file-structure.js";

export default function finalTaggingType(doc) {
  function convertTagsToCompromise() {
    const filepath = join(tagPatterns, "compromise-tag-conversions.json");
    const returnType = "array";
    const conversionList = loadJSONFile(filepath, returnType);

    conversionList.forEach((conversion) => {
      const { enhancedTag, compromiseTags, unTag } = conversion;
      const matches = doc.match(enhancedTag);

      matches.forEach((match) => {
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
