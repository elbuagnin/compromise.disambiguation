export default function tagQuotes(doc) {
	const quotationGroups = doc.quotations();
	if (quotationGroups.found) {
	  quotationGroups.firstTerms().tag("OpenQuote");
	  quotationGroups.lastTerms().tag("CloseQuote");
	}
	
}