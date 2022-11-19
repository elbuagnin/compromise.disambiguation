# compromise.disambiguation

## Beta 0.9.0
Compromise.disambiguation is a plugin for the Natural Language Processor, Compromise, by SpencerMountain.

It augments Compromise by improving Part of Speech tagging accuracy.

It also expands on POS tagging to include more POSes, such as participles or direct objects.

Compromise Disambiguation analyzes words that can be multiple
parts of speech and attempts to determine by context what part of speech they are
actually serving in the text. It then assigns the corrected POS to the Compromise
tagging engine.

## Example
```
**************
ENTRY DOCUMENT

  ┌─────────
  │ 'We'       - Noun, Pronoun
  │ 'will'     - Noun, Singular, ProperNoun, Person
  │ 'grant'    - Noun, Singular, ProperNoun, Person
  │ 'you'      - Noun, Pronoun
  │ 'this'     - Determiner
  │ 'wish'     - Noun, Singular



*************
EXIT DOCUMENT

  ┌─────────
  │ 'We'       - Noun, Pronoun
  │ 'will'     - Verb, Auxiliary
  │ 'grant'    - Verb
  │ 'you'      - Noun, Pronoun
  │ 'this'     - Determiner
  │ 'wish'     - Noun, Singular
```

## Implement
### Install
From terminal in your module's folder:
```
npm install "github:elbuagnin/compromise.disambiguation"
```

### Import & Use
```
import nlp from "compromise";
import disambiguation from "compromise.disambiguation";

nlp.plugin(disambiguation);

// This module requires one initial run through to initialize the custom tags and word tagging.
const primeTheEngine = nlp('prime');
primeTheEngine.disambiguate();

// Let's parse our document and display the POS output.
let data = "We will grant you this wish.";
const doc = nlp(data);

doc.debug(); // Before

doc.disambiguate();

doc.debug(); // After
```
