/*
  Indian number typesetting.
  Zerodha, Groww and Jupiter never show "284,193" or "millions" to a domestic
  audience. Grouping is 2-2-3 from the right and scale words are lakh / crore.
  The rupee sign is prefixed with no space and must never orphan at a line end.
*/

const IN = "en-IN";

/** 284193 -> "2,84,193" */
export function inNum(n: number, decimals = 0): string {
  return n.toLocaleString(IN, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** 249 -> "₹249"  (non-breaking, so the glyph never wraps away from the digits) */
export function inr(n: number, decimals = 0): string {
  return `₹⁠${inNum(n, decimals)}`;
}

/** 2840000 -> "28.4 lakh" · 16000000 -> "1.6 crore" */
export function lakhCrore(n: number): string {
  if (n >= 1_00_00_000) {
    const c = n / 1_00_00_000;
    return `${c % 1 === 0 ? c : c.toFixed(1)} crore`;
  }
  if (n >= 1_00_000) {
    const l = n / 1_00_000;
    return `${l % 1 === 0 ? l : l.toFixed(1)} lakh`;
  }
  return inNum(n);
}
