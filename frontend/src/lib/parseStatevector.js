// Parses the backend's statevector format, e.g.
//   "0.707+0.000j * |00> + 0.707+0.000j * |11>"
// or "-0.707+0.000j * |00> + 0.707-0.000j * |11>"
// Returns an array of length 2^n indexed by basis-state integer:
//   [{ state: "00", re, im, prob }, ...]
//
// Missing terms are filled with zero amplitudes so callers always see the
// full basis without doing the bookkeeping themselves.

const TERM_RE = /(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)([+-]\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)j\s*\*\s*\|([01]+)>/g;

export function parseStatevector(statevectorStr, numQubits) {
  const total = 2 ** numQubits;
  const result = Array.from({ length: total }, (_, i) => ({
    state: i.toString(2).padStart(numQubits, "0"),
    re: 0,
    im: 0,
    prob: 0,
  }));

  if (!statevectorStr || typeof statevectorStr !== "string") return result;

  for (const match of statevectorStr.matchAll(TERM_RE)) {
    const re = parseFloat(match[1]);
    const im = parseFloat(match[2]);
    const bits = match[3];
    const idx = parseInt(bits, 2);
    if (idx >= total) continue;
    result[idx] = { state: bits, re, im, prob: re * re + im * im };
  }

  return result;
}
