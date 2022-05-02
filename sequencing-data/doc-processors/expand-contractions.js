export default function processor(doc) {
  doc.contractions().expand();
}
