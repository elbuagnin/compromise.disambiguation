export default function processor(doc) {
  const quotationGroups = doc.quotations();
  if (quotationGroups.found) {
    quotationGroups.firstTerms().tag("OpenQuote");
    quotationGroups.lastTerms().tag("CloseQuote");
  }
}
