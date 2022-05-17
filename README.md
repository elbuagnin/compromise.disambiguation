# compromise.disambiguation

## Very close to Beta

The purpose of Compromise Disambiguation is to analyze words that can be multiple
parts of speech and attempt to determine by context what part of speech they are
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
