export default function processor(doc) {
    function tagQuotations(doc) {
    const quotationGroups = doc.quotations();
    if (quotationGroups.found) {
      quotationGroups.firstTerms().tag("OpenQuote");
      quotationGroups.lastTerms().tag("CloseQuote");
    }
  }
}
