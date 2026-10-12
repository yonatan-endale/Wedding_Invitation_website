/**
 * Splits a line into the words the hero animates one by one. Only whitespace
 * separates words, so punctuation stays attached and an Ethiopic word is never
 * broken into its syllables.
 */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}
