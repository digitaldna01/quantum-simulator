export function parseStatevectorForQSphere(statevectorStr, numQubits) {
  if (!statevectorStr || typeof statevectorStr !== "string") return [];
  
  const terms = statevectorStr
    .split(/\s\+\s/) // ' + ' 기준으로 나누기 (복소수 내부의 +는 무시)
    .map(t => t.trim())
    .filter(Boolean);

  const result = [];

  const totalStates = 2 ** numQubits;
  const stateIndex = (s) => parseInt(s, 2);

  for (let term of terms) {
    const [ampStr, stateRaw] = term.split("*").map((s) => s.trim());
    const state = stateRaw.replace(/[|>]/g, "");
    const [re, im] = ampStr.replace("j", "").split("+").map(parseFloat);
    const complex = { re, im };
    const amplitude = Math.sqrt(re ** 2 + im ** 2);
    const phase = Math.atan2(im, re); // radians
    const index = stateIndex(state);

    // θ: polar angle from z-axis, φ: azimuthal angle
    const theta = Math.acos(2 * index / (totalStates - 1) - 1); // evenly spaced
    const phi = phase;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    result.push({
      state: `|${state}>`,
      amplitude,
      probability: amplitude ** 2,
      phase,
      x,
      y,
      z,
    });
  }

  return result;
}