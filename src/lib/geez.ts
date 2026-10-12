/*
 * Ge'ez numerals. There is no zero and no place value: the number is read in
 * pairs of decimal digits from the right, each pair written as a tens sign and
 * a ones sign, and the pairs are joined by ፻ (hundred) and ፼ (ten thousand).
 * 2019 is twenty hundred and nineteen, ፳፻፲፱; a lone one before ፻ or ፼ is
 * left out, so 100 is ፻ and 10,000 is ፼.
 */

const ONES = ["", "፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱"];
const TENS = ["", "፲", "፳", "፴", "፵", "፶", "፷", "፸", "፹", "፺"];
const HUNDRED = "፻";
const TEN_THOUSAND = "፼";

/** 1 → "፩", 29 → "፳፱", 100 → "፻", 2019 → "፳፻፲፱". Zero, negatives and fractions fall back to plain digits. */
export function toGeez(n: number): string {
  if (!Number.isSafeInteger(n) || n < 1) return String(n);

  // Pairs of digits from the right: 2019 → [19, 20].
  const pairs: number[] = [];
  for (let rest = n; rest > 0; rest = Math.floor(rest / 100)) pairs.push(rest % 100);

  let out = "";
  for (let i = pairs.length - 1; i >= 0; i--) {
    const pair = pairs[i];
    const hundreds = i % 2 === 1;
    const sign = i === 0 ? "" : hundreds ? HUNDRED : TEN_THOUSAND;
    if (pair === 0) {
      // An empty ten-thousands pair still closes the count before it: 1,000,000 is ፻፼.
      if (sign === TEN_THOUSAND && out) out += sign;
      continue;
    }
    // A lone one is dropped before its sign, unless a ፻ just before would then run into the ፼ (1,010,000 is ፻፩፼).
    const bare = pair === 1 && sign !== "" && (out === "" || hundreds);
    out += (bare ? "" : TENS[Math.floor(pair / 10)] + ONES[pair % 10]) + sign;
  }
  return out;
}
