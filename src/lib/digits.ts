const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Converts Bangla digits (০–৯) to ASCII and drops everything that isn't a digit. */
export function toAsciiDigits(input: string): string {
  let out = "";
  for (const ch of input) {
    const bangla = BANGLA_DIGITS.indexOf(ch);
    if (bangla >= 0) out += String(bangla);
    else if (ch >= "0" && ch <= "9") out += ch;
  }
  return out;
}

/**
 * Normalises whatever the learner typed or autofilled (01712345678,
 * +8801712345678, ০১৭১২৩৪৫৬৭৮) to the 10 national digits after +880.
 */
export function toBdNational(input: string): string {
  let digits = toAsciiDigits(input);
  if (digits.startsWith("880")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Bangladeshi mobile numbers: 1 followed by an operator digit 3–9, then 8 digits. */
export function isValidBdMobile(national: string): boolean {
  return /^1[3-9]\d{8}$/.test(national);
}

/** 1712345678 → "1712-345678", the way numbers are usually written in Bangladesh. */
export function formatBdNational(national: string): string {
  return national.length > 4 ? `${national.slice(0, 4)}-${national.slice(4)}` : national;
}
