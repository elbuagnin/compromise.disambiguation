export default function tagPunctuation(doc) {
	doc.sentences().forEach((sentence) => {
	  sentence.if("@hasPeriod").lastTerms().tag("Period");
	  sentence.if("@hasQuestionMark").lastTerms().tag("QuestionMark");
	  sentence.if("@hasExclamation").lastTerms().tag("ExclamationMark");
	  sentence.match("@hasComma").tag("Comma");
	  sentence.match("@hasSemicolon").tag("Semicolon");
	});
	
}