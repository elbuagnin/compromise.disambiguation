export default function tagParentheses(doc) {
	const parenthesesGroups = doc.parentheses();
	if (parenthesesGroups.found) {
	  parenthesesGroups.firstTerms().tag("OpenParentheses");
	  parenthesesGroups.lastTerms().tag("CloseParentheses");
	}
	
}