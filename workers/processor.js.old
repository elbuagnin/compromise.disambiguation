import devLogger from "../lib/dev-logger.js";
import * as docHelpers from "../lib/doc-helpers.js";
import calledProcess from "../data-interface/load-process.js";

// Run custom imported functions from calling module.
export default function process(doc, parsingData) {
  const { process } = parsingData;

  let before = docHelpers.surfaceCopy(doc); // for debugging output

  const fn = calledProcess(process);

  let procFn = new Function(fn.arguments, fn.body);
  devLogger(
    "instructions",
    fn.name,
    "header",
    "Running Processor Function: " + fn.name
  );

  procFn(doc);

  const after = docHelpers.surfaceCopy(doc); // for debugging output

  // Send debugging output if there is a change in the doc.
  if (docHelpers.equivalentDocs(before, after) === false) {
    devLogger("changes", doc, "header", "Processed: " + process);
  }
}
