import * as helpers from "./../../lib/word-helpers.js";

export default function ingVerbals(doc) {
  function isINGVerbal(word) {
    function stem(text) {
      function isVowel(character) {
        const vowels = "aeiou";
        if (vowels.includes(character)) {
          return true;
        } else {
          return false;
        }
      }

      function vowelPattern(string) {
        let pattern = "";
        Object.values(string).forEach(character => {
          if (isVowel(character) === true) {
            pattern += "v";
          } else {
            pattern += "c";
          }
        });

        return pattern;
      }

      text = text.substring(0, text.length - 3);
      const end = text.length;

      // Double character end
      if (text.charAt(end - 1) === text.charAt(end - 2)) {
        const doubleEnd = text.substring(end - 2);
        const shorted = text.substring(0, end - 1);

        switch (doubleEnd) {
          case "ee":
            break;
          case "bb":
            text = shorted;
            break;
          case "gg":
            text = shorted;
            break;
          case "ll":
            text = shorted;
            break;
          case "nn":
            text = shorted;
            break;
          case "pp":
            text = shorted;
            break;
          case "rr":
            text = shorted;
            break;
          case "tt":
            text = shorted;
            break;
          default:
            break;
        }

        return text;
      }

      // Ends in 'y'
      if (text.charAt(end - 1) === "y") {
        if (!isVowel(text.charAt(end - 2))) {
          text = text.substring(0, end - 1) + "ie";

          return text;
        }
      }

      // Ends in 'ck'
      if (text.substring(end - 2, end - 1) === "ck") {
        const option1 = text;
        const option2 = text.substring(0, end - 1);

        if (helpers.hasPOS(option1, "vv")) {
          return option1;
        } else if (helpers.hasPOS(option2, "vv")) {
          return option2;
        }
      }

      // Dropped 'e'
      if (vowelPattern(text.substring(end - 3, end)) === "cvc") {
        const option1 = text;
        const option2 = text + "e";

        if (helpers.hasPOS(option1, "vv")) {
          return option1;
        } else if (helpers.hasPOS(option2, "vv")) {
          return option2;
        }
      }

      // Default: no adjustments
      return text;
    }

    if (word.text().substring(word.text().length - 3) === "ing") {
      let stemmed = stem(word.text());
      if (helpers.hasPOS(stemmed, "vv")) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const INGs = doc.match("/ing$/");
  INGs.forEach(word => {
    if (isINGVerbal(word) === true) {
      word.tag("#ProgressiveVerbal");
    }
  });
}
