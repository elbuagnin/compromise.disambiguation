import { pianoOptions } from "../startup/playerPianoConfig.js";

export default function devLogger(
  verbosity,
  output,
  format = "formatless",
  label = ""
) {
  function logOutput(output, format, label) {
    let banner = "";
    let outputType = typeof output;

    if (outputType === "object") {
      if (
        output.constructor.name === "View" ||
        output.constructor.name === "Sentences"
      ) {
        outputType = "doc";
      }
    }

    if (outputType === "number") {
      outputType = "string";
    }

    let layout = label !== "" ? "label" : "nolabel";
    layout += "#" + format + "#" + outputType;
    let prefix = "";

    if (layout.includes("label")) {
      prefix = "---";
    }

    switch (layout) {
      case "label#subtitle#string":
        label = label.toUpperCase();
        output = output.toUpperCase();
        console.log("\n" + prefix + label + ": " + output);
        break;
      case "label#header#string":
        banner = banner.padStart(label.length + 3, "-");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(prefix + label + ": " + output);
        break;
      case "label#label#string":
        label = label[0].toUpperCase() + label.substring(1);
        console.log(prefix + label + ": " + output);
        break;
      case "nolabel#title#string":
        banner = banner.padStart(output.length, "*");
        output = output.toUpperCase();
        console.log("\n" + banner);
        console.log(output);
        break;
      case "nolabel#subtitle#string":
        banner = banner.padStart(output.length, "+");
        output = output.toUpperCase();
        console.log("\n" + banner);
        console.log(output);
        break;
      case "nolabel#header#string":
        banner = banner.padStart(output.length, "-");
        output = output.toUpperCase();
        console.log("\n" + banner);
        console.log(output);
        break;
      case "nolabel#subheader#string":
        console.log(output + "\n");
        break;
      case "nolabel#formatless#string":
        console.log(output);
        break;
      case "label#title#object":
        banner = banner.padStart(label.length, "*");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        console.log(JSON.stringify(output));
        break;
      case "label#subtitle#object":
        banner = banner.padStart(label.length, "+");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        console.log(JSON.stringify(output));
        break;
      case "label#header#object":
        banner = banner.padStart(label.length + 3, "-");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        console.log(JSON.stringify(output));
        break;
      case "label#label#object":
        label = label[0].toUpperCase() + label.substring(1);
        console.log(prefix + label + JSON.stringify(output));
        break;
      case "nolabel#formatless#object":
        console.log(JSON.stringify(output));
        break;
      case "label#title#doc":
        banner = banner.padStart(label.length, "*");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        output.debug();
        break;
      case "label#subtitle#doc":
        banner = banner.padStart(label.length, "+");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        output.debug();
        break;
      case "label#header#doc":
        banner = banner.padStart(label.length, "-");
        label = label.toUpperCase();
        console.log("\n" + banner);
        console.log(label);
        output.debug();
        break;
      case "label#label#doc":
        label = label[0].toUpperCase() + label.substring(1);
        console.log("\n" + prefix + label);
        output.debug();
        break;
      case "nolabel#formatless#doc":
        output.debug();
        break;
      default:
        break;
    }
  }

  // Main
  const { verbose } = pianoOptions;
  let showIt = false;
  let level = 0;

  if (verbose !== "none" && verbose !== false && verbose !== undefined) {
    switch (verbosity) {
      case "results":
        level = 1;
        break;
      case "instructions":
        level = 2;
        break;
      case "changes":
        level = 3;
        break;
      case "workers":
        level = 4;
        break;
      case "details":
        level = 5;
        break;
      default:
        level = 0;
        break;
    }

    switch (verbose) {
      case "details":
        if (level <= 5) {
          showIt = true;
        }
        break;
      case "workers":
        if (level <= 4) {
          showIt = true;
        }
        break;
      case "changes":
        if (level <= 3) {
          showIt = true;
        }
        break;
      case "instructions":
        if (level <= 2) {
          showIt = true;
        }
        break;
      case "results":
        if (level <= 1) {
          showIt = true;
        }
        break;
      default:
        showIt = true;
        break;
    }

    if (showIt === true) {
      logOutput(output, format, label);
    }
  }
}
